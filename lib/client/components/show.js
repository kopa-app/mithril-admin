'use strict';

var m = require('mithril');
var util = require('../../util');

var c = module.exports = {
  theme: {
    class: '',
    backButtonClass: '',
    listButtonClass: '',
    titleClass: '',
    editButtonClass: ''
  },
  controller: util.noop,
  views: {
    backButton: function (scope, context, opts) {
      return m('a.m-admin-button' + c.theme.backButtonClass, {
        href: 'javascript: history.back();'
      }, 'back');
    },
    listButton: function (scope, context, opts) {
      return m('a.m-admin-button' + c.theme.listButtonClass, {
        href: context.resource.adminUrlFor()
      }, 'to List');
    },
    title: function (scope, context, opts) {
      return m('h2' + c.theme.titleClass, context.resource.name + ' ' + context.resource.id(context.item));
    },
    editButton: function (scope, context, opts) {
      return m('a.m-admin-button' + c.theme.editButtonClass, {
        href: context.resource.adminUrlFor(context.item, '/edit')
      }, 'Edit ' + context.resource.name);
    }
  },
  view: function (scope, context, opts) {
    return m('article.m-admin-show' + c.theme.class, [
      c.views.backButton(scope, context, opts),
      c.views.listButton(scope, context, opts),
      c.views.title(scope, context, opts),
      m.component(context.app.components.fields.resource, context),
      c.views.editButton(scope, context, opts)
    ]);
  }
};
