var React  = require("react");
var _      = require("underscore");
var Bacon  = require("baconjs");
var busboy = require("tfl-busboy");
var latLon = require("./latlon.js");
var Tab    = require("./tab.jsx");
var Icon   = require("./icon.jsx");
var Stop   = require("./stop.jsx");

var {BaconMixin} = require("react-bacon");

function watchLocation() {
  return Bacon.fromEventTarget(
    document,
    "deviceready"
  ).take(1).concat(
    Bacon.fromBinder(function(sink) {
      var i = navigator.geolocation.watchPosition(
        sink,
        (e) => sink(new Bacon.Error(e))
      );
      return () => navigator.geolocation.clearWatch(i);
    })
  ).toProperty({});
}

function pollRepeatProperty(prop, interval) {
  return Bacon.once().concat(
    Bacon.interval(interval)
  ).map(prop).merge(prop.changes());
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
    var location = watchLocation();
    var repeatLocation = pollRepeatProperty(location, 15000);
    var stops = repeatLocation.flatMap(function({coords}) {
      return coords ? busboy.around({
        lat: coords.latitude, lng: coords.longitude
      }, Math.min(Math.max(coords.accuracy, 300), 1000)) : Bacon.never();
    }).map((stops) => {
      if(stops.meta.loading) {
        return _.extend(this.state.stops, stops);
      }
      return stops;
    });

    stops.onError((e) => console.log(e));

    this.plug(location, "location");
    this.plug(stops, "stops");
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
      <div className="toolbar-tabs">{this.stops().map((stop, i) => <Tab key={stop.stopId} stop={stop} onClick={this.switchTab} active={this.state.currentStop === i}/>)}
      {this.state.stops.meta.loading && <Icon id="notification_sync" className="pull-right"/>}</div>
      </nav>
      {this.stops().length ? <Stop stop={this.stops()[this.state.currentStop]} location={this.state.location}/> : ""}
    </main>;
  }
});

React.render(<Busboy/>, document.body);
require("./index.scss");
require("../node_modules/material-design-fonticons/styles/mdfi.css");
