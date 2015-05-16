var React = require('react');

var BattlePage = require('../views/battle/battlePage');

var BattleModel = require('../models/battle');
var SocketModel = require('../models/socket');

var BattleController = module.exports = {
  homeRoute: function(targetType, id) {
    console.log(targetType, id);
    if (SocketModel.isDisconected) {
      SocketModel.connect();
    }
    if (targetType === 'NPC') {
      /* SockModel.on('connection', */
      BattleModel.requestNPC(id);
    }
    var renderBattlePage = function() {
      React.render(<BattlePage />, document.body);
      BattleModel.removeInitializeListener(renderBattlePage);
    };
    BattleModel.addInitializeListener(renderBattlePage);
  }
};
