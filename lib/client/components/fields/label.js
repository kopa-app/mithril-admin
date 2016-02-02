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
  view: function (scope, context, opts) {
    opts = opts || {};

    return m('label[for="' + context.fieldName + '"].m-admin-field-label' + c.theme.class,
      opts.label || context.fieldName
    );
  }
};
