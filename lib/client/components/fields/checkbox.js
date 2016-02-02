'use strict';

var m = require('mithril');
var util = require('../../../util');


var c = module.exports = {
  controller: util.noop,
  theme: {
    inputClass: '',
    valueClass: ''
  },
  views: {
    input: function (scope, context, opts) {
      return m('input[name="' + context.fieldName + '"].m-admin-field-input' + c.theme.inputClass, util.removeFalsy({
        type: 'checkbox',
        checked:  context.item[context.fieldName],
        required: opts.required,
        readonly: opts.readonly,
        onclick: function (event) {
          context.item[context.fieldName] = event.target.checked;
        }
      }));
    },
    value: function (scope, context, opts) {
      return m('span.m-admin-field-value' + c.theme.valueClass, context.item[context.fieldName] ? 'yes' : 'no');
    }
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    return util.canEditField(context, opts) ?
      c.views.input(scope, context, opts)
    : c.views.value(scope, context, opts)
  }
};
