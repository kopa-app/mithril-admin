'use strict';

var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    opts = opts || {};

    return util.canEditField(context, opts) ?
      m('input[name="' + context.fieldName + '"]', util.removeFalsy({
        type: 'email',
        value: context.item[context.fieldName],
        required: opts.required,
        readonly: opts.readonly,
        oninput: util.setFromInput(context.fieldName, context.item)
      }))
    : m('a.m-admin-field-value', {
      href: 'mailto:' + context.item[context.fieldName]
    }, context.item[context.fieldName]);
  }
};
