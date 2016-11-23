import {h} from 'preact';
import c from 'classnames';

const priorities = {
	5: 'planned-bus',
	4: 'major-other',
	3: 'major-bus',
	2: 'high-severity',
	1: 'emergency'
};

const priorityLabels = {
	2: '⚠︎',
	1: '⃠'
};

const formatMessage = message => message
	.replace(/(@(\w+))/g, '<a href="http://twitter.com/$2" target="_blank">$1</a>')
	.replace(/(tfl\.gov\.uk\/\S+)/g, '<a href="http://$1" target="_blank">$1</a>');

module.exports = ({messagePriority, messageText}) => <li className={c('message-list-item', `message-${priorities[messagePriority]}`)}>
	<span class='message-priority-label'>
		{priorityLabels[messagePriority] || 'ℹ︎'}
	</span>
	<span
		class='message-text'
		dangerouslySetInnerHTML={{__html: formatMessage(messageText)}} />
</li>;
