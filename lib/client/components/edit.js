'use strict';

var m = require('mithril');
var util = require('../../util');

var c = module.exports = {
  theme: {
    class: '',
    backButtonClass: '',
    listButtonClass: '',
    titleClass: ''
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
        href: util.urlFor(context.resource.adminUrlFor())
      }, 'to List');
    },
    title: function (scope, context, opts) {
      var id = context.resource.id(context.item);
      return m('h2' + c.theme.titleClass, id ? context.resource.name + ' ' + id : 'New ' + context.resource.name);
    }
  },
  view: function (scope, context, opts) {
    return m('article.m-admin-edit' + c.theme.class, [
      c.views.backButton(scope, context, opts),
      c.views.listButton(scope, context, opts),
      c.views.title(scope, context, opts),
      m.component(context.app.components.fields.resource, context)
    ]);
  }
};
