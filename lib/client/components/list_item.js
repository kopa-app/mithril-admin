'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../util');

var c = module.exports = {
  theme: {
    class: '',
    fieldClass: '',
    actionsClass: '',
    actionClass: ''
  },
  actions: {
    edit: function (scope, context) {
      return m('button.m-admin-button' + c.theme.actionClass, {
        onclick: scope.toggleEditing,
      }, scope.editing ? 'Cancel editing' : 'Edit');
    },
    show: function (scope, context) {
      return m('a.m-admin-button' + c.theme.actionClass, {
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
  views: {
    fields: function (scope, context, opts) {
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

        return m('td.m-admin-list-item-field.m-admin-list-item-field-' + fieldName + c.theme.fieldClass,
          fieldName === context.resource.primaryKey ?
            m('a', { href: context.resource.adminUrlFor(context.item) }, content)
          : content
        );
      }

      return context.resource.listFields.map(fieldView);
    },
    actions: function (scope, context, opts) {
      function actionView(action) {
        var view = action;
        if (typeof action === 'string') {
          view = c.actions[action] || null;
        }
        return view ? view(scope, context) : null;
      }

      return opts.actions ? opts.actions.map(actionView) : null;
    }
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    var childContext = _.clone(context);
    childContext.action = scope.editing ? 'edit' : context.action;

    if (scope.editing) {
      return m('tr.m-admin-list-item' + c.theme.class, { key: context.resource.name + '-' + context.resource.id(context.item) },
        m('td[colspan="' + (context.resource.listFields.length + 1) + '"]', [
          m('.m-admin-list-item-actions' + c.theme.actionsClass, opts.actions ? c.views.actions(scope, context, opts) : null),
          m.component(context.app.components.fields.resource, childContext)
        ])
      );
    }

    return m('tr.m-admin-list-item' + c.theme.class, c.views.fields(scope, context, opts).concat(
      m('td.m-admin-list-item-actions' + c.theme.actionsClass, opts.actions ? c.views.actions(scope, context, opts) : null)
    ));
  }
};
