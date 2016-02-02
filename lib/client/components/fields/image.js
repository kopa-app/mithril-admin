'use strict';

var m = require('mithril');
var util = require('../../../util');

var c = module.exports = {
  theme: {
    class: '',
    viewButtonClass: '',
    previewImageClass: '',
    captionClass: '',
    valueClass: '',
  },
  controller: util.noop,
  views: {
    viewButton: function (scope, context, opts) {
      return m('a' + c.theme.viewButtonClass, {
        href: opts.imageUrl ? opts.imageUrl(context.item) : context.item[context.fieldName],
        target: 'image',
        title: 'View Image'
      }, opts.previewUrl ?
        m('img' + c.theme.previewImageClass, {
          src: opts.previewUrl(context.item)
        })
      : 'View Image');
    },
    input: function (scope, context, opts) {
      return m('input[name="' + context.fieldName + '"].m-admin-field-input' + c.theme.inputClass, util.removeFalsy({
        type: 'text',
        value:  context.item[context.fieldName],
        required: opts.required,
        readonly: opts.readonly,
        oninput: util.setFromInput(context.fieldName, context.item)
      }));
    },
    value: function (scope, context, opts) {
      return m('span.m-admin-field-value' + c.theme.valueClass, context.item[context.fieldName]);
    }
  },
  view: function (scope, context, opts) {
    opts = opts || {};
    opts.previewUrl = opts.previewUrl || null;
    opts.imageUrl = opts.imageUrl || null;

    return m('figure.m-admin-field-image' + c.theme.class, [
      c.views.viewButton(scope, context, opts),
      m('figcaption.m-admin-field-image-value' + c.theme.captionClass,
        util.canEditField(context, opts) ?
          c.views.input(scope, context, opts)
        : c.views.value(scope, context, opts)
      )
    ]);
  }
};
