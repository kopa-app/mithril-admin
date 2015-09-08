'use strict';

var express = require('express');
var app = express();
var path = require('path');
var browserify = require('browserify');
var cachedBundle = '';
var env = process.env.NODE_ENV || 'development';

var b = browserify(require.resolve('./lib/client/example'));

function onBundle(err, buf) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('created bundle');
  cachedBundle = buf.toString();
}

if (env === 'development') {
  var watchify = require('watchify');
  b = watchify(b);
  
  b.on('update', function () {
    b.bundle(onBundle);
  });
  b.bundle(onBundle);
}

app.use(express.static(path.join(__dirname, './public')));
app.listen(process.env.PORT || 4000);

app.get('/app.js', function (req, res, next) {
  res.type('js');
  res.send(cachedBundle);
});
