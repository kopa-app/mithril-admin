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
    opts.foreignKey = opts.foreignKey || 'id';
    opts.name = opts.name || scope.resource.name;
    scope.page = 1;
    scope.perPage = context.app.perPage;
    scope.items = [];
    scope.onPageChange = function (page) {
      scope.page = page;
      scope.loadPage(scope.page);
    };

    scope.loadPage = function (page) {
      var query = {
        page: scope.page,
        perPage: scope.perPage
      };
      query[opts.foreignKey] = context.item[context.fieldName];

      scope.resource.load(null, query)
        .then(function (result) {
          scope.items = result.data;
          scope.total = result.total || -1;
        });
    };

    if (opts.relationType === 'belongsTo') {
      scope.resource.load(context.item[context.fieldName])
        .then(function (result) {
          scope.items = [result];
        });
    } else if (opts.relationType === 'hasMany') {
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

    if (opts.relationType === 'hasMany') {
      return m('section.m-admin-list', [
        m('h2', pluralize(opts.name)),
        m.component(app.components.pagination, context, paginationOpts),
        m.component(context.app.components.list, childContext, childOpts),
        m.component(context.app.components.pagination, childContext, paginationOpts)
      ]);
    } else if (opts.relationType === 'belongsTo') {
      return m('section.m-admin-list', [
        m('h2', opts.name),
        m.component(context.app.components.list, childContext, childOpts)
      ]);
    }
  }
};
