const app = require('./server');
const express = require('express');
const browserify = require('browserify-middleware');
const sass = require('node-sass-middleware');

app.use('/main.js', browserify('app/index.jsx'));
app.use('/sw.js', browserify('offline/service-worker.js'));
app.use(sass({src: 'styles', dest: 'public'}));
app.use(require('./server/manifest'));

app.use('/', express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
