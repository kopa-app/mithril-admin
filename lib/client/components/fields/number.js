'use strict';

var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    opts = opts || {};

    return util.canEditField(context, opts) ?
      m('input[name="' + context.fieldName + '"]', util.removeFalsy({
        type: 'number',
        min: (typeof opts.min !== 'undefined') ? opts.min : null,
        max: (typeof opts.max !== 'undefined') ? opts.max : null,
        step: opts.step || null,
        value: parseFloat(context.item[context.fieldName]),
        required: opts.required,
        readonly: opts.readonly,
        oninput: util.setFromInput(context.fieldName, context.item)
      }))
    : m('span.m-admin-field-value', parseFloat(context.item[context.fieldName]));
  }
};
