'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    function itemView(item) {
      var childContext = _.clone(context);
      childContext.item = item;

      return m.component(context.app.components.listItem, childContext, opts);
    }

    function fieldView(field) {
      return m('th', field);
    };

    return m('table', [
      m('thead', context.resource.listFields.concat('Actions').map(fieldView)),
      m('tbody', context.items.map(itemView))
    ]);
  }
};
