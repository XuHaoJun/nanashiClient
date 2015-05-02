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
    var CardPartyPage = require('../views/account/cardPartyPage');
    if (AccountModel.isEmpty()) {
      AccountModel.loginBySession(function(err) {
        if (AccountModel.isEmpty()) {
          var Router = require('../router');
          Router.setRoute('/login');
        } else {
          React.render(<CardPartyPage />, document.body);
        }
      });
    } else {
      React.render(<CardPartyPage />, document.body);
    }
  },

  drawCardRoute: function() {
    var DrawCardPage = require('../views/account/drawCardPage');
    if (AccountModel.isEmpty()) {
      AccountModel.loginBySession(function(err) {
        if (AccountModel.isEmpty()) {
          var Router = require('../router');
          Router.setRoute('/login');
        } else {
          React.render(<DrawCardPage />, document.body);
        }
      });
    } else {
      React.render(<DrawCardPage />, document.body);
    }
  },

  cardPartyJoin: function(cardId, slotIndex) {
    AccountModel.cardPartyJoin(cardId, slotIndex);
  },

  cardPartyLeave: function(cardPartyId) {
    AccountModel.cardPartyLeave(cardPartyId);
  },

  drawCard: function() {
    if (AccountModel.isEmpty()) {
      return;
    }
    AccountModel.drawCard(function(err, card) {
    });
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
