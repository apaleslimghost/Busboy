var React = require('react');
var {BaconMixin} = require('react-bacon');
var busboy = require('tfl-busboy');
var _ = require('underscore');

var Icon = React.createClass({
  render() {
    return <i className={'mdfi_' + this.props.id}/>
  }
});

var Busboy = React.createClass({
  mixins: [BaconMixin],

  getInitialState() {
    return {
      meta: {}
    };
  },

  componentWillMount() {
    this.plug(busboy.around({
      lat: 51.371422, lng: -0.227344
    }, 100));
  },

  stops() {
    return _.reject(this.state, (v, k) => k === 'meta');
  },

  switchTab() {},

  render() {
    return <main className="app">
      {this.state.meta.loading && <Icon id="notification_sync"/>}
      <nav className="toolbar">
        <h1 className="toolbar-title">BUSBOY</h1>
      {this.stops().map((stop) => {
        return <a className="toolbar-tab" key={stop.stopId} href={'#' + stop.stopId} onClick={this.switchTab}>
          {stop.stopPointIndicator}
        </a>;
      })}
      </nav>
    </main>;
  }
});

React.render(<Busboy/>, document.body);
require('./index.scss');
require('../node_modules/material-design-fonticons/styles/mdfi.css');
