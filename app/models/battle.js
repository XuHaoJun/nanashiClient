var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');

var INITIALIZE_EVENT = '_initialize';

var CHANGE_EVENT = 'change';

var USE_SKILL_EVENT = 'useSkill';

var ERROR_EVENT = '_error';

var SocketModel = require('./socket');

var _battlePC2NPC1v1 = null;

var _battlePC2NPC1v1EffectsQueue = Immutable.fromJS([]);

var BattleModel = module.exports = assign({}, EventEmitter.prototype, {

  getBattlePC2NPC1v1: function() {
    return _battlePC2NPC1v1;
  },

  getBattlePC2NPC1v1EffectsQueue: function() {
    return _battlePC2NPC1v1EffectsQueue;
  },

  initialize: function(payload) {
    console.log(payload);
    _battlePC2NPC1v1 = Immutable.fromJS(payload.battlePC2NPC1v1);
    this.emitChange();
    this.emitInitialize();
  },

  useSkillsByPC: function(prepareUseSkills, battleType) {
    var payload = {
      action: 'useSkillsByPC',
      prepareUseSkills: prepareUseSkills,
      battleType: battleType
    };
    SocketModel.emit('battle', payload);
  },

  handleEffectsQueue: function(payload) {
    console.log('handleEffectsQueue', payload);
    _battlePC2NPC1v1EffectsQueue = Immutable.fromJS(payload.effectsQueue);
    this.requestNPC(_battlePC2NPC1v1.get('npc_id')); // should delete this line
    this.emitChange();
  },

  requestNPC: function(npcId) {
    var payload = {action: 'requestNPC', npcId: npcId};
    SocketModel.emit('battle', payload);
  },

  emitError: function() {
    this.emit(ERROR_EVENT);
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitInitialize: function() {
    this.emit(INITIALIZE_EVENT);
  },

  addErrorListener: function(callback) {
    this.on(ERROR_EVENT, callback);
  },

  removeErrorListener: function(callback) {
    this.removeListener(ERROR_EVENT, callback);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  addInitializeListener: function(callback) {
    this.on(INITIALIZE_EVENT, callback);
  },

  removeInitializeListener: function(callback) {
    this.removeListener(INITIALIZE_EVENT, callback);
  }
});
