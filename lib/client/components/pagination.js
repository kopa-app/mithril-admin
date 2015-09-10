'use strict';

var m = require('mithril');
var util = require('../../util');

module.exports = {
  controller: util.noop,
  view: function (scope, context, opts) {
    opts = opts || {};
    opts = opts || {};
    opts.onPageChange = opts.onPageChange || util.noop;

    opts.page = opts.page || 1;
    opts.perPage = opts.perPage || context.app.perPage;

    function lastPage() {
      return Math.ceil(opts.total / opts.perPage);
    }

    function isLastPage() {
      return (opts.total !== -1 && opts.page === Math.ceil(opts.total / opts.perPage));
    }

    function nextPage() {
      if (!isLastPage()) {
        opts.page++;
        opts.onPageChange(opts.page);
      }
    }

    function prevPage () {
      if (opts.page > 1) {
        opts.page--;
        opts.onPageChange(opts.page);
      }
    }

    return m('nav.m-admin-pagination',
      (opts.total <= opts.perPage) ?
        null
      : m('ul', [
        m('li', m('button.m-admin-button', util.removeFalsy({
          disabled: opts.page <= 1,
          onclick: prevPage
        }), '<')),

        m('li', m('span', 'Page ' + opts.page + (opts.total !== -1 ? ' of ' + lastPage() : ''))),


        m('li', m('button.m-admin-button', util.removeFalsy({
          disabled: isLastPage(),
          onclick: nextPage
        }), '>'))
      ])
    );
  }
};
