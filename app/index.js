var React = require('react');
var {BaconMixin} = require('react-bacon');
var busboy = require('tfl-busboy');
var _ = require('underscore');
var url = require('url');
var LatLon = require('mt-latlon');

var startPos = new LatLon(51.371422, -0.227344);

var Icon = React.createClass({
  render() {
    return <i className={'mdfi_' + this.props.id + ' ' + this.props.className}/>
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

var Stop = React.createClass({
  distanceToStart() {
    return Math.round(10 * startPos.distanceTo(
      new LatLon(
        this.props.stop.latitude,
        this.props.stop.longitude
      )
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
    this.plug(busboy.around({
      lat: startPos.lat(), lng: startPos.lon()
    }, 100), 'stops');
  },

  stops() {
    return _.chain(this.state.stops).reject((v, k) => k === 'meta').value();
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
      <span>{this.stops().map((stop) => <Tab key={stop.stopId} stop={stop} onClick={this.switchTab} active={this.state.currentStop === stop.stopId}/>)}
      {this.state.stops.meta.loading && <Icon id="notification_sync" className="pull-right"/>}</span>
      </nav>
      {!this.state.stops.meta.loading && this.stops().length && <Stop stop={this.stops()[this.state.currentStop]}/>}
    </main>;
  }
});

React.render(<Busboy/>, document.body);
require('./index.scss');
require('../node_modules/material-design-fonticons/styles/mdfi.css');
