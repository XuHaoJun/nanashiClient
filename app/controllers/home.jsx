var React = require('react');

var AccountModel = require('../models/account');

var HomeController = module.exports = function() {
  var Home = require('../views/home');
  if (AccountModel.isEmpty()) {
    AccountModel.fetch(function(err) {
      var Router = require('../router');
      if (AccountModel.isEmpty()) {
        Router.render(<Home />);
      } else {
        Router.setRoute('/stage');
      }
    });
  }
};
