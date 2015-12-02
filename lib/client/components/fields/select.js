'use strict';

var m = require('mithril');
var util = require('../../../util');

function optionView(opt) {
  return m('option', {
    value: opt.value || opt
  }, opt.label || opt.value || opt);
}

function valueView(value, options) {
  var label = value;
  var opt;
  var i = 0;

  while(i < options.length) {
    opt = options[i];

    if (opt && opt.value && opt.value === value) {
      label = opt.label || value;
      i = options.length;
    }

    i++;
  }

  return label;
}

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    opts = opts || {};
    var options = opts.options || [];

    return context.action === 'edit' || context.action === 'create' ?
      m('select[name="' + context.fieldName + '"]', util.removeFalsy({
        value:  context.item[context.fieldName],
        required: opts.required,
        readonly: opts.readonly,
        onchange: util.setFromInput(context.fieldName, context.item)
      }), options.map(optionView))
    : m('span.m-admin-field-value', valueView(context.item[context.fieldName], options))
  }
};
