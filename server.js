const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const browserify = require('browserify-middleware');
const sass = require('node-sass-middleware');
const proxy = require('express-http-proxy');

const app = express();

app.use(favicon('public/favicon.ico'));
app.use(logger('dev'));
app.use('/main.js', browserify('app/index.jsx'));
app.use(sass({src: 'styles', dest: 'public'}));
app.use('/_api', proxy('countdown.api.tfl.gov.uk'));
app.use('/', express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
