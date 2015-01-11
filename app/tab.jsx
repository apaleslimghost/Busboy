var React = require("react");

var Tab = React.createClass({
  switchTab(e) {
    this.props.onClick(e, this.props.stop);
  },

  render() {
    return <a className={"toolbar-tab " + (this.props.active ? "toolbar-tab-active" : "")} href={"#" + this.props.stop.stopId} onClick={this.switchTab}>
      <span className="bus-emblem">{this.props.stop.stopPointIndicator}</span>
    </a>;
  }
});

module.exports = Tab;