var React  = require("react");
var _      = require("underscore");
var url    = require("url");
var Bus    = require("./bus.jsx");
var latLon = require("./latlon.js");

var Stop = React.createClass({
  distanceToStart() {
    return Math.round(10 * latLon(this.props.location).distanceTo(
      latLon({coords: this.props.stop})
    ) / 1.609344) / 10;
  },

  streetView() {
    var opts = {
      protocol: "https",
      hostname: "maps.googleapis.com",
      pathname: "maps/api/streetview",
      query: {
        size: [
          window.innerWidth,
          Math.round(window.innerWidth / 2)
        ].join("x"),
        location: [
          this.props.stop.latitude,
          this.props.stop.longitude
        ].join(),
        fov: 180,
        pitch: 0,
        heading: this.props.stop.bearing - 90
      }
    };
    return "linear-gradient(to bottom, rgba(220,36,31,0.1), rgba(220,36,31,0.1), rgba(220,36,31,0.3)), url(" + url.format(opts) + ")";
  },

  render() {
    return <div className="stop">
      <header className="stop-header" style={{backgroundImage: this.streetView()}}>
      <h1 className="stop-title"><span className="bus-emblem">{this.props.stop.stopPointIndicator}</span> {this.props.stop.stopPointName}</h1>
      <h2 className="stop-destination">Towards {this.props.stop.towards}</h2>
      <h3 className="stop-distance">{this.distanceToStart()} miles</h3>
      </header>
      <ul className="bus-list">
      {_.chain(this.props.stop.predictions)
       .groupBy("lineName")
       .pairs()
       .sortBy((p) => new Date(p[1][0].estimatedTime))
       .map((p) => <Bus name={p[0]} key={p[0]} predictions={p[1]} /> )
       .value()}
      </ul>
    </div>;
  }
});

module.exports = Stop;