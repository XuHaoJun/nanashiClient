var React = require('react');

var BaseCardsModel = require('../models/baseCards');

module.exports = {
  showRoute: function(msg) {
    var Router = require('../router');
    var BaseCardsPage = require('../views/baseCards/baseCardsPage');
    BaseCardsModel.fetch();
    Router.render(<BaseCardsPage />);
  }
};
