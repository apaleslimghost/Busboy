const React = require('react');
const moment = require('moment');

function formatETA(t) {
	var min = t.diff(moment(), 'minutes');
	return min < 1 ? 'Due' : min + 'm';
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
