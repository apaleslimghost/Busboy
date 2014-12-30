var React = require('react');
var {BaconMixin} = require('react-bacon');
var busboy = require('tfl-busboy');
var _ = require('underscore');

var Busboy = React.createClass({
  mixins: [BaconMixin],

  getInitialState() {
    return {
      stops: {}
    };
  },

  componentWillMount() {
    this.plug(busboy.around({
      lat: 51.371422, lng: -0.227344
    }, 100), 'stops');
  },

  render() {
    return <div>
      <h1>Busboy</h1>
      <ul>{_.map(this.state.stops, (stop) => <li>{stop.stopId}</li>)}</ul>
    </div>;
  }
});

React.render(<Busboy/>, document.body);
require('./index.scss');
