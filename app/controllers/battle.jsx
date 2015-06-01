var React = require('react');

var BattlePage = require('../views/battle/battlePage');

var BattleModel = require('../models/battle');
var SocketModel = require('../models/socket');

var BattleController = module.exports = {
  homeRoute: function(ctx, next) {
    var targetType = ctx.params.targetType;
    var id = ctx.params.id;
    var Router = require('../router');
    if (SocketModel.isDisconected) {
      SocketModel.connect();
    }
    if (targetType === 'NPC') {
      BattleModel.requestNPC(id);
    }
    var renderBattlePage = function() {
      Router.render(<BattlePage />);
      BattleModel.removeInitializeListener(renderBattlePage);
    };
    BattleModel.addInitializeListener(renderBattlePage);
  }
};
