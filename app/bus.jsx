import {h} from 'preact';
import hmm from './hmm';

const minuteDiff = (a, b) => Math.round((a.getTime() - b.getTime()) / 1000 / 60);

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
