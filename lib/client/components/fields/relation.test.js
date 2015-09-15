'use strict';

var expect = require('expect.js');
var relation = require('./relation');
var admin = require('../../index');

describe('components/fields/relation', function () {
  it('should support snake_cased automatic foreign keys', function (next) {
    var app = admin({
      snakeCase: true
    });

    app.resource('Foo');
    app.resource('Bar');

    app.resources.Bar.load = function (query) {
      expect(query).to.have.property('foo_id');
      expect(query.foo_id).to.be(123);
      next();
    };

    var scope = new relation.controller({
      app: app,
      resource: app.resources.Foo,
      item: {
        id: 123
      }
    }, {
      resource: 'Bar',
      relationType: 'hasMany'
    });

    scope.load();
  });
});
