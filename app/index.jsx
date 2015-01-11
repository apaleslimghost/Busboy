/* jshint esnext:true, undef:true, unused:true, node:true, browser:true */
var React = require('react');
var {BaconMixin} = require('react-bacon');
var busboy = require('tfl-busboy');
var _ = require('underscore');
var url = require('url');
var LatLon = require('mt-latlon');
var Bacon = require('baconjs');
var moment = require('moment');

function geoToLatlon({coords}) {
  return new LatLon(coords.latitude, coords.longitude);
}

function pollLocation() {
  return Bacon.fromCallback(navigator.geolocation, 'getCurrentPosition')
    .concat(Bacon.interval(15000).flatMap(function() {
      return Bacon.fromCallback(navigator.geolocation, 'getCurrentPosition');
    }));
}

function formatETA(t) {
  var min = t.diff(moment(), 'minutes');
  return min < 1 ? 'Due' : min + 'm';
}

var Icon = React.createClass({
  render() {
    return <i className={'mdfi_' + this.props.id + ' ' + this.props.className}/>;
  }
});

var Tab = React.createClass({
  switchTab(e) {
    this.props.onClick(e, this.props.stop);
  },

  render() {
    return <a className={'toolbar-tab ' + (this.props.active ? 'toolbar-tab-active' : '')} href={'#' + this.props.stop.stopId} onClick={this.switchTab}>
      <span className="bus-emblem">{this.props.stop.stopPointIndicator}</span>
    </a>;
  }
});

var Bus = React.createClass({
  render() {
    return <li className="bus-list-item">
      <ul className="bus-predictions">
      {this.props.predictions.map((prediction) => <li className="bus-prediction" key={prediction.tripId}>{formatETA(moment(prediction.estimatedTime))}</li>)}
      </ul>
      <h3 className="bus-title">{this.props.name}</h3>
      <span className="bus-destination">{this.props.predictions[0].destinationName}</span>
    </li>;
  }
});

var Stop = React.createClass({
  distanceToStart() {
    return Math.round(10 * geoToLatlon(this.props.location).distanceTo(
      geoToLatlon({coords: this.props.stop})
    ) / 1.609344) / 10;
  },

  streetView() {
    var opts = {
      protocol: 'https',
      hostname: 'maps.googleapis.com',
      pathname: 'maps/api/streetview',
      query: {
        size: [
          window.innerWidth,
          Math.round(window.innerWidth / 2)
        ].join('x'),
        location: [
          this.props.stop.latitude,
          this.props.stop.longitude
        ].join(),
        fov: 180,
        pitch: 0,
        heading: this.props.stop.bearing - 90
      }
    };
    return 'linear-gradient(to bottom, rgba(220,36,31,0.1), rgba(220,36,31,0.1), rgba(220,36,31,0.3)), url("' + url.format(opts) + '")';
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
       .groupBy('lineName')
       .pairs()
       .sortBy((p) => new Date(p[1][0].estimatedTime))
       .map((p) => <Bus name={p[0]} key={p[0]} predictions={p[1]} /> )
       .value()}
      </ul>
    </div>;
  }
});

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

    this.plug(location, 'location');
    this.plug(location.flatMap(function({coords}) {
      return busboy.around({
        lat: coords.latitude, lng: coords.longitude
      }, Math.min(Math.max(coords.accuracy, 200), 1000));
    }).map((stops) => {
      if(stops.meta.loading) {
        return _.extend(this.state.stops, stops);
      }

      return stops;
    }), 'stops');
  },

  stops() {
    return _.chain(this.state.stops)
      .reject((v, k) => k === 'meta')
      .sortBy((stop) => geoToLatlon(this.state.location).distanceTo(
        geoToLatlon({coords: stop})
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
      {this.stops().length ? <Stop stop={this.stops()[this.state.currentStop]} location={this.state.location}/> : ''}
    </main>;
  }
});

React.render(<Busboy/>, document.body);
require('./index.scss');
require('../node_modules/material-design-fonticons/styles/mdfi.css');
