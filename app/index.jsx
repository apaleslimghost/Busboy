const React = require('react');
const ReactDom = require('react-dom');
const _ = require('underscore');
const Bacon = require('baconjs');
const busboy = require('tfl-busboy');

const latLon = require('./latlon.js');
const Tab = require('./tab.jsx');
const Icon = require('./icon.jsx');
const Stop = require('./stop.jsx');


const watchLocation = () => Bacon.fromEventTarget(
	document,
	'deviceready'
).take(1).concat(
	Bacon.fromBinder(function(sink) {
		const i = navigator.geolocation.watchPosition(
			sink,
			(e) => sink(new Bacon.Error(e))
		);
		return () => navigator.geolocation.clearWatch(i);
	})
).toProperty({});

const pollRepeatProperty = (prop, interval) =>
	Bacon.once().concat(
		Bacon.interval(interval)
	).map(prop).merge(prop.changes());

class Busboy extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			stops: {meta: {loading: true}},
			currentStop: 0
		};

		this.switchTab = this.switchTab.bind(this);
	}

	componentWillMount() {
		const location = watchLocation();
		const repeatLocation = pollRepeatProperty(location, 15000);
		const stops = repeatLocation.flatMap(function({coords}) {
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

		this.plug(location, 'location');
		this.plug(stops, 'stops');
	}

	plug(observable, prop) {
		observable.onValue(v => {
			this.setState({
				[prop]: v
			});
		});
	}

	stops() {
		return _.chain(this.state.stops)
		.reject((v, k) => k === 'meta')
		.sortBy((stop) => latLon(this.state.location.coords).distanceTo(
			latLon(stop)
		))
		.value();
	}

	switchTab(e) {
		this.setState({
			currentStop: [].indexOf.call(e.currentTarget.parentNode.childNodes, e.currentTarget)
		});
	}

	render() {
		return <main className='app'>
			<nav className='toolbar'>
				<h1 className='toolbar-title'>Busboy</h1>
				<div className='toolbar-tabs'>
					<div className='toolbar-tabs-scroll'>
						{this.stops().map((stop, i) => <Tab key={stop.stopId} stop={stop} onClick={this.switchTab} active={this.state.currentStop === i}/>)}
					</div>
				</div>
				{this.state.stops.meta.loading && <Icon id='notification_sync' className='pull-right'/>}
			</nav>
			{this.stops().length &&
				<Stop stop={this.stops()[this.state.currentStop]} location={this.state.location}/>
			}
		</main>;
	}
}

ReactDom.render(<Busboy/>, document.body);
require('./index.scss');
require('../node_modules/material-design-fonticons/styles/mdfi.css');
