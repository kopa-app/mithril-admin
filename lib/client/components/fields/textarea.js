'use strict';

var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    opts = opts || {};

    return util.canEditField(context, opts) ?
      m('textarea[name="' + context.fieldName + '"]', util.removeFalsy({
        value: context.item[context.fieldName],
        required: opts.required,
        readonly: opts.readonly,
        oninput: util.setFromInput(context.fieldName, context.item)
      }))
    : m('pre.m-admin-field-value', context.item[context.fieldName]);
  }
};
