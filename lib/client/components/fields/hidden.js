'use strict';

var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    opts = opts || {};

    return context.action === 'edit' ?
      m('input[name="' + context.fieldName + '"]', util.removeFalsy({
        type: 'hidden',
        readonly: opts.readonly,
        value: context.item[context.fieldName],
        onchange: util.setFromInput(context.fieldName, context.item)
      }))
    : m('span.m-admin-field-value', context.item[context.fieldName]);
  }
};
