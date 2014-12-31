var React = require('react');
var {BaconMixin} = require('react-bacon');
var busboy = require('tfl-busboy');
var _ = require('underscore');

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
  render() {
    return <div className="stop">
      <header className="stop-header">
      <h1 className="stop-title"><span className="bus-emblem">{this.props.stop.stopPointIndicator}</span> {this.props.stop.stopPointName}</h1>
      <h2 className="stop-destination">Towards {this.props.stop.towards}</h2>
      </header>
    </div>;
  }
});

var Busboy = React.createClass({
  mixins: [BaconMixin],

  getInitialState() {
    return {
      stops: {meta: {loading: true}}
    };
  },

  componentWillMount() {
    this.plug(busboy.around({
      lat: 51.371422, lng: -0.227344
    }, 100), 'stops');
  },

  stops() {
    return _.reject(this.state.stops, (v, k) => k === 'meta');
  },

  switchTab(e, stop) {
    this.setState({
      currentStop: stop.stopId
    });
  },

  render() {
    return <main className="app">
      <nav className="toolbar">
        <h1 className="toolbar-title">BUSBOY</h1>
      {this.stops().map((stop) => <Tab key={stop.stopId} stop={stop} onClick={this.switchTab} active={this.state.currentStop === stop.stopId}/>)}
      {this.state.stops.meta.loading && <Icon id="notification_sync" className="pull-right"/>}
      </nav>
      {this.state.currentStop && <Stop stop={this.state.stops[this.state.currentStop]}/>}
    </main>;
  }
});

React.render(<Busboy/>, document.body);
require('./index.scss');
require('../node_modules/material-design-fonticons/styles/mdfi.css');
