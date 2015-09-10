'use strict';

var m = require('mithril');
var resource = require('./resource');
var Routes = require('./routes');
var request = require('superagent');

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

  app.response = function (res, context, done) {
    return {
      headers: res.header || {},
      data: res.body || null,
      text: res.text || null,
      status: res.status || 200,
      total: res.header['x-total-count'] || -1
    };
  };

  app.request = function (opts, context) {
    m.startComputation();

    var deferred = m.deferred();

    var req = request[opts.method.toLowerCase()](opts.url);

    if (opts.query) {
      req.query(opts.query);
    }

    if (opts.headers) {
      req.set(opts.headers);
    }

    if (opts.data) {
      req.send(opts.data);
    }

    req.end(function (err, res) {
      if (err) {
        deferred.reject(err);
        m.endComputation();
        return;
      }

      // attach request to response
      res.request = req;

      // catch return of app.response, as it can be the response, or a promise
      // also catch response in the callback
      var returned = app.response(res, context, function (res) {
        deferred.resolve(res);
        m.endComputation();
      });

      // only resolve if method returned something
      if (returned) {
        deferred.resolve(returned);
        m.endComputation();
      }
    });

    return deferred.promise;
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
