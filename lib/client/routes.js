'use strict';

module.exports = function (app) {
  var r = {};

  var dashboard = require('./dashboard')(app);

  var routes = {
    '': dashboard,
    '/': dashboard,
    '/:resource': app.resource.list,
    '/:resource/:id': app.resource.show,
    '/:resource/:id/edit': app.resource.edit,
    '/:resource/:id/create': app.resource.create,
    '/:resource/:id/remove': app.resource.remove
  };

  function makeRoute(path) {
    r[app.basePath + path] = routes[path];
  }

  Object.keys(routes).forEach(makeRoute);

  return r;
};
