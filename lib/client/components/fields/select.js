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

    scope.getOptions = function (opts) {
      opts = opts || {};
      return (typeof opts.options === 'function') ? opts.options() : opts.options || [];
    };

    return scope;
  },
  views: {
    input: function (scope, context, opts) {
      var options = scope.getOptions(opts);

      function optionView(option) {
        return m('option', {
          value: option.value || option
        }, option.label || option.value || option);
      }

      return m('select[name="' + context.fieldName + '"].m-admin-field-input' + c.inputClass, util.removeFalsy({
        value:  context.item[context.fieldName],
        required: opts.required,
        readonly: opts.readonly,
        onchange: util.setFromInput(context.fieldName, context.item)
      }), options.map(optionView));
    },
    value: function (scope, context, opts) {
      var options = scope.getOptions();

      return m('span.m-admin-field-value' + c.theme.valueClass, valueView(context.item[context.fieldName], options));
    }
  },
  view: function (scope, context, opts) {
    opts = opts || {};

    return util.canEditField(context, opts) ?
      c.views.input(scope, context, opts)
    : c.views.value(scope, context, opts);
  }
};
