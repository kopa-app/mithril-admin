'use strict';

var m = require('mithril');

var c = module.exports = function (app) {
  return {
    controller: function () {
      var scope = {};
      scope.resource = app.resource.current();
      scope.item = scope.resource.new();

      scope.context = {
        resource: scope.resource,
        item: scope.item,
        app: app,
        action: 'create'
      };

      return scope;
    },
    view: function (scope) {
      return c.view(scope, app);
    }
  }
};

c.theme = {

};
c.view = function (scope, app) {
  return m.component(app.components.edit, scope.context);
};
c.views = {

};
