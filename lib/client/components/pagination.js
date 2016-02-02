'use strict';

var m = require('mithril');
var util = require('../../util');

var c = module.exports = {
  theme: {
    class: '',
    listClass: '',
    backClass: '',
    backButtonClass: '',
    currentClass: '',
    nextClass: '',
    nextButtonClass: ''
  },
  controller: function (context, opts) {
    var scope = {};

    scope.normalizeOpts = function (opts) {
      opts = opts || {};
      opts.onPageChange = opts.onPageChange || util.noop;

      opts.page = opts.page || 1;
      opts.perPage = opts.perPage || context.app.perPage;
      return opts;
    };

    scope.lastPage = function () {
      return Math.ceil(opts.total / opts.perPage);
    };

    scope.isLastPage = function () {
      return (opts.total !== -1 && opts.page === Math.ceil(opts.total / opts.perPage));
    };

    scope.toNextPage = function () {
      if (!scope.isLastPage()) {
        opts.page++;
        opts.onPageChange(opts.page);
      }
    };

    scope.toPrevPage = function () {
      if (opts.page > 1) {
        opts.page--;
        opts.onPageChange(opts.page);
      }
    };

    scope.normalizeOpts(opts);

    return scope;
  },
  views: {
    items: function (scope, context, opts) {
      return [
        c.views.back(scope, context, opts),
        c.views.current(scope, context, opts),
        c.views.next(scope, context, opts)
      ];
    },
    back: function (scope, context, opts) {
      return m('button.m-admin-button' + c.theme.backButtonClass, util.removeFalsy({
        disabled: opts.page <= 1,
        onclick: scope.toPrevPage
      }), '<');
    },
    current: function (scope, context, opts) {
      return m('span' + c.theme.currentClass, 'Page ' + opts.page + (opts.total !== -1 ? ' of ' + scope.lastPage() : ''));
    },
    next: function (scope, context, opts) {
      return m('button.m-admin-button' + c.theme.nextButtonClass, util.removeFalsy({
        disabled: scope.isLastPage(),
        onclick: scope.toNextPage
      }), '>');
    }
  },
  view: function (scope, context, opts) {
    opts = scope.normalizeOpts(opts);

    return m('nav.m-admin-pagination' + c.theme.class,
      (opts.total <= opts.perPage) ?
        null
      : c.views.items(scope, context, opts)
    );
  }
};
