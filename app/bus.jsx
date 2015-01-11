var React  = require("react");
var moment = require("moment");

function formatETA(t) {
  var min = t.diff(moment(), "minutes");
  return min < 1 ? "Due" : min + "m";
}

var Bus = React.createClass({
  render() {
    return <li className="bus-list-item">
      <ul className="bus-predictions">
      {this.props.predictions.map((prediction) => <li className="bus-prediction" key={prediction.tripId}>{formatETA(moment(prediction.estimatedTime))}</li>)}
      </ul>
      <h3 className="bus-title">{this.props.name}</h3>
      <span className="bus-destination">{this.props.predictions[0].destinationName}</span>
    </li>;
  }
});

module.exports = Bus;