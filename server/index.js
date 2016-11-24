const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');

const app = express();

app.use(favicon('public/favicon.ico'));
app.use(logger('dev'));
app.use(require('./manifest'));
app.use(require('./proxy'));

module.exports = app;
