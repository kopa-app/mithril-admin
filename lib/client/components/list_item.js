'use strict';

var m = require('mithril');
var util = require('../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, app, item, opts) {
    var resource = app.resource.current();

    function fieldView(field) {
      return m('td', field === 'id' ? m('a', {
        href: opts.url
      }, item[field]) : item[field]);
    }

    return m('tr', resource.listFields.map(fieldView));
  }
};
