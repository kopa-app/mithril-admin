'use strict';

var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var cachedBundle = '';
var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 4000;
var b = browserify(require.resolve('./example'));
var JsonServer = require('json-server');
var jsonServer = JsonServer.create();
var jsonData = require('./lib/server/json_data');
var indexHtml = fs.readFileSync(path.join(__dirname, './example/public/index.html'), 'utf8');

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

app.get('/', function (req, res, next) {
  var themeStyles = {
    'default': '<link rel="stylesheet" type="text/css" href="/default_theme.css">',
    'primercss': '<link rel="stylesheet" type="text/css" href="/primer.css"><link rel="stylesheet" type="text/css" href="/primer_theme.css">',
    'bootstrap': '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous"><link rel="stylesheet" type="text/css" href="/bootstrap_theme.css">'
  };

  var theme = req.query.theme || 'default';

  res
    .type('html')
    .end(indexHtml.replace('${themeStyles}', themeStyles[theme]));
});

app.use(express.static(path.join(__dirname, './example/public')));

jsonServer.use(JsonServer.defaults());
jsonServer.use(JsonServer.router(jsonData()));
app.use('/api', jsonServer);

app.listen(port);
console.log('listening on http://localhost:' + port);
