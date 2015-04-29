var React = require('react');
var Home = require('../views/home');

var AccountModel = require('../models/account');

var HomeController = module.exports = function() {
  if (AccountModel.isEmpty()) {
    AccountModel.loginBySession();
  }
  React.render(<Home />, document.body);
};
