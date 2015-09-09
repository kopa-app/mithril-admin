'use strict';

var m = require('mithril');
var resource = require('./resource');
var Routes = require('./routes');

if (!window.setImmediate) {
  window.setImmediate = function (cb) {
    setTimeout(cb, 1);
  };
}

module.exports = function (options) {
  options = options || {};

  var app = {};

  app.basePath = options.basePath || '';
  app.restUrl = options.restUrl || '/';
  app.perPage = options.perPage || 10;
  app.resources = {};
  app.resource = resource(app, options);
  app.components = {
    dashboard: require('./components/dashboard'),
    loadIndicator: require('./components/load_indicator'),
    list: require('./components/list'),
    listItem: require('./components/list_item'),
    pagination: require('./components/pagination'),
    show: require('./components/show'),
    edit: require('./components/edit'),
    editForm: require('./components/edit_form'),
    fields: {
      label: require('./components/fields/label'),
      group: require('./components/fields/group'),
      hidden: require('./components/fields/hidden'),
      relation: require('./components/fields/relation'),
      text: require('./components/fields/text'),
      textarea: require('./components/fields/textarea'),
      email: require('./components/fields/email'),
      number: require('./components/fields/number'),
      image: require('./components/fields/image'),
      checkbox: require('./components/fields/checkbox')
    }
  };

  app.mount = function (container) {
    var routes = Routes(app);

    // mount the app to the DOM
    m.route(container, app.basePath, routes);
  };

  app.routes = function () {
    return Routes(app);
  };

  return app;
};
