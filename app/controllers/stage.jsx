var React = require('react');

var AccountModel = require('../models/account');

module.exports = {
  homeRoute: function() {
    var StagePage = require('../views/stage/stagePage');
    var Router = require('../router');
    if (AccountModel.isEmpty()) {
      AccountModel.fetch(function(err) {
        if (AccountModel.isEmpty()) {
          Router.setRoute('/login');
        } else {
          Router.render(<StagePage />);
        }
      });
    } else {
      Router.render(<StagePage />);
    }
  }
};
