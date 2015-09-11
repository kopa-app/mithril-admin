'use strict';

var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts, content) {
    if (typeof content === 'undefined') {
      content = opts;
    }
    
    opts = opts || {};

    return m('label[for="' + context.fieldName + '"]', [
      m('span.m-admin-field-label', opts.label || context.fieldName),
      m('span.m-admin-field-input', content)
    ]);
  }
};
