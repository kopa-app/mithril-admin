'use strict';

var expect = require('expect.js');
var util = require('./util');

describe('server/api/util', function () {
  var modelName = 'TeamMembership';

  it('should convert model names', function () {
    expect(util.collectionName(modelName)).to.be('teamMemberships');
    expect(util.propertyName(modelName)).to.be('teamMembership');
    expect(util.urlName(modelName)).to.be('team-memberships');
    expect(util.fileName(modelName)).to.be('team_membership');
  });

  it('should remove falsy values from an object', function () {
    expect(util.removeFalsy({
      truthyString: '123', falsyNull: null, falsyFalse: false, zero: 0, empty: '', falsyUndefined: undefined
    }), {
      truthyString: '123', zero: 0, empty: ''
    });
  });
});
