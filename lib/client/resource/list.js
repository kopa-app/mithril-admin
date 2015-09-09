'use strict';

var m = require('mithril');
var util = require('../../util');
var pluralize = require('pluralize');

module.exports = function (app) {
  return {
    controller: function () {
      var scope = {};

      scope.loading = true;
      scope.resource = app.resource.current();
      scope.items = [];

      setImmediate(function () {
        scope.resource.load()
          .then(function (result) {
            scope.items = result;
            scope.loading = false;
          })
      });

      return scope;
    },
    view: function (scope) {
      var context = {
        resource: scope.resource,
        items: scope.items,
        app: app,
        action: 'list'
      };

      return m('section.m-admin-list', [
        m('a.m-admin-button', {
          href: util.urlFor(context.app.basePath)
        }, 'to Dashboard'),
        m('h2', pluralize(scope.resource.name || '')),
        scope.loading ?
          m.component(app.components.loadIndicator)
        : m.component(app.components.list, context, {
          actions: ['show', 'edit', 'remove']
        })
      ]);
    }
  };
};
