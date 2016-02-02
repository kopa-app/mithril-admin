'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../util');
var pluralize = require('pluralize');

var c = module.exports = {
  theme: {
    class: '',
    headerClass: '',
    headerFieldClass: '',
    itemsClass: '',
    noItemsClass: ''
  },
  controller: util.noop,
  views: {
    header: function (scope, context, opts) {
      function fieldView(field) {
        return m('th.m-admin-list-header-field' + c.theme.headerFieldClass, field);
      };

      return m('thead.m-admin-list-header' + c.theme.headerClass, context.resource.listFields.concat('Actions').map(fieldView));
    },
    items: function (scope, context, opts) {
      function itemView(item) {
        var childContext = _.clone(context);
        childContext.item = item;

        return m.component(context.app.components.listItem, childContext, opts);
      }

      return m('tbody.m-admin-list-items' + c.theme.itemsClass, context.items.map(itemView));
    },
    noItems: function (scope, context, opts) {
      return m('p' + c.theme.noItemsClass, 'No ' + (opts.label || pluralize(context.resource.name)) + ' yet.');
    }
  },
  view: function (scope, context, opts) {
    return context.items.length ?
      m('table.m-admin-list' + c.theme.class, [
        c.views.header(scope, context, opts),
        c.views.items(scope, context, opts)
      ])
    : c.views.noItems(scope, context, opts);
  }
};
