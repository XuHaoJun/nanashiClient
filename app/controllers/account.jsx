var React = require('react');

var AccountModel = require('../models/account');

module.exports = {
  loginRoute: function() {
    if (AccountModel.isEmpty()) {
      var LoginPage = require('../views/account/loginPage');
      this.render(<LoginPage />);
    } else {
      this.setRoute('/stage');
    }
  },

  registerRoute: function() {
    if (AccountModel.isEmpty()) {
      var RegisterPage = require('../views/account/registerPage');
      this.render(<RegisterPage />);
    } else {
      this.setRoute('/stage');
    }
  },

  cardPartyRoute: function() {
    var CardPartyPage = require('../views/account/cardPartyPage');
    if (AccountModel.isEmpty()) {
      AccountModel.fetch(function(err) {
        if (AccountModel.isEmpty()) {
          this.setRoute('/login');
        } else {
          this.render(<CardPartyPage />);
        }
      }.bind(this));
    } else {
      this.render(<CardPartyPage />);
    }
  },

  drawCardRoute: function() {
    var DrawCardPage = require('../views/account/drawCardPage');
    if (AccountModel.isEmpty()) {
      AccountModel.fetch(function(err) {
        if (AccountModel.isEmpty()) {
          this.setRoute('/login');
        } else {
          this.render(<DrawCardPage />);
        }
      }.bind(this));
    } else {
      this.render(<DrawCardPage />);
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
    AccountModel.drawCard(function(err) {
    });
  },

  decomposeCard: function(cardId) {
    if (AccountModel.isEmpty()) {
      return;
    }
    AccountModel.decomposeCard(cardId, function(err) {
    });
  },

  cardEffortUpdate: function(cardId, updates) {
    if (AccountModel.isEmpty()) {
      return;
    }
    AccountModel.cardEffortUpdate(cardId, updates, function(err) {
    });
  },

  cardLevelUp: function(cardId) {
    if (AccountModel.isEmpty()) {
      return;
    }
    AccountModel.cardLevelUp(cardId, function(err) {
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
