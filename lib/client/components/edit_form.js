'use strict';

var _ = require('lodash');
var m = require('mithril');

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
  view: function (scope, context) {
    function errorView(error) {
      return m('li', error);
    }

    return m('form.m-admin-form', {
      onsubmit: scope.submit
    }, [
      scope.errors.length ?
        m('ul.m-admin-form-errors',
          scope.errors.map(errorView)
        )
      : null,

      m.component(context.app.components.fields.group, context, {
        fields: context.resource.fields,
        collapsible: false,
        label: false
      }),
      m('button.m-admin-button', 'Save'),
      m('a.m-admin-button', {
        href: context.resource.adminUrlFor(context.item)
      }, 'Cancel'),

      scope.saving ?
        m.component(context.app.components.loadIndicator, 'Saving ...')
      : null
    ]);
  }
};
