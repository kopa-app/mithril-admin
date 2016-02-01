'use strict';

var m = require('mithril');
var util = require('../../../util');

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

var c = module.exports = {
  theme: {
    inputClass: ''
  },
  controller: function (context, opts) {
    var scope = {};

    scope.getOptions = function () {
      return (typeof opts.options === 'function') ? opts.options() : opts.options || [];
    };

    return scope;
  },
  views: {
    input: function (scope, context, opts) {
      var options = scope.getOptions();

      return m('select[name="' + context.fieldName + '"]' + c.inputClass, util.removeFalsy({
        value:  context.item[context.fieldName],
        required: opts.required,
        readonly: opts.readonly,
        onchange: util.setFromInput(context.fieldName, context.item)
      }), options.map(c.views.inputOption.bind(null, scope, context, opts)));
    },
    value: function (scope, context, opts) {
      var options = scope.getOptions();

      return m('span.m-admin-field-value' + c.theme.valueClass, valueView(context.item[context.fieldName], options));
    },
    inputOption: function (scope, context, opts, option) {
      return m('option', {
        value: option.value || option
      }, option.label || option.value || option);
    }
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    return util.canEditField(context, opts) ?
      c.views.input(scope, context, opts)
    : c.views.value(scope, context, opts);
  }
};
