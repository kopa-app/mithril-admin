'use strict';

var m = require('mithril');

module.exports = function (app) {
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
            scope.loading = false;
          });
      });

      return scope;
    },
    view: function (scope) {
      var context = {
        resource: scope.resource,
        item: scope.item,
        app: app,
        action: 'show'
      };

      return scope.loading ?
        m.component(app.components.loadIndicator)
      : m.component(app.components.show, context);
    }
  }
};
