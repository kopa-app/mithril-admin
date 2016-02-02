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
    actionsClass: '',
    actionClass: ''
  },
  actions: {
    show: function (scope, context, index) {
      return m('a.m-admin-button' + c.theme.actionClass, {
        onclick: scope.toggleShowing
      }, scope.state[index] ? 'Collapse' : 'Expand');
    },
    edit: function (scope, context, index) {
      return m('button.m-admin-button' + c.theme.actionClass, {
        onclick: scope.toggleEditing(index)
      }, scope.state[index] === 'editing' ? 'Cancel editing' : 'Edit ' + context.resource.name);
    },
    open: function (scope, context) {
      return m('a.m-admin-button' + c.theme.actionClass, {
        href: context.resource.adminUrlFor(context.item)
      }, 'Open ' + context.resource.name);
    }
  },
  controller: function (context) {
    var scope = {};
    scope.state = {};

    scope.toggleEditing = function (index) {
      return function (event) {
        event.preventDefault();
        scope.state[index] = scope.state[index] ? null : 'editing';
      };
    };

    scope.toggleShowing = function (index) {
      return function (event) {
        event.preventDefault();
        scope.state[index] = scope.state[index] ? null : 'showing';
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
      childContext.action = scope.state[index] === 'editing' ? 'edit' : (scope.state[index] === 'showing' ? 'show' : context.action);

      function actionView(action) {
        var view = action;
        if (typeof action === 'string') {
          view = module.exports.actions[action];
        }
        return view ? view(scope, childContext, index) : null;
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
