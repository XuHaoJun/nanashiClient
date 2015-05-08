var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');

var SocketModel = require('./socket');

var _battle = null;

var BattleModel = module.exports = assign({}, EventEmitter.prototype, {

  get: function() {
    return _battle;
  },

  requestNPC: function(npcId) {
    SocketModel.emit('battle', {type: 'requestNPC', npcId: npcId});
  }
});
