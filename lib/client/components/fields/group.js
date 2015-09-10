'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');

module.exports = {
  isNested: true,
  controller: function (context, opts) {
    opts = opts || {};
    var scope = {};

    opts.collapsible = (typeof opts.collapsible !== 'undefined') ? opts.collapsible : true;
    scope.collapsed = (typeof opts.collapsed !== 'undefined') ? opts.collapsed : true;

    scope.toggle = function (event) {
      event.preventDefault();
      scope.collapsed = !scope.collapsed;
    };

    return scope;
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    function fieldView(name) {
      var field = opts.fields[name];
      var component = typeof field.component === 'string' ?
        context.app.components.fields[field.component] || null
      : field.component;

      if (!component) {
        throw new Error('Field component "' + field.component + '" does not exist.');
      }

      var childContext = _.clone(context);
      childContext.item = component.isNested ? context.item[name] : context.item;
      childContext.fieldName = name;
      
      return m('.m-admin-field',
        ['relation', 'group'].indexOf(field.component) !== -1 ||
        (context.action === 'edit' && field.component === 'hidden') ?
          m.component(component, childContext, field)
        : m.component(
          context.app.components.fields.label,
          childContext,
          field,
          m.component(component, childContext, field)
        )
      );
    }

    return m((context.action === 'edit' ? 'fieldset' : '') + '.m-admin-group', [
      (opts.label === false && !opts.collapsible) ?
        null
      : m((context.action === 'edit' ? 'legend' : 'h3') + '.m-admin-group-title', [
        opts.collapsible ?
          m('button.m-admin-button.m-admin-group-toggle', {
            onclick: scope.toggle
          }, scope.collapsed ? '+' : '-')
        : null,
        (opts.label !== false) ?
          opts.label || context.fieldName
        : null
      ]),
      opts.collapsible && scope.collapsed ? null : Object.keys(opts.fields).map(fieldView)
    ]);
  }
};
