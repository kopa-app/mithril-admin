'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');

module.exports = {
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
  view: function (scope, context, opts) {
    function itemView(item, index) {
      var childContext = _.clone(context);
      childContext.item = item;
      childContext.action = scope.editing[index] ? 'edit' : context.action;

      return m('li', [
        m('button.m-admin-button', {
          onclick: scope.toggleEditing(index)
        }, scope.editing[index] ? 'Cancel editing' : 'Edit ' + context.resource.name),

        m('a.m-admin-button', {
          href: context.resource.adminUrlFor(context.item, '/show')
        }, 'Show ' + context.resource.name),

        m('a.m-admin-button', {
          href: context.resource.adminUrlFor(context.item, '/remove')
        }, 'Remove ' + context.resource.name),

        m.component(context.app.components.fields.resource, childContext)
      ]);
    }

    return m('ul.m-admin-resource-list',
      context.items.map(itemView)
    );
  }
};
