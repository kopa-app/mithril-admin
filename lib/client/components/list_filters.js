'use strict';

var _ = require('lodash');
var m = require('mithril');
var util = require('../../util');

var c = module.exports = {
  theme: {
    class: '',
    titleClass: '',
    fieldsClass: '',
    fieldClass: '',
    fieldTag: '',
    sortClass: '',
    sortTag: '',
    sortLabelClass: '',
    sortByInputClass: '',
    sortDirInputClass: '',
    applyButtonClass: ''
  },
  controller: function (context, opts) {
    var scope = {};

    scope.setSortBy = function (value) {
      context.sort.by = value;
    };
    scope.setSortDir = function (value) {
      context.sort.dir = value;
    };

    return scope;
  },
  views: {
    title: function (scope, context, opts) {
      return m('h3' + c.theme.titleClass, 'Filter/Sort');
    },
    fields: function (scope, context, opts) {
      function fieldView(fieldName) {
        var childContext = _.clone(context);
        childContext.fieldName = fieldName;
        childContext.action = 'filter';
        childContext.item = context.filters;
        var field = context.resource.fields[fieldName];

        return m(c.theme.fieldTag + '.m-admin-list-filters-field.m-admin-list-filters-field-' + fieldName + c.theme.fieldClass,
          [
            m.component(context.app.components.fields.filterLabel, childContext, field),
            c.views.fieldInput(scope, childContext, field)
          ]
        );
      }

      return m('.m-admin-list-filters-fields' + c.theme.fieldsClass, context.resource.filterFields.map(fieldView));
    },
    fieldInput: function (scope, context, opts) {
      var component;
      var content = context.filters[context.fieldName] || '';
      if (opts) {
        component = typeof opts.component === 'string' ?
          context.app.components.fields[opts.component] || null
        : opts.component;
      }

      if (component) {
        content = m.component(component, context, opts);
      }

      return content;
    },
    applyButton: function (scope, context, opts) {
      return m('button[type="submit"].m-admin-list-filters-apply' + c.theme.applyButtonClass, 'Apply');
    },
    sort: function (scope, context, opts) {
      return m(c.theme.sortTag + '.m-admin-list-filters-sort' + c.theme.sortClass, [
        c.views.sortLabel(scope, context, opts),
        c.views.sortInputs(scope, context, opts)
      ]);
    },
    sortLabel: function (scope, context, opts) {
      return m('label.m-admin-list-filtets-sort-label' + c.theme.sortLabelClass, 'Sort by');
    },
    sortInputs: function (scope, context, opts) {
      function optionView(name) {
        return m('option', {
          value: name
        }, context.resource.fields[name] ? (context.resource.fields[name].label || name) : name);
      }

      return [
        m('select.m-admin-list-filters-sort-by-input[name="sort"]' + c.theme.sortByInputClass, {
          value: context.sort.by || '',
          placeholder: 'select a field',
          onchange: m.withAttr('value', scope.setSortBy)
        }, context.resource.sortFields.map(optionView)),
        m('select.m-admin-list-filters-sort-dir-input[name="sortDir"]' + c.theme.sortDirInputClass, {
          value: context.sort.dir,
          onchange: m.withAttr('value', scope.setSortDir)
        }, [
          m('option', { value: 'asc' }, 'ascending'),
          m('option', { value: 'desc' }, 'descending')
        ])
      ];
    }
  },
  view: function (scope, context, opts) {
    return m('form.m-admin-list-filters' + c.theme.class, {
      action: 'javascript:;',
      onsubmit: opts.onApply
    }, [
      c.views.title(scope, context, opts),
      c.views.fields(scope, context, opts),
      c.views.sort(scope, context, opts),
      c.views.applyButton(scope, context, opts)
    ]);
  }
};
