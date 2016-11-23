const {h} = require('preact');
const c = require('classnames');

const Icon = ({id, className}) => <i className={c(`mdfi_${id}`, className)}/>;

module.exports = Icon;
