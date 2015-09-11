'use strict';

var m = require('mithril');
var util = require('../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context) {
    var id = context.resource.id(context.item);

    return m('article.m-admin-edit', [
      m('a.m-admin-button', {
        href: 'javascript: history.back();'
      }, 'back'),

      m('a.m-admin-button', {
        href: util.urlFor(context.resource.adminUrlFor())
      }, 'to List'),

      m('h2', id ? context.resource.name + ' ' + id : 'New ' + context.resource.name),
      m.component(context.app.components.fields.resource, context)
    ]);
  }
};
