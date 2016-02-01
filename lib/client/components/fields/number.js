'use strict';

var m = require('mithril');
var util = require('../../../util');

var c = module.exports = {
  theme: {
    inputClass: '',
    valueClass: ''
  },
  controller: util.noop,
  views: {
    input: function (scope, context, opts) {
      return m('input[name="' + context.fieldName + '"]' + c.theme.inputClass, util.removeFalsy({
        type: 'number',
        min: (typeof opts.min !== 'undefined') ? opts.min : null,
        max: (typeof opts.max !== 'undefined') ? opts.max : null,
        step: opts.step || null,
        value: parseFloat(context.item[context.fieldName]),
        required: opts.required,
        readonly: opts.readonly,
        oninput: util.setFromInput(context.fieldName, context.item)
      }));
    },
    value: function (scope, context, opts) {
      return m('span.m-admin-field-value' + c.theme.valueClass, parseFloat(context.item[context.fieldName]));
    }
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    return util.canEditField(context, opts) ?
      c.views.input(scope, context, opts)
    : c.views.value(scope, context, opts);
  }
};
