'use strict';

var m = require('mithril');
var util = require('../../../util');
var without = require('lodash/array/without');
var contains = require('lodash/collection/contains');

var c = module.exports = {
  theme: {
    class: '',
    inputClass: '',
    valueClass: '',
    itemClass: '',
    removeButtonClass: ''
  },
  controller: function (context, opts) {
    var scope = {};

    scope.newValue = '';

    scope.add = function () {
      var value = scope.newValue.trim();

      if (!contains(context.item[context.fieldName], value)) {
        context.item[context.fieldName].push(value);
      }

      scope.newValue = '';
    };

    scope.setNewValue = function (value) {
      scope.newValue = value;
    };

    scope.onKeyUp = function (event) {
      event.preventDefault();

      if (event.keyCode === 13) {
        scope.add();
      }
    };

    scope.remove = function (value) {
      return function (event) {
        event.preventDefault();

        context.item[context.fieldName] = without(context.item[context.fieldName], value);
      };
    };

    scope.getOptions = function () {
      if (opts.options) {
        if (typeof opts.options === 'function') {
          return opts.options();
        }
        return opts.options;
      }

      return {};
    };

    return scope;
  },
  views: {
    input: function (scope, context, opts) {
      return m('input[name="' + context.fieldName + '"]' + c.theme.inputClass, util.removeFalsy({
        type: 'text',
        value: scope.newValue,
        oninput: m.withAttr('value', scope.setNewValue),
        onkeyup: scope.onKeyUp
      }));
    },
    value: function (scope, context, opts) {
      function itemView(value) {
        return c.views.item(scope, context, opts, value);
      }

      return m('span.m-admin-field-value' + c.theme.valueClass, context.item[context.fieldName].map(itemView));
    },
    item: function (scope, context, opts, value) {
      var options = scope.getOptions();

      return m('span.m-admin-field-tags-item' + c.theme.itemClass, [
        options[value] || value,
        util.canEditField(context, opts) ?
          c.views.remove(value, scope, context, opts)
        : null
      ]);
    },
    remove: function (value, scope, context, opts) {
      return m('button.m-admin-field-tags-item-remove' + c.theme.removeButtonClass, {
        onclick: scope.remove(value)
      }, 'x');
    }
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    return m('.m-admin-field-tags' + c.theme.class, [
        util.canEditField(context, opts) ?
        c.views.input(scope, context, opts)
      : null,
      c.views.value(scope, context, opts)
    ]);
  }
};
