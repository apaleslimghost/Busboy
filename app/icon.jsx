var React = require("react");

var Icon = React.createClass({
  render() {
    return <i className={"mdfi_" + this.props.id + " " + this.props.className}/>;
  }
});

module.exports = Icon;