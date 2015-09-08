'use strict';

var m = require('mithril');
var util = require('../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, app, item, opts) {
    var resource = app.resource.current();

    return m('article.m-admin-show', [
      m('a', {
        href: resource.urlFor(item)
      }, 'back'),
      m('h2', resource.name + ' ' + item[resource.primaryField()]),

      m.component(app.components.editForm, app, item),
      m('button', {
        onclick: resource.save.bind(null, item)
      }, 'Save'),
      m('a', {
        href: resource.urlFor(item)
      }, 'Cancel')
    ]);
  }
};
