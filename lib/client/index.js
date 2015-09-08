'use strict';

var m = require('mithril');
var resource = require('./resource');
var Routes = require('./routes');

module.exports = function (options) {
  options = options || {};

  var app = {};

  app.basePath = options.basePath || '';
  app.restUrl = options.restUrl || '/';
  app.resources = {};
  app.resource = resource(app);
  app.components = {
    list: require('./components/list'),
    listItem: require('./components/list_item'),
    show: require('./components/show'),
    edit: require('./components/edit'),
    editForm: require('./components/edit_form')
  };

  app.mount = function (container) {
    var routes = Routes(app);

    // mount the app to the DOM
    m.route(container, app.basePath, routes);
  };

  return app;
};
