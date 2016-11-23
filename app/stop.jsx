import {h} from 'preact';
import url from 'url';
import Bus from './bus.jsx';
import latLon from './latlon.js';

const getStreetViewUrl = ({latitude, longitude, bearing}, {width}) => url.format({
	protocol: 'https',
	hostname: 'maps.googleapis.com',
	pathname: 'maps/api/streetview',
	query: {
		size: [
			width,
			Math.round(width / 2)
		].join('x'),
		location: [
			latitude,
			longitude
		].join(),
		fov: 180,
		pitch: 0,
		heading: bearing - 90
	}
});

const KILOMETERS_PER_MILE = 1.609344;


const distanceToStart = ({stop, location}) =>
(latLon(location.coords).distanceTo(
	latLon(stop)
) / KILOMETERS_PER_MILE).toFixed(1);


const gradient = img => `linear-gradient(to bottom, rgba(220,36,31,0.1), rgba(220,36,31,0.1), rgba(220,36,31,0.3)), url(${img})`;

const get = obj => key => obj[key];
const values = obj => Object.keys(obj).map(get(obj));

const collatePredictions = predictions => values(predictions)
.sort((a, b) => a.estimatedTime - b.estimatedTime)
.reduce(
	(groups, prediction) =>
		Object.assign(groups, {
			[prediction.lineName]: (groups[prediction.lineName] || []).concat(
				prediction
			)
		}),
	{}
);

const renderPredictions = lines => Object.keys(lines)
	.map(line => <Bus name={line} key={line} predictions={lines[line]} />);

const Stop = ({stop, location}) => <div className='stop'>
<header className='stop-header' style={{backgroundImage: gradient(getStreetViewUrl(stop, {width: window.innerWidth}))}}>
	<div className='stop-header-contents'>
		<h3 className='stop-distance'>{distanceToStart({stop, location})}mi</h3>
		<h1 className='stop-title'><span className='bus-emblem'>{stop.stopPointIndicator}</span> {stop.stopPointName}</h1>
		<h2 className='stop-destination'>Towards {stop.towards}</h2>
	</div>
</header>
{stop.predictions ? <ul className='bus-list'>
	{renderPredictions(collatePredictions(stop.predictions))}
</ul> : <div className='bus-list-item stop-empty'>Nothing for the next 30 minutes</div>}
</div>;

module.exports = Stop;
