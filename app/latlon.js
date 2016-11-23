var LatLon = require('mt-latlon');

module.exports = function geoToLatlon({latitude, longitude}) {
  return new LatLon(latitude, longitude);
};
