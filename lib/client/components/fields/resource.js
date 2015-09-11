'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: function (context) {
    var scope = {};
    scope.saving = false;
    scope.errors = [];

    scope.submit = function (event) {
      event.preventDefault();

      scope.errors = context.resource.validate(context.item);

      if (scope.errors.length) {
        return;
      }

      scope.saving = true;

      setImmediate(function () {
        context.resource.save(context.item)
          .then(function (result) {
            _.merge(context.item, result);
            scope.saving = false;
          });
      });
    };

    return scope;
  },
  view: function (scope, context, opts) {
    var childOpts = {
      fields: context.resource.fields,
      label: false,
      collapsible: false
    };

    function errorView(error) {
      return m('li', error);
    }

    function resourceView() {
      return m('.m-admin-resource', m.component(
        context.app.components.fields.group,
        context, childOpts
      ));
    }

    if (context.action === 'edit') {
      return m('form.m-admin-form', {
        onsubmit: scope.submit
      }, [
        scope.errors.length ?
          m('ul.m-admin-form-errors',
            scope.errors.map(errorView)
          )
        : null,

        resourceView(),

        m('button.m-admin-button', 'Save'),

        scope.saving ?
          m.component(context.app.components.loadIndicator, 'Saving ...')
        : null
      ]);
    }

    return resourceView();
  }
};
