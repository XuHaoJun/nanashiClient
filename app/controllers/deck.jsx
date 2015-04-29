var React = require('react');

var AccountModel = require('../models/account');

module.exports = {
  homeRoute: function() {
    if (AccountModel.isEmpty()) {
      AccountModel.loginBySession();
    }
    var DeckPage = require('../views/deck/deckPage');
    React.render(<DeckPage />, document.body);
  }
};
