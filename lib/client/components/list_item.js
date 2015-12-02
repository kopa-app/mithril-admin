'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../util');

module.exports = {
  actions: {
    edit: function (scope, context) {
      return m('button.m-admin-button', {
        onclick: scope.toggleEditing,
      }, scope.editing ? 'Cancel editing' : 'Edit');
    },
    show: function (scope, context) {
      return m('a.m-admin-button', {
        href: context.resource.adminUrlFor(context.item)
      }, 'Show');
    }
  },
  controller: function (context) {
    var scope = {};

    scope.editing = false;

    scope.toggleEditing = function (event) {
      event.preventDefault();
      scope.editing = !scope.editing;
    };

    return scope;
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    var childContext = _.clone(context);
    childContext.action = scope.editing ? 'edit' : context.action;

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
        content = m.component(component, childContext, field);
      }

      return m('td.m-admin-list-item-field.m-admin-list-item-field-' + fieldName,
        fieldName === context.resource.primaryKey ?
          m('a', { href: context.resource.adminUrlFor(context.item) }, content)
        : content
      );
    }

    function actionView(action) {
      var view = action;
      if (typeof action === 'string') {
        view = module.exports.actions[action] || null;
      }
      return view ? view(scope, context) : null;
    }

    if (scope.editing) {
      return m('tr.m-admin-list-item', { key: context.resource.name + '-' + context.resource.id(context.item) },
        m('td[colspan="' + (context.resource.listFields.length + 1) + '"]', [
          opts.actions ? opts.actions.map(actionView) : null,
          m.component(context.app.components.fields.resource, childContext)
        ])
      );
    }

    return m('tr.m-admin-list-item', context.resource.listFields.map(fieldView).concat(
      m('td.m-admin-list-item-actions', opts.actions ? opts.actions.map(actionView) : null)
    ));
  }
};
