'use strict';

var m = require('mithril');
var util = require('../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, app, item, opts) {
    var resource = app.resource.current();

    return m('article.m-admin-show', [
      m('a', {
        href: resource.urlFor()
      }, 'back'),
      m('h2', resource.name + ' ' + item[resource.primaryField()]),

      m('pre', m('code', JSON.stringify(item, null, 2))),
      m('a', {
        href: resource.urlFor(item, '/edit')
      }, 'Edit ' + resource.name)
    ]);
  }
};
