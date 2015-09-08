'use strict';

var m = require('mithril');
var util = require('../../util');
var pluralize = require('pluralize');

module.exports = {
  controller: util.noop,
  view: function (scope, app, items) {
    var resource = app.resource.current();

    function itemView(item) {
      return m.component(app.components.listItem, app, item, {
        url: resource.urlFor(item)
      });
    }

    function fieldView(field) {
      return m('th', field);
    };

    return m('section.m-admin-list', [
      m('h2', pluralize(resource.name || '')),
      m('table', [
        m('thead', resource.listFields.map(fieldView)),
        m('tbody', items.map(itemView))
      ])
    ]);
  }
};
