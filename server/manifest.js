const {Router} = require('express');
const router = new Router();

const manifestDate = new Date();
const {resources, version} = require('../offline/resources');

const manifest = `CACHE MANIFEST
# v${version}
# generated ${manifestDate.toDateString()}

${resources.join('\n')}

NETWORK:
*`;

router.get('/manifest.appcache', (req, res) => res
.type('text/cache-manifest')
.set('cache-control', 'max-age=0, no-cache, no-store, must-revalidate')
.send(manifest));

module.exports = router;

if(module === require.main) {
	console.log(manifest);
}
