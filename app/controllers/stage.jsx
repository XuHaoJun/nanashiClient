var React = require('react');

var AccountModel = require('../models/account');

module.exports = {
  homeRoute: function() {
    if (AccountModel.isEmpty()) {
      AccountModel.loginBySession();
    }
    var StagePage = require('../views/stage/stagePage');
    React.render(<StagePage />, document.body);
  }
};
