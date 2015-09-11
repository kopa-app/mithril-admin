'use strict';

var m = require('mithril');

module.exports = function (app) {
  return {
    controller: function () {
      var scope = {};
      scope.resource = app.resource.current();
      scope.item = scope.resource.new();

      return scope;
    },
    view: function (scope) {
      var context = {
        resource: scope.resource,
        item: scope.item,
        app: app,
        action: 'create'
      };

      return m.component(app.components.edit, context);
    }
  }
};