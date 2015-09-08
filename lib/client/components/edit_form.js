'use strict';

var m = require('mithril');

module.exports = {
  controller: function (app, item) {
    var scope = {};

    scope.submit = function (event) {

    };

    return scope;
  },
  view: function (scope, app, item) {
    return m('form.m-admin-form', {
      onsubmit: scope.submit
    }, [

    ]);
  }
};
