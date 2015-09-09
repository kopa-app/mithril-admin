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
  return Object.keys(query).map(function (key) {
    return key + '=' + encodeURIComponent(query[key] + '');
  }).join('&');
}

function setFromInput(prop, target, transform) {
  transform = transform || function (value) { return value; };

  return function (event) {
    target[prop] = transform(event.target.value);
  };
}

function removeFalsy(source) {
  var o = {};

  Object.keys(source).forEach(function (key) {
    if (typeof source[key] === 'undefined' || source[key] === null || source[key] === false) {
      return;
    }

    o[key] = source[key];
  })

  return o;
}

function noop () {};

module.exports = {
  collectionName: collectionName,
  urlName: urlName,
  fileName: fileName,
  propertyName: propertyName,
  urlFor: urlFor,
  toQueryString: toQueryString,
  setFromInput: setFromInput,
  removeFalsy: removeFalsy,
  noop: noop
};
