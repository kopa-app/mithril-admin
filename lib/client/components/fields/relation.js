'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');
var pluralize = require('pluralize');

module.exports = {
  controller: function (context, opts) {
    opts = opts || {};
    var scope = {};

    scope.resource = context.app.resources[opts.resource];
    opts.label = opts.label || scope.resource.name;
    scope.page = 1;
    scope.perPage = context.app.perPage;
    scope.items = [];
    scope.loading = true;
    scope.onPageChange = function (page) {
      scope.page = page;
      scope.loadPage(scope.page);
    };

    opts.collapsible = (typeof opts.collapsible !== 'undefined') ? opts.collapsible : true;
    scope.collapsed = (typeof opts.collapsed !== 'undefined') ? opts.collapsed : true;

    scope.toggle = function (event) {
      event.preventDefault();
      scope.collapsed = !scope.collapsed;
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
          });
      });
    };

    if (opts.relationType === 'belongsTo') {
      opts.foreignKey = opts.foreignKey || 'id';
      var foreignId = context.item[context.fieldName];

      if (foreignId) {
        scope.resource.load(context.item[context.fieldName])
          .then(function (result) {
            scope.items = result.data ? [result.data] : [];
            scope.loading = false;
          });
      } else {
        scope.loading = false;
      }
    } else if (opts.relationType === 'hasMany') {
      opts.foreignKey = opts.foreignKey || context.resource.propertyName + 'Id';
      scope.loadPage(scope.page);
    }

    return scope;
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    var childContext = _.merge(_.clone(context), {
      items: scope.items
    });
    childContext.resource = scope.resource;
    childContext.action = 'list';

    var childOpts = {
      actions: ['show', 'edit', 'remove']
    };

    var paginationOpts = {
      page: scope.page,
      perPage: scope.perPage,
      total: scope.total,
      onPageChange: scope.onPageChange
    };

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

        m.component(context.app.components.list, childContext, childOpts),

        opts.relationType === 'hasMany' ?
          m.component(context.app.components.pagination, childContext, paginationOpts) : null
      ]
    ]);
  }
};
