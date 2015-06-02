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
      if (BattleModel.getBattlePC2NPC1v1() === null) {
        Router.setRoute('/stage');
      } else {
        Router.render(<BattlePage />);
        BattleModel.removeInitializeListener(renderBattlePage);
      }
    };
    BattleModel.addInitializeListener(renderBattlePage);
  }
};
