'use strict';

var m = require('mithril');
var admin = require('../lib/client'); // do require('mithril-admin') in your app

// set router to hash mode
m.route.mode = 'hash';

// create admin app
var app = admin({
  basePath: '/admin', // mount to /admin route
  restUrl: 'http://jsonplaceholder.typicode.com',

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

// define resources
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
      albumId: { component: 'relation', resource: 'Album', relationType: 'belongsTo' }
    },
    listFields: ['title', 'url']
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
          chatPhrase: { component: 'text' },
          bs: { component: 'text' }
        }
      },
      todos: { component: 'relation', resource: 'Todo', relationType: 'hasMany' }
    },
    listFields: ['name', 'email']
  });

// now inject the app into our page
app.mount(document.getElementById('app'));
