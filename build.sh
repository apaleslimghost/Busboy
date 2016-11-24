#!/bin/sh

set -x -e

export NODE_ENV=production

node-sass styles/main.scss > public/main.css
browserify app/index.jsx | babili > public/main.js
browserify offline/service-worker.js | babili > public/sw.js
node server/manifest > public/manifest.appcache

rm -rf server/public
cp -r public server/public
