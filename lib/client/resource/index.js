'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../util');

function queryIsId(query) {
  return (['string', 'number'].indexOf(typeof query) !== -1);
}

module.exports = function (app, options) {
  function factory(name, opts) {
    opts = opts || {};

    var resource = {
      fields: _.merge(_.cloneDeep(factory.defaults.fields), _.cloneDeep(opts.fields || {})),
      listFields: _.uniq(factory.defaults.listFields.concat(opts.listFields || [])),
      sortFields: opts.sortFields || [],
      filterFields: opts.filterFields || [],
      primaryKey: opts.primaryKey || factory.primaryKey,
      inDashboard: typeof opts.inDashboard !== 'undefined' ? opts.inDashboard : true
    };

    resource.name = name;
    resource.collectionName = opts.collectionName || util.collectionName(name);
    resource.propertyName = opts.propertyName || util.propertyName(name);
    resource.urlName = opts.urlName || util.urlName(name);
    resource.fileName = opts.fileName || util.fileName(name);

    // create own methods
    resource.adminUrlFor = _.bind(factory.adminUrlFor, null, resource);
    resource.restUrlFor = _.bind(options.restUrlFor || factory.restUrlFor, null, resource);
    resource.id = _.bind(options.id || factory.id, null, resource);
    resource.load = _.bind(options.load || factory.load, null, resource);
    resource.save = _.bind(options.save || factory.save, null, resource);
    resource.create = _.bind(options.create || factory.create, null, resource);
    resource.remove = _.bind(options.remove || factory.remove, null, resource);
    resource.validate = _.bind(factory.validate, null, resource);
    resource.new = _.bind(factory.new, null, resource);

    app.resources[name] = resource;

    return app;
  }

  factory.defaults = {
    fields: {
      id: {
        component: 'hidden'
      }
    },
    listFields: ['id']
  };

  factory.primaryKey = options.primaryKey || 'id';

  factory.current = function () {
    var urlName = m.route.param('resource');
    var resource = null;

    Object.keys(app.resources).forEach(function (name) {
      if (app.resources[name].urlName === urlName) {
        resource = app.resources[name];
      }
    });

    return resource;
  };

  factory.id = function (resource, item) {
    return item[resource.primaryKey];
  };

  factory.load = function (resource, query, onDone) {
    return app.request({
      method: 'GET',
      url: resource.restUrlFor(queryIsId(query) ? query : null),
      query: !queryIsId(query) ? query : null,
      callback: onDone,
      resourceId: queryIsId(query) ? query : null
    }, {resource: resource});
  };

  factory.save = function (resource, item, onDone) {
    return app.request({
      method: 'PUT',
      url: resource.restUrlFor(resource.id(item)),
      data: item,
      callback: onDone
    }, {resource: resource, item: item});
  };

  factory.create = function (resource, item, onDone) {
    return app.request({
      method: 'POST',
      url: resource.restUrlFor(),
      data: item,
      callback: onDone
    }, {resource: resource, item: item});
  };

  factory.remove = function (resource, item, onDone) {
    return app.request({
      method: 'DELETE',
      url: resource.restUrlFor(resource.id(item)),
      callback: onDone
    }, {resource: resource, item: item});
  };

  factory.adminUrlFor = function (resource, item, suffix) {
    return util.urlFor(app.basePath + '/' + resource.urlName + (item ? '/' + resource.id(item) : '') + (suffix || ''));
  };

  factory.restUrlFor = function (resource, id) {
    return app.restUrl + '/' + (resource.url || resource.urlName) + (id ? '/' + id : '');
  };

  factory.validate = function (resource, item, fieldName) {
    function validateField(fieldName) {
      var field = resource.fields[fieldName];
      var value = item[fieldName];
      if (field.required && util.isEmpty(value)) {
        return (field.label || fieldName) + ' is required';
      } else if (field.validate) {
        return field.validate(value);
      }

      return null;
    }

    function isNotEmpty(error) {
      return error;
    }

    if (fieldName) {
      return [validateField(fieldName)];
    }

    return Object.keys(resource.fields).map(validateField).filter(isNotEmpty);
  };

  factory.defaultData = function (resource) {
    var data = {};

    function setDefault(name) {
      var field = resource.fields[name];

      if (typeof field.default !== 'undefined') {
        if (typeof field.default === 'function') {
          data[name] = field.default();
        } else {
          data[name] = field.default();
        }
      } else {
        data[name] = null;
      }
    }

    Object.keys(resource.fields).forEach(setDefault);
    return data;
  };

  factory.new = function (resource, data) {
    var item = data || {};
    item = _.merge(item, factory.defaultData(resource));

    return item;
  };

  return factory;
};
