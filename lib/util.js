'use strict';

var m = require('mithril');
var pluralize = require('pluralize');
var dashify = require('dashify');

function dasherize() {
  return dashify.apply(null, arguments).replace(/^-/, '');
}

function lcfirst(str) {
  return str.charAt(0).toLowerCase() + str.substr(1);
}

function collectionName(modelName) {
  return pluralize(lcfirst(modelName));
}

function propertyName(modelName) {
  return lcfirst(modelName);
}

function urlName(modelName) {
  return dasherize(pluralize(modelName));
}

function fileName(modelName) {
  return dasherize(modelName).replace(/-/g, '_');
}

function urlFor(path) {
  if (m.route.mode === 'hash') {
    return '#' + path;
  } else if (m.route.mode === 'pathname') {
    return path;
  } else if (m.route.mode === 'search') {
    return '?/' + path;
  }
}

function toQueryString(query) {
  var s = [];

  Object.keys(query).forEach(function (key) {
    s.push(key + '=' + encodeURIComponent(query[key] + ''));
  });

  return s.join('&');
}

function noop () {};

module.exports = {
  collectionName: collectionName,
  urlName: urlName,
  fileName: fileName,
  propertyName: propertyName,
  urlFor: urlFor,
  toQueryString: toQueryString,
  noop: noop
};
