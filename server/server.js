const express = require('express');
const compression = require('compression');

const app = require('./');
const port = process.env.PORT || 3000;

app.use(compression());
app.use('/', express.static('public'));
app.listen(port, () => console.log(`listening on ${port}`));
