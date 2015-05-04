var React = require('react');
var BattlePage = require('../views/battle/battlePage');

var BattleController = module.exports = {
  homeRoute: function() {
    React.render(<BattlePage />, document.body);
  }
};
