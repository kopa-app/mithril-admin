'use strict';

var m = require('mithril');
var util = require('../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, content) {
    return m('.m-admin-load-indicator',
      m('.m-admin-load-indicator-content', content || 'Loading ...')
    );
  }
};
