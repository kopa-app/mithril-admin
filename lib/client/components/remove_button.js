'use strict';

var m = require('mithril');
var util = require('../../util');

var c = module.exports = {
  theme: {
    class: ''
  },
  controller: function (item, onRemove, opts) {
    opts = opts || {};
    var scope = {};

    scope.armed = 0;
    var timeout;

    scope.click = function (item) {
      return function (event) {
        event.preventDefault();

        if (scope.armed) {
          if (timeout) {
            clearTimeout(timeout);
          }

          onRemove(item);
          scope.unarm();
        } else {
          scope.arm();
        }
      };
    };

    scope.arm = function () {
      scope.armed = 1;
      setTimeout(scope.engage, 500);
    };

    scope.engage = function () {
      scope.armed = 2;
      timeout = setTimeout(scope.unarm, 2000);
    };

    scope.unarm = function () {
      scope.armed = 0;
      m.redraw();
    };

    return scope;
  },
  view: function (scope, item, onRemove, opts) {
    opts = opts || {};

    return m('button.m-admin-button.m-admin-remove-button' + c.theme.class, {
      className: scope.armed ? 'armed' : '',
      onclick: scope.click(item)
    }, scope.armed ? opts.armedLabel || 'Sure?' : opts.label || 'Remove');
  }
};
