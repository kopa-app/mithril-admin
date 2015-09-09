'use strict';

var m = require('mithril');
var util = require('../../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    opts = opts || {};
    opts.previewUrl = opts.previewUrl || null;
    opts.fullUrl = opts.fullUrl || null;

    return m('figure', [
      m('a', {
        href: opts.fullUrl ? opts.fullUrl(context.item) : context.item[context.fieldName],
        target: 'image',
        title: 'View Image'
      }, opts.previewUrl ?
        m('img', {
          src: opts.previewUrl(context.item)
        })
      : 'View Image'),
      m('figcaption',
        context.action === 'edit' ?
          m('input[name="' + context.fieldName + '"]', util.removeFalsy({
            type: 'text',
            value:  context.item[context.fieldName],
            required: opts.required,
            readonly: opts.readonly,
            oninput: util.setFromInput(context.fieldName, context.item)
          }))
        : m('span.m-admin-field-value', context.item[context.fieldName])
      )
    ]);
  }
};
