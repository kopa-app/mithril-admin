'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../util');

module.exports = function (app) {
  var res = function (name, options) {
    var r = {
      fields: _.merge(_.cloneDeep(options.fields || {}), res.defaults.fields),
      listFields: _.uniq(res.defaults.listFields.concat(options.listFields || [])),
      serialize: options.serialize || null,
      deserialize: options.deserialize || null
    };

    r.name = name;
    r.collectionName = options.collectionName || util.collectionName(name);
    r.propertyName = options.propertyName || util.propertyName(name);
    r.urlName = options.urlName || util.urlName(name);
    r.fileName = options.fileName || util.fileName(name);

    r.primaryField = function () {
      var pfield = 'id';

      Object.keys(r.fields).forEach(function (field) {
        if (r.fields[field].primary) {
          pfield = field;
        }
      });

      return pfield;
    };

    r.urlFor = function (item, suffix) {
      return util.urlFor(app.basePath + '/' + r.urlName + (item ? '/' + item[r.primaryField()] : '') + (suffix || ''))
    };

    r.load = function (id, query) {
      return m.request({
        method: 'GET',
        url: app.restUrl + '/' + (r.url || r.urlName) + (id ? '/' + id : '') + (query ? '?' + util.toQueryString(query) : ''),
        deserialize: r.deserialize || res.deserialize
      });
    };

    r.save = function (item) {
      return m.request({
        method: 'PUT',
        url: app.restUrl + '/' + (r.url || r.urlName) + '/' + item[r.primaryField()],
        data: item,
        serialize: r.serialize || res.serialize
      });
    };

    r.create = function (item) {
      return m.request({
        method: 'POST',
        url: app.restUrl + '/' + (r.url || r.urlName) + '/' + item[r.primaryField()],
        data: item,
        serialize: r.serialize || res.serialize,
        deserialize: r.deserialize || res.deserialize
      });
    };

    r.remove = function (item) {
      return m.request({
        method: 'DELETE',
        url: app.restUrl + '/' + (r.url || r.urlName) + '/' + item[r.primaryField()],
        serialize: r.serialize || res.serialize,
        deserialize: r.deserialize || res.deserialize
      });
    };

    app.resources[name] = r;

    return app;
  };

  res.defaults = {
    fields: {
      id: {
        type: 'id',
        readonly: true,
        primary: true
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

  return res;
};
