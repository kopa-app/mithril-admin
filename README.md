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
  basePath: '', // default = '' base path for the router
  restUrl: '/' // default = '/' base URL to your RestFul web-service
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
```
