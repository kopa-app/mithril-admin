'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');
var pluralize = require('pluralize');

var c = module.exports = {
  theme: {
    class: '',
    noItemsClass: '',
    itemClass: '',
    actionsClass: ''
  },
  actions: {
    show: function (scope, context, index) {
      return m('a.m-admin-button', {
        href: context.resource.adminUrlFor(context.item)
      }, 'Show ' + context.resource.name);
    },
    edit: function (scope, context, index) {
      return m('button.m-admin-button', {
        onclick: scope.toggleEditing(index)
      }, scope.editing[index] ? 'Cancel editing' : 'Edit ' + context.resource.name);
    }
  },
  controller: function (context) {
    var scope = {};
    scope.editing = {};

    scope.toggleEditing = function (index) {
      return function (event) {
        event.preventDefault();
        scope.editing[index] = !scope.editing[index];
      };
    };

    return scope;
  },
  views: {
    noItems: function (scope, context, opts) {
      return m('p' + c.theme.noItemsClass, 'No ' + (opts.label || pluralize(context.resource.name)) + ' yet.');
    }
  },
  view: function (scope, context, opts) {
    function itemView(item, index) {
      var childContext = _.clone(context);
      childContext.item = item;
      childContext.action = scope.editing[index] ? 'edit' : context.action;

      function actionView(action) {
        var view = action;
        if (typeof action === 'string') {
          view = module.exports.actions[action];
        }
        return view ? view(scope, context, index) : null;
      }

      return m('li' + c.theme.itemClass, { key: context.resource.name + '-' + context.resource.id(item) }, [
        m('.m-admin-actions' + c.theme.actionsClass,
          opts.actions.map(actionView)
        ),

        m.component(context.app.components.fields.resource, childContext)
      ]);
    }

    return context.items.length ?
      m('ul.m-admin-resource-list' + c.theme.class,
        context.items.map(itemView)
      )
    : c.views.noItems(scope, context, opts);
  }
};
