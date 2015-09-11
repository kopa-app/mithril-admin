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
            util.arrReplace(scope.items, result.data || []);
            scope.total = result.total || -1;
            scope.loading = false;
            hasLoaded = true;
          });
      });
    };

    scope.loadSingle = function () {
      scope.resource.load(context.item[context.fieldName])
        .then(function (result) {
          util.arrReplace(scope.items, result.data ? [result.data] : []);
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
        if (context.resource.id(context.item)) {
          scope.loadPage(scope.page);
        } else {
          scope.loading = false;
        }
      }
    };

    scope.onForeignKeyChange = scope.load;

    // unlinking has many relation item
    scope.onUnlink = function (item) {
      item[opts.foreignKey] = null;

      var index = scope.items.indexOf(item);
      if (index !== -1) {
        scope.items.splice(index, 1);
      }

      scope.resource.save(item);
    };

    if (!scope.collapsed) {
      scope.load();
    }

    scope.childContext = _.clone(context);
    scope.childContext.items = scope.items;
    scope.childContext.resource = scope.resource;
    scope.childContext.action = 'list';

    return scope;
  },
  view: function (scope, context, opts) {
    opts = scope.normalizeOpts(opts);

    function unrelateActionView(childScope, context) {
      return m.component(context.app.components.removeButton, context.item, scope.onUnlink, {
        label: 'Unlink'
      });
    }

    var childOpts = {
      actions: ['edit', 'show'],
      label: opts.label
    };

    if (opts.relationType === 'hasMany') {
      childOpts.actions.push(unrelateActionView)
    };

    var paginationOpts = {
      page: scope.page,
      perPage: scope.perPage,
      total: scope.total,
      onPageChange: scope.onPageChange
    };

    var foreignKeyOpts = {
      foreignKey: opts.foreignKey || null,
      onChange: scope.onForeignKeyChange
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

        opts.relationType === 'belongsTo' ?
          m.component(context.app.components.fields.foreignKey, context, foreignKeyOpts) : null,

        m.component(itemsComponent, scope.childContext, childOpts),

        opts.relationType === 'hasMany' ?
          m.component(context.app.components.pagination, scope.childContext, paginationOpts) : null
      ]
    ]);
  }
};
