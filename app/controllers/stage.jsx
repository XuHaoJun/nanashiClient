var React = require('react');

var AccountModel = require('../models/account');
var BattleModel = require('../models/battle');

module.exports = {
  homeRoute: function() {
    var StagePage = require('../views/stage/stagePage');
    var Router = require('../router');
    if (AccountModel.isEmpty()) {
      AccountModel.fetch().then(function() {
        return BattleModel.noCompletes();
      }).then(function() {
        Router.render(<StagePage />)
      }).catch(function() {
        Router.setRoute('/login');
      });
    } else {
      BattleModel.noCompletes().then(function() {
        Router.render(<StagePage />)
      });
    }
  }
};
