'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../../util');

var c = module.exports = {
  theme: {
    class: '',
    formClass: '',
    errorsClass: '',
    saveButtonClass: ''
  },
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
        var method = context.action === 'create' ?
          context.resource.create : context.resource.save;

        method(context.item)
          .then(function (result) {
            _.merge(context.item, result.data);
            scope.saving = false;

            // this was a new resource, now we are in editing context
            if (context.action === 'create') {
              context.action = 'edit';
            }
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
  views: {

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
      return m('.m-admin-resource' + c.theme.class, !scope.removed ?
        m.component(
          context.app.components.fields.group,
          context, childOpts
        )
      : null);
    }

    if ((context.action === 'edit' || context.action === 'create') && !scope.removed) {
      return m('form.m-admin-form' + c.theme.formClass, {
        onsubmit: scope.submit
      }, [
        scope.errors.length ?
          m('ul.m-admin-form-errors' + c.theme.errorsClass,
            scope.errors.map(errorView)
          )
        : null,

        resourceView(),

        m('button.m-admin-button' + c.theme.saveButtonClass, 'Save'),

        context.action === 'edit' ?
          m.component(context.app.components.removeButton, context.item, scope.onRemove)
        : null,

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
