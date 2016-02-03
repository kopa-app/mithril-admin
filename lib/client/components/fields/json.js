'use strict';

var m = require('mithril');
var util = require('../../../util');

var c = module.exports = {
  theme: {
    inputClass: '',
    valueClass: ''
  },
  controller: function (context, opts) {
    var scope = {};

    scope.setValue = function (value) {
      context.item[context.fieldName] = JSON.parse(value);
    };

    return scope;
  },
  views: {
    input: function (scope, context, opts) {
      return m('textarea[name="' + context.fieldName + '"].m-admin-field-input' + c.theme.inputClass, util.removeFalsy({
        value: JSON.stringify(context.item[context.fieldName]),
        required: context.action !== 'filter' && opts.required,
        readonly: context.action !== 'filter' && opts.readonly,
        oninput: m.withAttr('value', scope.setValue)
      }));
    },
    value: function (scope, context, opts) {
      return m('pre.m-admin-field-value' + c.theme.valueClass, JSON.stringify(context.item[context.fieldName]));
    }
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    return util.canEditField(context, opts) ?
      c.views.input(scope, context, opts)
    : c.views.value(scope, context, opts);
  }
};
