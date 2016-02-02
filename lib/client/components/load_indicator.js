'use strict';

var m = require('mithril');
var util = require('../../util');

var c = module.exports = {
  theme: {
    class: ''
  },
  controller: util.noop,
  view: function (scope, content) {
    return m('.m-admin-load-indicator' + c.theme.class,
      m('.m-admin-load-indicator-content', content || 'Loading ...')
    );
  }
};
