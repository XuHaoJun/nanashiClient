var React = require('react');

var AccountModel = require('../models/account');

module.exports = {
  homeRoute: function() {
    var StagePage = require('../views/stage/stagePage');
    if (AccountModel.isEmpty()) {
      AccountModel.loginBySession(function(err) {
        if (AccountModel.isEmpty()) {
          var Router = require('../router');
          Router.setRoute('/login');
        } else {
          React.render(<StagePage />, document.body);
        }
      });
    } else {
      React.render(<StagePage />, document.body);
    }
  }
};
