var React = require('react');
var {BaconMixin} = require('react-bacon');
var busboy = require('tfl-busboy');
var _ = require('underscore');

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

  render() {
    return <div>
      <h1>Busboy</h1>
      {this.state.meta.loading && 'loading'}
      <ul>{_.map(this.stops(), (stop) => <li>{stop.stopId}</li>)}</ul>
    </div>;
  }
});

React.render(<Busboy/>, document.body);
require('./index.scss');
