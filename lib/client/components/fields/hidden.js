'use strict';

var m = require('mithril');
var util = require('../../../util');

var c = module.exports = {
  theme: {
    valueClass: ''
  },
  controller: util.noop,
  views: {
    input: function (scope, context, opts) {
      return m('input[name="' + context.fieldName + '"]', util.removeFalsy({
        type: 'hidden',
        readonly: opts.readonly,
        value: context.item[context.fieldName],
        onchange: util.setFromInput(context.fieldName, context.item)
      }));
    },
    value: function (scope, context, opts) {
      return m('span.m-admin-field-value' + c.theme.valueClass, context.item[context.fieldName]);
    }
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    return util.canEditField(context, opts) ?
      c.views.input(scope, context, opts)
    : c.views.value(scope, context, opts);
  }
};
