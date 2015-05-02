var React = require('react');

var AccountModel = require('../models/account');

module.exports = {
  homeRoute: function() {
    if (AccountModel.isEmpty()) {
      AccountModel.loginBySession(function(err) {
        if (err != null) {
          var Router = require('../router');
          Router.setRoute('/login');
        } else {
          var DeckPage = require('../views/deck/deckPage');
          React.render(<DeckPage />, document.body);
        }
      });
    } else {
      var DeckPage = require('../views/deck/deckPage');
      React.render(<DeckPage />, document.body);
    }
  }
};
