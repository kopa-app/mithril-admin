'use strict';

var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    opts = opts || {};

    return util.canEditField(context, opts) ?
      m('input[name="' + context.fieldName + '"]', util.removeFalsy({
        type: 'checkbox',
        checked:  context.item[context.fieldName],
        required: opts.required,
        readonly: opts.readonly,
        onclick: function (event) {
          context.item[context.fieldName] = event.target.checked;
        }
      }))
    : m('span.m-admin-field-value', context.item[context.fieldName] ? 'yes' : 'no')
  }
};
