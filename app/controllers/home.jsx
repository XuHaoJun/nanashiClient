var React = require('react');

var AccountModel = require('../models/account');

var HomeController = module.exports = function() {
  var Home = require('../views/home');
  var Router = require('../router');
  if (AccountModel.isEmpty()) {
    AccountModel.fetch().then(function() {
      Router.setRoute('/stage');
    }).catch(function() {
      Router.render(<Home />);
    });
  }
};
