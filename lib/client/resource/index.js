'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../util');

module.exports = function (app, options) {
  var res = function (name, options) {
    var r = {
      fields: _.merge(_.cloneDeep(res.defaults.fields), _.cloneDeep(options.fields || {})),
      listFields: _.uniq(res.defaults.listFields.concat(options.listFields || [])),
      serialize: options.serialize || null,
      deserialize: options.deserialize || null,
      primaryKey: options.primaryKey || res.primaryKey,
      transformQuery: options.transformQuery || res.transformQuery
    };

    r.name = name;
    r.collectionName = options.collectionName || util.collectionName(name);
    r.propertyName = options.propertyName || util.propertyName(name);
    r.urlName = options.urlName || util.urlName(name);
    r.fileName = options.fileName || util.fileName(name);

    r.id = options.id || res.id(r);
    r.adminUrlFor = options.adminUrlFor || res.adminUrlFor(r);
    r.restUrlFor = options.restUrlFor || res.restUrlFor(r);
    r.load = options.load || res.load(r);
    r.save = options.save || res.save(r);
    r.create = options.create || res.create(r);
    r.remove = options.remove || res.remove(r);

    r.validate = function (item, fieldName) {
      function validateField(fieldName) {
        var field = r.fields[fieldName];
        var value = item[fieldName];
        if (field.required && typeof value === 'undefined' || value === null || value === '') {
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

      return Object.keys(r.fields).map(validateField).filter(isNotEmpty);
    };

    app.resources[name] = r;

    return app;
  };

  res.defaults = {
    fields: {
      id: {
        component: 'hidden'
      }
    },
    listFields: ['id']
  };

  res.list = require('./list')(app);
  res.show = require('./show')(app);
  res.edit = require('./edit')(app);
  res.create = require('./create')(app);
  res.remove = require('./remove')(app);
  res.deserialize = null;
  res.serialize = null;
  res.primaryKey = options.primaryKey || 'id';
  res.transformQuery = options.transformQuery || util.passThru;

  res.current = function () {
    var urlName = m.route.param('resource');
    var resource = null;

    Object.keys(app.resources).forEach(function (name) {
      if (app.resources[name].urlName === urlName) {
        resource = app.resources[name];
      }
    });

    return resource;
  };

  res.id = options.id || function (r) {
    return function (item) {
      return item[r.primaryKey];
    };
  };

  res.load = options.load || function (r) {
    return function (id, query) {
      return m.request({
        method: 'GET',
        url: r.restUrlFor(id, r.transformQuery(query)),
        deserialize: r.deserialize || res.deserialize,
        extract: function (xhr, xhrOptions) {
          if (!id) {
            return JSON.stringify({
              total: xhr.getResponseHeader("x-total-count"),
              data: JSON.parse(xhr.responseText || '')
            });
          }

          return xhr.responseText;
        }
      });
    };
  };

  res.save = options.save || function (r) {
    return function (item) {
      return m.request({
        method: 'PUT',
        url: r.restUrlFor(r.id(item)),
        data: item,
        serialize: r.serialize || res.serialize
      });
    };
  };

  res.create = options.create || function (r) {
    return function (item) {
      return m.request({
        method: 'POST',
        url: app.restUrl + '/' + (r.url || r.urlName) + '/' + r.id(item),
        data: item,
        serialize: r.serialize || res.serialize,
        deserialize: r.deserialize || res.deserialize
      });
    };
  };

  res.remove = options.remove || function (r) {
    return function (item) {
      return m.request({
        method: 'DELETE',
        url: app.restUrl + '/' + (r.url || r.urlName) + '/' + r.id(item),
        serialize: r.serialize || res.serialize,
        deserialize: r.deserialize || res.deserialize
      });
    };
  };

  res.adminUrlFor = options.urlFor || function (r) {
    return function (item, suffix) {
      return util.urlFor(app.basePath + '/' + r.urlName + (item ? '/' + r.id(item) : '') + (suffix || ''))
    };
  };

  res.restUrlFor = options.restUrlFor || function (r) {
    return function (id, query) {
      return app.restUrl + '/' + (r.url || r.urlName) + (id ? '/' + id : '') + (query ? '?' + util.toQueryString(query) : '');
    };
  };

  return res;
};
