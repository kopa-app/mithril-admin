'use strict';

var m = require('mithril');
var util = require('../../../util');
var pluralize = require('pluralize');

var c = module.exports = function (app) {
  return {
    controller: util.noop,
    view: function (scope) {
      return c.view(scope, app);
    }
  };
};

c.theme = {
  class: '',
  titleClass: '',
  navClass: '',
  navListClass: '',
  navItemClass: '',
  navItemLinkClass: ''
};
c.view = function (scope, app) {
  return m('section.m-admin-dashboard' + c.theme.class, [
    c.views.title(scope, app),
    c.views.nav(scope, app)
  ]);
};
c.views = {
  title: function (scope, app) {
    return m('h2' + c.theme.titleClass, 'Dashboard');
  },
  nav: function (scope, app) {
    function resourceView(name) {
      var resource = app.resources[name];

      return m('li' + c.theme.navItemClass, m('a' + c.theme.navItemLinkClass, {
        href: resource.adminUrlFor()
      }, pluralize(resource.name)));
    }

    function resourceFilter(name) {
      return app.resources[name].inDashboard;
    }

    return m('nav.m-admin-resources' + c.theme.navClass,
      m('ul' + c.theme.navListClass,
        Object.keys(app.resources)
          .filter(resourceFilter)
          .map(resourceView)
      ));
  }
}
