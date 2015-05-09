var React = require('react');

var AccountModel = require('../models/account');

var HomeController = module.exports = function() {
  var Home = require('../views/home');
  if (AccountModel.isEmpty()) {
    AccountModel.fetch(function(err) {
      if (AccountModel.isEmpty()) {
        React.render(<Home />, document.body);
      } else {
        var Router = require('../router');
        Router.setRoute('/stage');
      }
    });
  }
};
