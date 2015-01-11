var LatLon = require("mt-latlon");

module.exports = function geoToLatlon({coords}) {
  return new LatLon(coords.latitude, coords.longitude);
};