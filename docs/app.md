## Main App

You can create an admin app using:

```javascript
var admin = require('mithril-admin');

var adminApp = admin({ /* options here */ });
```

Check out the [available options](#available-options).

... and then inject the app into an existing DOM-Element:

```javascript
adminApp.mount(document.getElementById('app'));
```

... or include the routes in your mithril routes:

```javascript
var routes = {
  '/': require('./lib/apps/home'),
  '/login': require('./lib/apps/login'),
  '/logout': require('./lib/apps/logout')
};

var adminRoutes = adminApp.routes();

// mixin admin routes into your routes
Object.keys(adminRoutes).forEach(function (route) {
  routes[route] = adminRoutes[route];
});

// mount routes to an existing DOM-Element
m.route(document.getElementById('app'), '/', routes);
```

## Available Options

```javascript
{
  basePath: '', // base path for the admin routes
  restUrl: '/', // root URL to your REST-Service
  perPage: 10, // number of items per page in lists
  snakeCase: false, // if true, foreign keys are snake_case, instead of camelCase

  // function that loads one or more items of type "resource"
  // must return a promise
  // by default, delegates to adminApp.request()
  load: function (resource, query) { /* ... */ },

  // function that saves/updates an item of type "resource"
  // must return a promise
  // by default, delegates to adminApp.request()
  save: function (resource, item) { /* ... */ },

  // function that creates an item of type "resource"
  // must return a promise
  // by default, delegates to adminApp.request()
  create: function (resource, item) { /* ... */ },

  // function that removes an item of type "resource"
  // must return a promise
  // by default, delegates to adminApp.request()
  remove: function (resource, item) { /* ... */ },

  primaryKey: 'id', // name of the field containing the unique primary key for resources

  // function that returns the primary unique key of an item
  // by default it returns the value of "primaryKey"
  id: function(resource, item) { /* ... */ },

  // function that returns the full URL to one or more item of type "resource" from the REST-Service
  // if "id" is given it must return an URL to a single item, if not to an item list
  // by default it constructs URLs of the following pattern: ":restUrl/:resource-url-name/:id"
  restUrlFor: function (resource, id) { /* ... */ }
}
```
