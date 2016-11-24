const express = require('express');
const app = require('./');
const port = process.env.PORT || 3000;

app.use('/', express.static('public'));
app.listen(port, () => console.log(`listening on ${port}`));
