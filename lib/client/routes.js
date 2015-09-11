'use strict';

module.exports = function (app) {
  var r = {};

  var dashboard = app.components.pages.dashboard(app);

  var routes = {
    '': dashboard,
    '/': dashboard,
    '/:resource': app.components.pages.list(app),
    '/:resource/create': app.components.pages.create(app),
    '/:resource/:id': app.components.pages.show(app),
    '/:resource/:id/edit': app.components.pages.edit(app)
  };

  function makeRoute(path) {
    r[app.basePath + path] = routes[path];
  }

  Object.keys(routes).forEach(makeRoute);

  return r;
};
