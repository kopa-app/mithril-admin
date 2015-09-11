'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');
var pluralize = require('pluralize');

module.exports = {
  controller: function (context, opts) {
    var scope = {};
    scope.resource = context.app.resources[opts.resource];

    scope.normalizeOpts = function(opts) {
      opts = opts || {};
      opts.collapsible = (typeof opts.collapsible !== 'undefined') ? opts.collapsible : true;
      opts.label = opts.label || scope.resource.name;
      opts.itemsComponent = opts.itemsComponent || context.app.components.list;

      if (opts.relationType === 'belongsTo') {
        opts.foreignKey = opts.foreignKey || 'id';
      } else if (opts.relationType === 'hasMany') {
        opts.foreignKey = opts.foreignKey || context.resource.propertyName + 'Id';
      }

      return opts;
    };

    opts = scope.normalizeOpts(opts);
    scope.collapsed = (typeof opts.collapsed !== 'undefined') ? opts.collapsed : true;
    scope.resource = context.app.resources[opts.resource];
    scope.page = 1;
    scope.perPage = context.app.perPage;
    scope.total = -1;
    scope.items = [];
    var hasLoaded = false;

    scope.onPageChange = function (page) {
      scope.page = page;
      scope.loadPage(scope.page);
    };

    scope.toggle = function (event) {
      event.preventDefault();
      scope.collapsed = !scope.collapsed;

      if (!scope.collapsed && !hasLoaded) {
        scope.load();
      }
    };

    scope.loadPage = function (page) {
      scope.loading = true;
      var query = {
        page: scope.page,
        perPage: scope.perPage
      };
      query[opts.foreignKey] = context.resource.id(context.item);

      setImmediate(function () {
        scope.resource.load(query)
          .then(function (result) {
            scope.items = result.data || [];
            scope.total = result.total || -1;
            scope.loading = false;
            hasLoaded = true;
          });
      });
    };

    scope.loadSingle = function () {
      scope.resource.load(context.item[context.fieldName])
        .then(function (result) {
          scope.items = result.data ? [result.data] : [];
          scope.loading = false;
          hasLoaded = true;
        });
    };

    scope.load = function () {
      scope.loading = true;

      if (opts.relationType === 'belongsTo') {
        var foreignId = context.item[context.fieldName];

        if (foreignId) {
          scope.loadSingle();
        } else {
          scope.loading = false;
        }
      } else if (opts.relationType === 'hasMany') {
        scope.loadPage(scope.page);
      }
    };

    if (!scope.collapsed) {
      scope.load();
    }

    return scope;
  },
  view: function (scope, context, opts) {
    opts = scope.normalizeOpts(opts);

    var childContext = _.clone(context);
    childContext.items = scope.items;
    childContext.resource = scope.resource;
    childContext.action = 'list';

    var childOpts = {
      actions: ['edit', 'show'], // TODO add unrelate action here
      label: opts.label
    };

    var paginationOpts = {
      page: scope.page,
      perPage: scope.perPage,
      total: scope.total,
      onPageChange: scope.onPageChange
    };

    var itemsComponent = opts.itemsComponent;

    if (typeof itemsComponent === 'string') {
      itemsComponent = context.app.components.fields[itemsComponent];
    }

    return m('section.m-admin-list', [
      m('h2', [
        opts.collapsible ?
          m('button.m-admin-button.m-admin-group-toggle', {
            onclick: scope.toggle
          }, scope.collapsed ? '+' : '-')
        : null,
        opts.relationType === 'hasMany' ? pluralize(opts.label) : opts.label
      ]),
      scope.loading ? m.component(context.app.components.loadIndicator) : null,

      opts.collapsible && scope.collapsed ? null : [
        opts.relationType === 'hasMany' ?
          m.component(context.app.components.pagination, context, paginationOpts) : null,

        m.component(itemsComponent, childContext, childOpts),

        opts.relationType === 'hasMany' ?
          m.component(context.app.components.pagination, childContext, paginationOpts) : null
      ]
    ]);
  }
};
