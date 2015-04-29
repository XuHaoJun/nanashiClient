var React = require('react');
var Battle = require('../views/battle/battle');

var BattleController = module.exports = {
  homeRoute: function() {
    React.render(<Battle />, document.body);
  }
};
