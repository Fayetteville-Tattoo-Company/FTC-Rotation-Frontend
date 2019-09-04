const log = message => process.env.NODE_ENV === 'development' ? console.log(message) : null;
const display = message => process.env.NODE_ENV === 'production' ? console.log(message) : null;

module.exports = {
  log,
  display
}