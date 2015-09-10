'use strict';

var express = require('express');
var app = express();
var path = require('path');
var browserify = require('browserify');
var cachedBundle = '';
var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 4000;
var b = browserify(require.resolve('./example'));

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

app.get('/app.js', function (req, res, next) {
  res.type('js');
  res.send(cachedBundle);
});

app.use(express.static(path.join(__dirname, './example/public')));
app.listen(port);
console.log('listening on http://localhost:' + port);
