'use strict';

var m = require('mithril');
var util = require('../../../util');
var without = require('lodash/array/without');
var contains = require('lodash/collection/contains');

var component = module.exports = {
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
  view: function (scope, context, opts) {
    opts = opts || {};

    function itemView(value) {
      return component.views.item(value, scope, context, opts);
    }

    return m('.m-admin-field-tags', [
        util.canEditField(context, opts) ?
        m('input[name="' + context.fieldName + '"]', util.removeFalsy({
          type: 'text',
          value: scope.newValue,
          oninput: m.withAttr('value', scope.setNewValue),
          onkeyup: scope.onKeyUp
        }))
      : null,
      m('span.m-admin-field-value', context.item[context.fieldName].map(itemView))
    ]);
  },
  views: {
    item: function (value, scope, context, opts) {
      var options = scope.getOptions();

      return m('span.m-admin-field-tags-item', [
        options[value] || value,
        util.canEditField(context, opts) ?
          component.views.remove(value, scope, context, opts)
        : null
      ]);
    },
    remove: function (value, scope, context, opts) {
      return m('button.m-admin-field-tags-item-remove', {
        onclick: scope.remove(value)
      }, 'x');
    }
  }
};
