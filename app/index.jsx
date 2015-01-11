var React  = require("react");
var _      = require("underscore");
var Bacon  = require("baconjs");
var busboy = require("tfl-busboy");
var latLon = require("./latlon.js");
var Tab    = require("./tab.jsx");
var Icon   = require("./icon.jsx");
var Stop   = require("./stop.jsx");

var {BaconMixin} = require("react-bacon");

function pollLocation() {
  return Bacon.fromCallback(
    navigator.geolocation,
    "watchPosition"
  );
}

var Busboy = React.createClass({
  mixins: [BaconMixin],

  getInitialState() {
    return {
      stops: {meta: {loading: true}},
      currentStop: 0
    };
  },

  componentWillMount() {
    var location = pollLocation();

    this.plug(location, "location");
    this.plug(location.flatMap(function({coords}) {
      return busboy.around({
        lat: coords.latitude, lng: coords.longitude
      }, Math.min(Math.max(coords.accuracy, 200), 1000));
    }).map((stops) => {
      if(stops.meta.loading) {
        return _.extend(this.state.stops, stops);
      }

      return stops;
    }), "stops");
  },

  stops() {
    return _.chain(this.state.stops)
      .reject((v, k) => k === "meta")
      .sortBy((stop) => latLon(this.state.location).distanceTo(
        latLon({coords: stop})
      ))
      .value();
  },

  switchTab(e) {
    this.setState({
      currentStop: [].indexOf.call(e.currentTarget.parentNode.childNodes, e.currentTarget)
    });
  },

  render() {
    return <main className="app">
      <nav className="toolbar">
        <h1 className="toolbar-title">BUSBOY</h1>
      <span>{this.stops().map((stop, i) => <Tab key={stop.stopId} stop={stop} onClick={this.switchTab} active={this.state.currentStop === i}/>)}
      {this.state.stops.meta.loading && <Icon id="notification_sync" className="pull-right"/>}</span>
      </nav>
      {this.stops().length ? <Stop stop={this.stops()[this.state.currentStop]} location={this.state.location}/> : ""}
    </main>;
  }
});

React.render(<Busboy/>, document.body);
require("./index.scss");
require("../node_modules/material-design-fonticons/styles/mdfi.css");
