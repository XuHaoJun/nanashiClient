var React = require('react');
var Views = require('../views');
var LoginPage = Views.Account.LoginPage;
var RegisterPage = Views.Account.RegisterPage;

var AccountController = module.exports = {
  login: function() {
    React.render(<LoginPage />, document.body);
  },

  register: function() {
    React.render(<RegisterPage />, document.body);
  }
};
