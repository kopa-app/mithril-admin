'use strict';

var util = require('../../../util');
var datetime = require('./datetime');

var c = module.exports = {
  controller: function (context, opts) {
    opts = opts || {};
    opts.granularity = false;
    var scope = new datetime.controller(context, opts);
    return scope;
  },
  view: function (scope, context, opts) {
    opts = opts || {};
    opts.granularity = false;
    return datetime.view(scope, context, opts);
  }
};
