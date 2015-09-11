'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: function (context, opts) {
    opts = opts || {};
    opts.onChange = opts.onChange || util.noop;
    
    var scope = {};

    scope.onChange = function (event) {
      event.preventDefault();

      var foreignKey = opts.foreignKey || context.resource.propertyName + 'Id';
      opts.onChange(context.item[foreignKey]);
    };

    return scope;
  },
  view: function (scope, context, opts) {
    console.log(context);
    return m('.m-admin-field.m-admin-foreign-key', [
      m.component(
        context.app.components.fields.label, context,
        m.component(context.app.components.fields.text, context)
      ),
      m('button.m-admin-button', {
        onclick: scope.onChange
      }, 'Apply')
    ]);
  }
};
