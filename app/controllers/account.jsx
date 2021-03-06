var React = require('react');

var AccountModel = require('../models/account');

module.exports = {
  loginRoute: function() {
    var Router = require('../router');
    if (AccountModel.isEmpty()) {
      var LoginPage = require('../views/account/loginPage');
      Router.render(<LoginPage />);
    } else {
      Router.setRoute('/stage');
    }
  },

  registerRoute: function() {
    var Router = require('../router');
    if (AccountModel.isEmpty()) {
      var RegisterPage = require('../views/account/registerPage');
      Router.render(<RegisterPage />);
    } else {
      Router.setRoute('/stage');
    }
  },

  cardPartyRoute: function() {
    var Router = require('../router');
    var CardPartyPage = require('../views/account/cardPartyPage');
    if (AccountModel.isEmpty()) {
      AccountModel.fetch().then(function() {
        if (AccountModel.isEmpty()) {
          Router.setRoute('/login');
        } else {
          Router.render(<CardPartyPage />);
        }
      });
    } else {
      Router.render(<CardPartyPage />);
    }
  },

  drawCardRoute: function() {
    var Router = require('../router');
    var DrawCardPage = require('../views/account/drawCardPage');
    if (AccountModel.isEmpty()) {
      AccountModel.fetch().then(function() {
        if (AccountModel.isEmpty()) {
          Router.setRoute('/login');
        } else {
          Router.render(<DrawCardPage />);
        }
      });
    } else {
      Router.render(<DrawCardPage />);
    }
  },

  cardPartyJoin: function(cardId, slotIndex) {
    var Router = require('../router');
    AccountModel.cardPartyJoin(cardId, slotIndex);
  },

  cardPartyLeave: function(cardPartyId) {
    AccountModel.cardPartyLeave(cardPartyId);
  },

  drawCard: function() {
    if (AccountModel.isEmpty()) {
      return;
    }
    AccountModel.drawCard();
  },

  decomposeCard: function(cardId) {
    if (AccountModel.isEmpty()) {
      return;
    }
    AccountModel.decomposeCard(cardId);
  },

  cardEffortUpdate: function(cardId, updates) {
    if (AccountModel.isEmpty()) {
      return;
    }
    AccountModel.cardEffortUpdate(cardId, updates);
  },

  cardLevelUp: function(cardId) {
    if (AccountModel.isEmpty()) {
      return;
    }
    AccountModel.cardLevelUp(cardId);
  },

  logout: function() {
    var Router = require('../router');
    if (AccountModel.isEmpty()) {
      return;
    }
    AccountModel.logout().then(function() {
      Router.setRoute('/login');
    });
  },

  login: function(username, password) {
    var Router = require('../router');
    AccountModel.login(username, password).then(function() {
      Router.setRoute('/stage');
    });
  },

  register: function(postForm) {
    var Router = require('../router');
    AccountModel.register(postForm).then(function() {
      Router.setRoute('/stage');
    });
  }
};
