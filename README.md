# Mithril-Admin

An automatic Admin Interface for your RestFull web-service using mithril.js.

## Installation

```bash
$ npm install kopa-app/mithril-admin
```

## Run example

```bash
$ npm start
```

This will start an example app at [http://localhost:4000](http://localhost:4000).

## Integrate in your (mithril) app

```javascript
var admin = require('mithril-admin');

var app = admin({
  basePath: '/admin', // default = '' base path for the router
  restUrl: 'http://jsonplaceholder.typicode.com' // default = '/' base URL to your RestFul web-service
});

app
  .resource('Post', {
    fields: {
      title: { component: 'text', required: true },
      body: { component: 'textarea', required: true },
      userId: { component: 'relation', resource: 'User', relationType: 'belongsTo' }
    },
    listFields: ['title']
  })
  .resource('Comment', {
    listFields: ['name']
  })
  .resource('User', {
    fields: {
      name: { component: 'text', required: true },
      username: { component: 'text', required: true },
      email: { component: 'email', required: true, validate: isEmail },
      address: {
        component: 'group',
        fields: {
          street: { component: 'text' },
          // ...
        }
      }
    },
    listFields: ['name', 'email']
  });

  // mount into an existing DOM element
  app.mount(document.getElementById('app'));

  // or retrieve mithril routes you can use in m.route()
  var routes = app.routes();
```
