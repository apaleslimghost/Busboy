const React = require('react');
const moment = require('moment');
const _ = require('underscore');

function formatETA(t) {
	const min = t.diff(moment(), 'minutes');

	if(min < 0) {
		return `Due ${t.format('h:mm')}`;
	}

	if(min < 1) {
		return 'Due';
	}

	return `${min}m`;
}

const Bus = ({name, predictions}) => <li className='bus-list-item'>
	<ul className='bus-predictions'>
		{predictions.map((prediction) =>
			<li className='bus-prediction' key={prediction.tripId}>
				{formatETA(moment(prediction.estimatedTime))}
			</li>
		)}
	</ul>
	<h3 className='bus-title'>{name}</h3>
	<span className='bus-destination'>{predictions[0].destinationName}</span>
</li>;

module.exports = Bus;
