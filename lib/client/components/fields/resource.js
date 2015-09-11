'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: function (context) {
    var scope = {};
    scope.saving = false;
    scope.removing = false;
    scope.removed = false;
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

    scope.onRemove = function (item) {
      scope.removing = true;

      if (context.items) {
        var index = context.items.indexOf(item);

        if (index !== -1) {
          context.items.splice(index, 1);
        }
      }

      setImmediate(function () {
        context.resource.remove(item)
          .then(function () {
            scope.removing = false;
            scope.removed = true;
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
      return m('.m-admin-resource', !scope.removed ?
        m.component(
          context.app.components.fields.group,
          context, childOpts
        )
      : null);
    }

    if (context.action === 'edit' && !scope.removed) {
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
        m.component(context.app.components.removeButton, context.item, scope.onRemove),

        scope.saving ?
          m.component(context.app.components.loadIndicator, 'Saving ...')
        : null,

        scope.removing ?
          m.component(context.app.components.loadIndicator, 'Removing ...')
        : null
      ]);
    }

    return resourceView();
  }
};
