'use strict';

var m = require('mithril');

var c = module.exports = function (app) {
  return {
    controller: function () {
      var scope = {};
      scope.resource = app.resource.current();
      scope.item = null;
      scope.loading = true;

      setImmediate(function () {
        scope.resource.load(m.route.param('id'))
          .then(function (res) {
            scope.item = res.data;
            scope.context.item = scope.item;
            scope.loading = false;
          });
      });

      scope.context = {
        resource: scope.resource,
        item: scope.item,
        app: app,
        action: 'edit'
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
  return scope.loading ?
    m.component(app.components.loadIndicator)
  : m.component(app.components.edit, scope.context);
};
c.views = {

};
