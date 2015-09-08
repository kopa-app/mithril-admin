'use strict';

var m = require('mithril');

module.exports = function (app) {
  return {
    controller: function () {
      var resource = app.resource.current();
      var scope = {};

      scope.item = null;

      resource.load(m.route.param('id'))
        .then(function (result) {
          scope.item = result;
        });

      return scope;
    },
    view: function (scope) {
      var resource = app.resource.current();

      return m.component(app.components.show, app, scope.item, {
        url: resource.urlFor(scope.item)
      });
    }
  }
};
