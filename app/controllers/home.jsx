var React = require('react');
var Views = require('../views');
var Home = Views.Home;

var HomeController = module.exports = function() {
  console.log('home controller', this);

  React.render(<Home />, document.body);
};
