'use strict';

var m = require('mithril');
var admin = require('./index');

m.route.mode = 'hash';

var app = admin({
  basePath: '/admin',
  restUrl: 'http://jsonplaceholder.typicode.com'
});

app
  .resource('Post', {
    listFields: ['title']
  })
  .resource('Comment', {
    listFields: ['name']
  })
  .resource('User', {
    listFields: ['name', 'email']
  })
  .mount(document.getElementById('app'));
