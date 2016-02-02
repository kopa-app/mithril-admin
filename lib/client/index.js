'use strict';

var m = require('mithril');
var resource = require('./resource');
var Routes = require('./routes');
var request = require('superagent');
var util = require('../util');
var isArray = require('is-array');

var g = global || window;

if (!g.setImmediate) {
  g.setImmediate = function (cb) {
    setTimeout(cb, 1);
  };
}

function factory(name, data) {
  return data || {};
}

module.exports = function (options) {
  options = options || {};

  var app = {};
  app.basePath = options.basePath || '';
  app.restUrl = typeof options.restUrl !== 'undefined' && options.restUrl !== null ? options.restUrl : '/';
  app.perPage = options.perPage || 10;
  app.snakeCase = options.snakeCase || false;
  app.resources = {};
  app.resource = resource(app, options);
  app.factory = options.factory || factory;
  app.components = {
    loadIndicator: require('./components/load_indicator'),
    list: require('./components/list'),
    listItem: require('./components/list_item'),
    pagination: require('./components/pagination'),
    show: require('./components/show'),
    edit: require('./components/edit'),
    removeButton: require('./components/remove_button'),
    pages: {
      dashboard: require('./components/pages/dashboard'),
      create: require('./components/pages/create'),
      edit: require('./components/pages/edit'),
      list: require('./components/pages/list'),
      show: require('./components/pages/show')
    },
    fields: {
      label: require('./components/fields/label'),
      group: require('./components/fields/group'),
      hidden: require('./components/fields/hidden'),
      relation: require('./components/fields/relation'),
      text: require('./components/fields/text'),
      password: require('./components/fields/password'),
      textarea: require('./components/fields/textarea'),
      json: require('./components/fields/json'),
      datetime: require('./components/fields/datetime'),
      date: require('./components/fields/date'),
      email: require('./components/fields/email'),
      number: require('./components/fields/number'),
      image: require('./components/fields/image'),
      checkbox: require('./components/fields/checkbox'),
      select: require('./components/fields/select'),
      tags: require('./components/fields/tags'),
      resource: require('./components/fields/resource'),
      resourceList: require('./components/fields/resource_list'),
      foreignKey: require('./components/fields/foreign_key')
    }
  };

  app.response = function (res, context, done) {
    var response = {
      headers: res.header || {},
      data: app.parseResponseData(res.body || null, context),
      text: res.text || null,
      status: res.status || 200,
      total: res.header['x-total-count'] || -1
    };

    return response;
  };

  app.parseResponseData = function (data, context) {
    if (context.resource && data) {
      if (isArray(data)) {
        data = data.map(function (item) {
          return app.factory(context.resource.name, item);
        });
      } else {
        data = app.factory(context.resource.name, data);
      }
    }

    return data;
  };

  app.request = function (opts, context) {
    opts.callback = opts.callback || util.noop;
    m.startComputation();

    var methodMap = {
      'GET': request.get,
      'POST': request.post,
      'PUT': request.put,
      'PATCH': request.patch,
      'DELETE': request.del
    };

    var deferred = m.deferred();
    var method = methodMap[opts.method.toUpperCase()];

    if (!method) {
      throw new Error('Request method "' + opts.method + '" is not supported.');
    }

    var req = method(opts.url);

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
        opts.callback(err);
        m.endComputation();
        return;
      }

      // attach request to response
      res.request = req;

      // catch return of app.response, as it can be the response, or a promise
      // also catch response in the callback
      var returned = app.response(res, context, function (res) {
        deferred.resolve(res);
        opts.callback(null, res);
        m.endComputation();
      });

      // only resolve if method returned something
      if (returned) {
        deferred.resolve(returned);
        opts.callback(null, returned);
        m.endComputation();
      }
    });

    return deferred.promise;
  };

  app.mount = function (container) {
    // mount the app to the DOM
    m.route.mode = 'hash';
    m.route(container, app.basePath, app.routes());
  };

  app.routes = function () {
    return Routes(app);
  };

  app.use = function (plugin) {
    plugin(app);
    return app;
  };

  return app;
};
