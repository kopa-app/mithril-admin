'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    opts = opts || {};

    function fieldView(fieldName) {
      var component;
      var childContext = _.clone(context);
      childContext.fieldName = fieldName;
      var content = context.item[fieldName] || '';
      var field = context.resource.fields[fieldName];

      if (field) {
        component = typeof field.component === 'string' ?
          context.app.components.fields[field.component] || null
        : field.component;
      }

      if (component) {
        content = m.component(component, childContext);
      }

      return m('td',
        fieldName === context.resource.primaryKey ?
          m('a', { href: context.resource.adminUrlFor(context.item) }, content)
        : content
      );
    }

    function actionView(action) {
      return m('a.m-admin-button', {
        href: context.resource.adminUrlFor(context.item, '/' + action)
      }, action);
    }

    return m('tr', context.resource.listFields.map(fieldView).concat(
      m('td', opts.actions ?
        opts.actions.map(actionView)
      : null)
    ));
  }
};
