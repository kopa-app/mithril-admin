'use strict';

var m = require('mithril');
var util = require('../../../util');
var pluralize = require('pluralize');

module.exports = function (app) {
  return {
    controller: util.noop,
    view: function (scope) {
      function resourceView(name) {
        var resource = app.resources[name];

        return m('li', m('a', {
          href: resource.adminUrlFor()
        }, pluralize(resource.name)));
      }

      return m('section.m-admin-dashboard', [
        m('h2', 'Dashboard'),
        m('nav.m-admin-resources', m('ul', Object.keys(app.resources).map(resourceView)))
      ]);
    }
  };
};
