'use strict';

var qs = require('query-string');
var m = require('mithril');
var admin = require('../lib/client'); // do require('mithril-admin') in your app
var primercss = require('mithril-admin-primercss');
var bootstrap = require('mithril-admin-bootstrap');
var query = qs.parse(window.location.search);
var theme = query.theme || null;

// create admin app
var app = admin({
  basePath: '/admin', // mount to /admin route
  restUrl: '/api',

  // we override the load method to adjust pagination
  load: function (resource, query) {
    if (query && typeof query === 'object' && query.page && query.perPage) {
      query._start = (query.page - 1) * query.perPage;
      delete query.page;

      query._limit = query.perPage;
      delete query.perPage;
    }

    // reuse existing load method
    return app.resource.load(resource, query);
  }
});


// use primer css plugin
if (theme === 'primercss') {
  app.use(primercss());
}
else if (theme === 'bootstrap') {
  app.use(bootstrap());
}

// define resources
app
  .resource('Post', {
    fields: {
      title: { component: 'text', required: true },
      body: { component: 'textarea', required: true },
      tags: { component: 'tags' },
      createdAt: { component: 'datetime', dateTimeFormat: 'YYYY/MM/DD hh:mm:ss', readonly: true },
      publishAt: { component: 'datetime', dateTimeFormat: 'YYYY/MM/DD hh:mm', dateFormat: 'YYYY/MM/DD', granularity: 'minutes' },
      published: { component: 'checkbox' },
      userId: {
        component: 'relation',
        resource: 'User',
        relationType: 'belongsTo',
        itemsComponent: 'resourceList' // displays resources inline
      },
      comments: { component: 'relation', resource: 'Comment', relationType: 'hasMany' }
    },
    listFields: ['title', 'published', 'publishAt']
  })
  .resource('Comment', {
    fields: {
      name: { component: 'text', required: true },
      email: { component: 'email', required: true },
      body: { component: 'textarea', required: true },
      createdAt: { component: 'datetime', dateTimeFormat: 'YYYY/MM/DD hh:mm', granularity: 'minutes', readonly: true },
      published: { component: 'checkbox' },
      postId: { component: 'relation', resource: 'Post', relationType: 'belongsTo' }
    },
    listFields: ['name', 'email', 'published', 'createdAt']
  })
  .resource('Album', {
    fields: {
      title: { component: 'text', required: true },
      userId: { component: 'relation', resource: 'User', relationType: 'belongsTo' },
      photos: { component: 'relation', resource: 'Photo', relationType: 'hasMany' }
    },
    listFields: ['title']
  })
  .resource('Photo', {
    fields: {
      title: { component: 'text', required: true },
      url: {
        component: 'image', required: true,
        previewUrl: function (item) {
          return item.thumbnailUrl;
        },
        imageUrl: function (item) {
          return item.url;
        }
      },
      takenAt: { component: 'datetime', dateTimeFormat: 'YYYY/MM/DD hh:mm:ss', dateFormat: 'YYYY/MM/DD' },
      albumId: { component: 'relation', resource: 'Album', relationType: 'belongsTo' }
    },
    listFields: ['title', 'url', 'takenAt']
  })
  .resource('Todo', {
    fields: {
      title: { component: 'text', required: true },
      completed: { component: 'checkbox' },
      userId: { component: 'relation', resource: 'User', relationType: 'belongsTo' }
    },
    listFields: ['title', 'completed']
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
              lat: { component: 'number', min: -180, max: 180, step: 0.00001 },
              lng: { component: 'number', min: -180, max: 180, step: 0.00001 }
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
          catchPhrase: { component: 'text' },
          bs: { component: 'text' }
        }
      },
      role: {
        component: 'select',
        options: [
          { value: 'admin', label: 'Adminstrator' },
          { value: 'manager', label: 'Manager' },
          { value: 'guest', label: 'Guest' }
        ]
      },
      todos: { component: 'relation', resource: 'Todo', relationType: 'hasMany' },
      posts: { component: 'relation', resource: 'Post', relationType: 'hasMany' }
    },
    listFields: ['name', 'email', 'role']
  });

// now inject the app into our page
app.mount(document.getElementById('app'));
