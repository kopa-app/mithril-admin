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
      scope.page = 1;
      scope.perPage = app.perPage;
      scope.total = -1;

      scope.loadPage = function (page) {
        setImmediate(function () {
          scope.resource.load(null, {
            page: page,
            perPage: scope.perPage
          })
            .then(function (result) {
              scope.items = result.data;
              scope.total = result.total || -1;
              scope.loading = false;
            })
        });
      };

      scope.onPageChange = function (page) {
        scope.page = page;
        scope.loadPage(scope.page);
      };

      scope.loadPage(scope.page);

      return scope;
    },
    view: function (scope) {
      var context = {
        resource: scope.resource,
        items: scope.items,
        app: app,
        action: 'list'
      };

      var paginationOpts = {
        page: scope.page,
        perPage: scope.perPage,
        total: scope.total,
        onPageChange: scope.onPageChange
      };

      return m('section.m-admin-list', [
        m('a.m-admin-button', {
          href: util.urlFor(context.app.basePath)
        }, 'to Dashboard'),
        m('h2', pluralize(scope.resource.name || '')),
        scope.loading ?
          m.component(app.components.loadIndicator)
        : [
          m.component(app.components.pagination, context, paginationOpts),
          m.component(app.components.list, context, {
            actions: ['show', 'edit', 'remove']
          }),
          m.component(app.components.pagination, context, paginationOpts)
        ]
      ]);
    }
  };
};
