'use strict';

var m = require('mithril');
var util = require('../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context) {
    return m('article.m-admin-show', [
      m('a.m-admin-button', {
        href: 'javascript: history.back();'
      }, 'back'),

      m('a.m-admin-button', {
        href: context.resource.adminUrlFor()
      }, 'to List'),

      m('h2', context.resource.name + ' ' + context.resource.id(context.item)),

      m.component(context.app.components.fields.resource, context),

      m('a.m-admin-button', {
        href: context.resource.adminUrlFor(context.item, '/edit')
      }, 'Edit ' + context.resource.name)
    ]);
  }
};
