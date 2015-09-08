'use strict';

var m = require('mithril');
var util = require('../../util');

module.exports = function (app) {
  return {
    controller: function () {
      var resource = app.resource.current();
      var scope = {};

      scope.items = [];

      resource.load()
        .then(function (result) {
          scope.items = result;
        });

      return scope;
    },
    view: function (scope) {
      return m.component(app.components.list, app, scope.items);
    }
  };
};
