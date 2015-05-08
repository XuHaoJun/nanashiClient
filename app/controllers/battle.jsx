var React = require('react');

var BattlePage = require('../views/battle/battlePage');

var BattleModel = require('../models/battle');

var BattleController = module.exports = {
  homeRoute: function(targetType, id) {
    console.log(targetType, id);
    React.render(<BattlePage />, document.body);
  }
};
