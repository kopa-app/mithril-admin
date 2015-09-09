'use strict';

var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    opts = opts || {};

    return context.action === 'edit' ?
      m('input[name="' + context.fieldName + '"]', util.removeFalsy({
        type: 'text',
        value:  context.item[context.fieldName],
        required: opts.required,
        readonly: opts.readonly,
        oninput: util.setFromInput(context.fieldName, context.item)
      }))
    : m('span.m-admin-field-value', context.item[context.fieldName])
  }
};
