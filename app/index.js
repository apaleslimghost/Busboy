var React = require('react');
var mui   = require('material-ui');

var Busboy = React.createClass({
  render() {
    return <mui.Toolbar/>;
  }
});

React.render(<Busboy/>, document.body);
require('./index.less');
