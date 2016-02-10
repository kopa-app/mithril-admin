'use strict';

var m = require('mithril');
var util = require('../../../util');
var pluralize = require('pluralize');
var merge = require('lodash/object/merge');

var state = {
  resource: null,
  items: [],
  total: -1,
  filters: {},
  sort: { by: null, dir: 'asc' }
};

function resetState() {
  state.resource = null;
  state.items = [];
  state.total = -1;
  state.filters = {};
  state.sort = { by: null, dir: 'asc' };
}

var c = module.exports = function (app) {
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
      scope.filters = state.filters;
      scope.sort = state.sort;

      scope.loadPage = function (page) {
        scope.loading = true;

        setImmediate(function () {
          scope.resource.load(merge({
            page: page,
            perPage: scope.perPage,
            sortBy: scope.sort.by,
            sortDir: scope.sort.dir
          }, scope.filters))
            .then(function (res) {
              state.items = res.data;
              util.arrReplace(scope.items, state.items);
              state.total = res.total || -1;
              scope.total = state.total;
              scope.loading = false;
            });
        });
      };

      scope.onPageChange = function (page) {
        window.location.href = scope.resource.adminUrlFor(null, '?page=' + page);
      };

      scope.applyFilters = function () {
        scope.loadPage(scope.page);
      };

      scope.loadPage(scope.page);

      scope.context = {
        resource: scope.resource,
        items: scope.items,
        filters: scope.filters,
        sort: scope.sort,
        app: app,
        action: 'list'
      };

      return scope;
    },
    view: function (scope) {
      return c.view(scope, app);
    }
  };
};

c.theme = {
  class: '',
  titleClass: '',
  dashboardButtonClass: '',
  createButtonClass: ''
};

c.view = function (scope, app) {
  var paginationOpts = {
    page: scope.page,
    perPage: scope.perPage,
    total: scope.total,
    onPageChange: scope.onPageChange
  };

  var filterOpts = {
    onApply: scope.applyFilters
  };

  var actions = ['show', 'open'];
  if (!scope.resource.readonly) {
    actions.unshift('edit');
  }

  return m('section.m-admin-list' + c.theme.class, [
    c.views.dashboardButton(scope, app),
    c.views.title(scope, app),
    scope.loading ? m.component(app.components.loadIndicator) : null,

    !scope.resource.readonly ?
      c.views.createButton(scope, app)
    : null,

    m.component(app.components.listFilters, scope.context, filterOpts),
    m.component(app.components.pagination, scope.context, paginationOpts),
    m.component(app.components.list, scope.context, {
      actions: actions
    }),
    m.component(app.components.pagination, scope.context, paginationOpts)
  ]);
};
c.views = {
  dashboardButton: function (scope, app) {
    return m('a.m-admin-button' + c.theme.dashboardButtonClass, {
      href: util.urlFor(scope.context.app.basePath)
    }, 'to Dashboard');
  },
  title: function (scope, app) {
    return m('h2' + c.theme.titleClass, pluralize(scope.resource.name || ''));
  },
  createButton: function (scope, app) {
    return  m('a.m-admin-button' + c.theme.createButtonClass, {
      href: scope.resource.adminUrlFor(null, '/create')
    }, 'Create ' + scope.resource.name);
  }
};
