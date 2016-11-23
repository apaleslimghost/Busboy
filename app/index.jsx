import {h, Component, render} from 'preact';
import Bacon from 'baconjs';
import busboy from 'tfl-busboy';
import c from 'classnames';

import latLon from './latlon.js';
import Tab from './tab.jsx';
import Stop from './stop.jsx';

Object.assign(busboy.defaultOptions, {
	protocol: location.protocol,
	hostname: location.hostname,
	port: location.port,
	path: '/_api/interfaces/ura/instant_V1'
});

const watchLocation = () =>
	Bacon.fromBinder(function(sink) {
		navigator.geolocation.getCurrentPosition(
			location => sink(Object.assign(location, {located: true})),
			error => sink(new Bacon.Error(error))
		);
	})
	.concat(
		Bacon.fromBinder(function(sink) {
			const i = navigator.geolocation.watchPosition(
				location => sink(Object.assign(location, {located: true})),
				error => sink(new Bacon.Error(error))
			);
			return () => navigator.geolocation.clearWatch(i);
		})
	).toProperty({located: false});

const pollRepeatProperty = (prop, interval) =>
	Bacon.once().concat(
		Bacon.interval(interval)
	).map(prop).merge(prop.changes());

class Busboy extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stops: {meta: {loading: true}},
			currentStop: 0,
			location: {located: false}
		};

		this.switchTab = this.switchTab.bind(this);
	}

	componentWillMount() {
		const location = watchLocation();
		const stops = pollRepeatProperty(location, 15000)
		.skipErrors()
		.flatMap(function({coords, located}) {
			return coords ? busboy.around({
				lat: coords.latitude, lng: coords.longitude
			}, Math.min(Math.max(coords.accuracy, 300), 1000)) : Bacon.never();
		}).map((stops) => {
			if(stops.meta.loading) {
				return Object.assign(this.state.stops, stops);
			}
			return stops;
		});

		stops.onError(e => console.log(e));
		location.onError(e => {
			this.state.location.located = false;
			this.setState(this.state);
		});

		this.plug(location, 'location');
		this.plug(stops, 'stops');
	}

	plug(observable, prop) {
		observable.onValue(v => {
			this.state[prop] = v;
			if(this.state.error && this.state.error.from === prop) {
				this.state.error = false;
			}
			this.setState(this.state);
		});

		observable.onError(error => {
			error.from = prop;
			this.setState({error});
		});
	}

	stops() {
		return Object.keys(this.state.stops)
		.filter(key => key !== 'meta')
		.map(key => {
			const stop = this.state.stops[key];
			const distance = latLon(this.state.location.coords)
				.distanceTo(latLon(stop));
			return Object.assign({distance}, stop);
		})
		.sort((a, b) => a.distance - b.distance);
	}

	switchTab(e) {
		this.setState({
			currentStop: [].indexOf.call(e.currentTarget.parentNode.childNodes, e.currentTarget)
		});
	}

	render() {
		return <div className={c('app', {'location-found': this.state.location.located})}>
			<nav className='toolbar'>
				<h1 className='toolbar-title'>Busboy</h1>
				<div className='toolbar-tabs'>
					<div className='toolbar-tabs-scroll'>
						{this.stops().map((stop, i) => <Tab key={stop.stopId} stop={stop} onClick={this.switchTab} active={this.state.currentStop === i}/>)}
					</div>
				</div>
			</nav>
			{this.state.error &&
				<div className='error-banner'>{this.state.error.message}</div>
			}
			{!!this.stops().length &&
				<Stop stop={this.stops()[this.state.currentStop]} location={this.state.location}/>
			}
		</div>;
	}
}

render(<Busboy/>, document.querySelector('main'));
