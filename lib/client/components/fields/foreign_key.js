'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');

var c = module.exports = {
  theme: {
    class: '',
    applyButtonClass: ''
  },
  controller: function (context, opts) {
    opts = opts || {};
    opts.onChange = opts.onChange || util.noop;

    var scope = {};

    scope.onChange = function (event) {
      event.preventDefault();

      var foreignKey = opts.foreignKey;
      opts.onChange(context.item[foreignKey]);
    };

    return scope;
  },
  views: {
    applyButton: function (scope, context, opts) {
      return m('button.m-admin-button' + c.theme.applyButtonClass, {
        onclick: scope.onChange
      }, 'Apply');
    }
  },
  view: function (scope, context, opts) {
    return m('.m-admin-field.m-admin-foreign-key' + c.theme.class, [
      m.component(
        context.app.components.fields.label, context,
        m.component(context.app.components.fields.text, context)
      ),
      c.views.applyButton(scope, context, opts)
    ]);
  }
};
