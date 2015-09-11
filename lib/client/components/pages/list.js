'use strict';

var m = require('mithril');
var util = require('../../../util');
var pluralize = require('pluralize');

var state = {
  resource: null,
  items: [],
  total: -1
};

function resetState() {
  state.resource = null;
  state.items = [];
  state.total = -1;
}

module.exports = function (app) {
  return {
    controller: function () {
      var scope = {};

      scope.loading = true;
      scope.resource = app.resource.current();

      if (state.resource !== scope.resource) {
        resetState();
        state.resource = scope.resource;
      }

      scope.items = state.items;
      scope.page = parseInt(m.route.param('page')) || 1;
      scope.perPage = app.perPage;
      scope.total = state.total;

      scope.loadPage = function (page) {
        scope.loading = true;

        setImmediate(function () {
          scope.resource.load({
            page: page,
            perPage: scope.perPage
          })
            .then(function (res) {
              state.items = res.data;
              scope.items = state.items;
              state.total = res.total || -1;
              scope.total = state.total;
              scope.loading = false;
            });
        });
      };

      scope.onPageChange = function (page) {
        window.location.href = scope.resource.adminUrlFor(null, '?page=' + page);
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
        // TODO: move this into a seperate component/view
        m('a.m-admin-button', {
          href: util.urlFor(context.app.basePath)
        }, 'to Dashboard'),
        m('h2', pluralize(scope.resource.name || '')),
        scope.loading ? m.component(app.components.loadIndicator) : null,

        m('a.m-admin-button', {
          href: scope.resource.adminUrlFor(null, '/create')
        }, 'Create ' + scope.resource.name),

        m.component(app.components.pagination, context, paginationOpts),
        m.component(app.components.list, context, {
          actions: ['edit', 'show']
        }),
        m.component(app.components.pagination, context, paginationOpts)
      ]);
    }
  };
};
