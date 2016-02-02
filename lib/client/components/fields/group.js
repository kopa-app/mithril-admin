'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');

var c = module.exports = {
  isNested: true,
  theme: {
    class: '',
    titleClass: '',
    fieldClass: '',
    fieldTag: '',
    toggleButtonClass: ''
  },
  controller: function (context, opts) {
    var scope = {};

    scope.toggle = function (event) {
      event.preventDefault();
      scope.collapsed = !scope.collapsed;
    };

    scope.normalizeOpts = function(opts) {
      var opts = opts || {};

      if (typeof opts === 'function') {
        opts = opts(context);
      }

      opts.collapsible = (typeof opts.collapsible !== 'undefined') ? opts.collapsible : true;

      return opts;
    };

    scope.isEditing = function () {
      return context.action === 'edit' || context.action === 'create';
    };

    scope.getFieldComponent = function (opts) {
      var component = typeof opts.component === 'string' ?
        context.app.components.fields[opts.component] || null
      : opts.component;

      if (!component) {
        throw new Error('Field component "' + field.component + '" does not exist.');
      }

      return component;
    };

    opts = scope.normalizeOpts(opts);
    scope.collapsed = (typeof opts.collapsed !== 'undefined') ? opts.collapsed : true;

    return scope;
  },
  views: {
    field: function(scope, context, opts, name) {
      var field = opts.fields[name];
      var editing = scope.isEditing();
      var component = scope.getFieldComponent(field);

      // support dynamic field config
      if (typeof field === 'function') {
        field = field(context);
      }

      var childContext = _.clone(context);
      childContext.item = component.isNested ? context.item[name] : context.item;
      childContext.fieldName = name;

      // auto-create nested items
      if (component.isNested && !childContext.item) {
        childContext.item = {};
      }

      return m(c.theme.fieldTag + '.m-admin-field' + c.theme.fieldClass,
        ['relation', 'group'].indexOf(field.component) !== -1 ||
        (editing && field.component === 'hidden' || field.label === false) ?
          m.component(component, childContext, field)
        : [
          c.views.fieldLabel(scope, childContext, field),
          c.views.fieldInput(scope, childContext, field)
        ]
      );
    },
    fieldLabel: function (scope, context, opts) {
      return m.component(
        context.app.components.fields.label,
        context,
        opts
      );
    },
    fieldInput: function (scope, context, opts) {
      var component = scope.getFieldComponent(opts);
      return m.component(component, context, opts);
    },
    toggleButton: function (scope, context, opts) {
      return m('button.m-admin-button.m-admin-group-toggle' + c.theme.toggleButtonClass, {
        onclick: scope.toggle
      }, scope.collapsed ? '+' : '-');
    }
  },
  view: function (scope, context, opts) {
    opts = scope.normalizeOpts(opts);
    var editing = scope.isEditing();

    return m((editing ? 'fieldset' : '') + '.m-admin-group' + c.theme.class, [
      (opts.label === false && !opts.collapsible) ?
        null
      : m((editing ? 'legend' : 'h3') + '.m-admin-group-title' + c.theme.titleClass, [
        opts.collapsible ?
          c.views.toggleButton(scope, context, opts)
        : null,
        (opts.label !== false) ?
          opts.label || context.fieldName
        : null
      ]),
      opts.collapsible && scope.collapsed ?
        null
      : Object.keys(opts.fields)
        .map(c.views.field.bind(null, scope, context, opts))
    ]);
  }
};
