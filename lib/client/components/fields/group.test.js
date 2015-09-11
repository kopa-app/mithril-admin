'use strict';

var expect = require('expect.js');
var mq = require('mithril-query');
var group = require('./group');
var admin = require('../../');

describe('component/fields/group', function () {
  var app = admin();

  app.resource('User', {});

  it('should support functions as field config', function () {
    var context = {
      resource: app.resources.User,
      app: app,
      item: {
        username: 'foo',
        email: 'foo@bar.com'
      },
      action: 'edit'
    };

    function emailFieldConfig(context) {
      return {
        component: 'email'
      };
    }

    function fieldConfig(context) {
      return {
        fields: {
          username: { component: 'text' },
          email: emailFieldConfig
        },
        collapsible: false
      };
    }

    var $out = mq(group, context, fieldConfig);
    $out.should.have(1, 'input[type="email"]');
  });
});
