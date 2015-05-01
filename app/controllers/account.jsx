var is = require('is_js');
var React = require('react');

var AccountModel = require('../models/account');

module.exports = {
  loginRoute: function() {
    if (AccountModel.isEmpty()) {
      var LoginPage = require('../views/account/loginPage');
      React.render(<LoginPage />, document.body);
    } else {
      var Router = require('../router');
      Router.setRoute('/');
    }
  },

  registerRoute: function() {
    if (AccountModel.isEmpty()) {
      var RegisterPage = require('../views/account/registerPage');
      React.render(<RegisterPage />, document.body);
    } else {
      var Router = require('../router');
      Router.setRoute('/stage');
    }
  },

  cardPartyRoute: function() {
    if (AccountModel.isEmpty()) {
      var Router = require('../router');
      Router.setRoute('/login');
    } else {
      var CardPartyPage = require('../views/account/cardPartyPage');
      React.render(<CardPartyPage />, document.body);
    }
  },

  logout: function() {
    if (AccountModel.isEmpty()) {
      return;
    }
    AccountModel.logout(function(err) {
      var Router = require('../router');
      Router.setRoute('/login');
    });
  },

  login: function(username, password) {
    AccountModel.login(username, password, function(err) {
      if (err !== null) {
        return;
      }
      var Router = require('../router');
      Router.setRoute('/stage');
    });
  },

  register: function(postForm) {
    AccountModel.register(postForm, function(err) {
      if (err !== null) {
        return;
      }
      var Router = require('../router');
      Router.setRoute('/stage');
    });
  }
};
