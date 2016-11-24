const {Router} = require('express');
const proxy = require('express-http-proxy');
const router = new Router();

router.use('/_api', proxy('countdown.api.tfl.gov.uk'));

module.exports = router;
