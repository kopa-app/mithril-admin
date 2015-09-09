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

    scope.items = [];

    if (opts.relationType === 'belongsTo') {
      scope.resource.load(context.item[context.fieldName])
        .then(function (result) {
          scope.items = [result];
        });
    } else if (opts.relationType === 'hasMany') {
      var query = {};
      query[opts.foreignKey] = context.item[context.fieldName];

      scope.resource.load(null, query)
        .then(function (result) {
          scope.items = result;
        });
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

    if (opts.relationType === 'hasMany') {
      return m('section.m-admin-list', [
        m('h2', pluralize(opts.name)),
        m.component(context.app.components.list, childContext, childOpts)
      ]);
    } else if (opts.relationType === 'belongsTo') {
      return m('section.m-admin-list', [
        m('h2', opts.name),
        m.component(context.app.components.list, childContext, childOpts)
      ]);
    }
  }
};
