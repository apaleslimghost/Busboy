const hh = date => (date.getHours() % 12) || 12;
const mm = date => (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
module.exports = date => `${hh(date)}:${mm(date)}`
