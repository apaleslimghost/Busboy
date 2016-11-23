const {h} = require('preact');
const c = require('classnames');

const Tab = ({active, stop, onClick}) => <a
	className={c('toolbar-tab', {'toolbar-tab-active': active})}
	href={`#${stop.stopId}`} onClick={e => onClick(e, stop)}>
	<span className='bus-emblem'>{stop.stopPointIndicator}</span>
</a>;

module.exports = Tab;
