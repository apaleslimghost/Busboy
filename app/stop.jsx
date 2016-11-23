const React = require('react');
const _ = require('underscore');
const url = require('url');
const Bus = require('./bus.jsx');
const latLon = require('./latlon.js');

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

const Stop = ({stop, location}) => <div className='stop'>
<header className='stop-header' style={{backgroundImage: gradient(getStreetViewUrl(stop, {width: window.innerWidth}))}}>
	<div className='stop-header-contents'>
		<h3 className='stop-distance'>{distanceToStart({stop, location})}mi</h3>
		<h1 className='stop-title'><span className='bus-emblem'>{stop.stopPointIndicator}</span> {stop.stopPointName}</h1>
		<h2 className='stop-destination'>Towards {stop.towards}</h2>
	</div>
</header>
<ul className='bus-list'>
	{_.chain(stop.predictions)
		.groupBy('lineName')
		.pairs()
		.sortBy((p) => new Date(p[1][0].estimatedTime))
		.map((p) => <Bus name={p[0]} key={p[0]} predictions={p[1]} /> )
		.value()}
	</ul>
</div>;

module.exports = Stop;
