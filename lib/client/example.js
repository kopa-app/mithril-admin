'use strict';

var m = require('mithril');
var admin = require('./index');

m.route.mode = 'hash';

var app = admin({
  basePath: '/admin',
  restUrl: 'http://jsonplaceholder.typicode.com',
  transformQuery: function (query) {
    if (query && query.page && query.perPage) {
      query._start = (query.page - 1) * query.perPage;
      delete query.page;

      query._limit = query.perPage;
      delete query.perPage;
    }

    return query;
  }
});

app
  .resource('Post', {
    listFields: ['title'],
    fields: {
      title: { component: 'text', required: true },
      body: { component: 'textarea', required: true },
      userId: { component: 'relation', resource: 'User', relationType: 'belongsTo' },
      comments: { component: 'relation', resource: 'Comment', relationType: 'hasMany' }
    }
  })
  .resource('Comment', {
    fields: {
      name: { component: 'text', required: true },
      email: { component: 'email', required: true },
      body: { component: 'textarea', required: true },
      postId: { component: 'relation', resource: 'Post', relationType: 'belongsTo' }
    },
    listFields: ['name', 'email']
  })
  .resource('User', {
    fields: {
      name: { component: 'text', required: true },
      username: { component: 'text', required: true },
      email: { component: 'email', required: true },
      address: {
        component: 'group',
        fields: {
          street: { component: 'text' },
          suite: { component: 'text' },
          city: { component: 'text' },
          zipcode: { component: 'text' },
          geo: {
            component: 'group',
            fields: {
              lat: { component: 'number', min: -180, max: 180 },
              lng: { component: 'number', min: -180, max: 180 }
            }
          }
        }
      },
      phone: { component: 'text' },
      website: { component: 'text' },
      company: {
        component: 'group',
        fields: {
          name: { component: 'text' },
          chatPhrase: { component: 'text' },
          bs: { component: 'text' }
        }
      }
    },
    listFields: ['name', 'email']
  })
  .mount(document.getElementById('app'));
