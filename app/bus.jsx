const {h} = require('preact');
const _ = require('underscore');

const minuteDiff = (a, b) => Math.round((a.getTime() - b.getTime()) / 1000 / 60);
const hh = date => (date.getHours() % 12) || 12;
const mm = date => (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
const hmm = date => `${hh(date)}:${mm(date)}`


function formatETA(t) {
	const min = minuteDiff(t, new Date());

	if(min < 0) {
		return `Due ${hmm(t)}`;
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
				{formatETA(prediction.estimatedTime)}
			</li>
		)}
	</ul>
	<h3 className='bus-title'>{name}</h3>
	<span className='bus-destination'>{predictions[0].destinationName}</span>
</li>;

module.exports = Bus;
