const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const browserify = require('browserify-middleware');
const sass = require('node-sass-middleware');
const proxy = require('express-http-proxy');
const httpsRedirect = require('express-https-redirect');

const {resources, version} = require('./offline/resources');

const app = express();
const serverStarted = new Date();

app.use(favicon('public/favicon.ico'));
app.use(logger('dev'));

app.use(httpsRedirect());

app.use('/main.js', browserify('app/index.jsx'));
app.use('/sw.js', browserify('offline/service-worker.js'));
app.use(sass({src: 'styles', dest: 'public'}));

app.use('/_api', proxy('countdown.api.tfl.gov.uk'));

app.get('/manifest.appcache', (req, res) => res
.type('text/cache-manifest')
.set('cache-control', 'max-age=0, no-cache, no-store, must-revalidate')
.send(`CACHE MANIFEST
# ${serverStarted} v${version}

${resources.join('\n')}

NETWORK:
*
`));

app.use('/', express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
