var React = require('react');
var Views = require('../views');
var Battle = Views.Battle.Battle;

var BattleController = module.exports = {
  home: function() {
    React.render(<Battle />, document.body);
  }
};
