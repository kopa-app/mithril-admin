'use strict';

var m = require('mithril');
var util = require('../../../util');

var c = module.exports = {
  theme: {
    class: '',
    labelClass: '',
    inputClass: ''
  },
  controller: util.noop,
  view: function (scope, context, opts, content) {
    if (typeof content === 'undefined') {
      content = opts;
    }

    opts = opts || {};

    return m('label[for="' + context.fieldName + '"]' + c.theme.class, [
      m('span.m-admin-field-label' + c.theme.labelClass, opts.label || context.fieldName),
      m('span.m-admin-field-input' + c.theme.inputClass, content)
    ]);
  }
};
