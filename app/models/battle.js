var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');
var request = require('superagent');
var rp = require('superagent-promise');

var INITIALIZE_EVENT = '_initialize';

var CHANGE_EVENT = 'change';

var USE_SKILL_EVENT = 'useSkill';

var ERROR_EVENT = '_error';

var SocketModel = require('./socket');

var _battlePC2NPC1v1 = null;

var _battlePC2NPC1v1EffectsQueue = Immutable.fromJS([]);

var _complete = Immutable.fromJS({
  battlePC2NPC1v1: null
});

var _noCompletes = Immutable.fromJS([]);

var BattleModel = module.exports = assign({}, EventEmitter.prototype, {

  getBattlePC2NPC1v1: function() {
    return _battlePC2NPC1v1;
  },

  getBattlePC2NPC1v1EffectsQueue: function() {
    return _battlePC2NPC1v1EffectsQueue;
  },

  getNoCompletes: function() {
    return _noCompletes;
  },

  initialize: function(payload) {
    _battlePC2NPC1v1 = Immutable.fromJS(payload.battlePC2NPC1v1);
    this.emitChange();
    this.emitInitialize();
  },

  noCompletes : function() {
    return (
      rp('GET', '/api/battle/noCompletes')
        .end()
        .then(function(res) {
          _noCompletes = Immutable.fromJS(res.body);
          this.emitChange();
          return _noCompletes;
        }.bind(this)).catch(console.log)
    );
  },

  useSkillsByPC: function(prepareUseSkills, battleType) {
    var payload = {
      prepareUseSkills: prepareUseSkills,
      battleType: battleType
    };
    SocketModel.emit('battle:useSkillsByPC', payload);
  },

  handleEffectsQueue: function(payload) {
    console.log('handleEffectsQueue', payload);
    _battlePC2NPC1v1EffectsQueue = Immutable.fromJS(payload.effectsQueue);
    this.requestNPC(_battlePC2NPC1v1.get('npc_id')); // should delete this line
    this.emitChange();
  },

  handleComplete: function(payload) {
    _complete = _complete.update(payload.battleType, function(complete) {
      return Immutable.fromJS(payload.complete);
    });
    this.emitChange();
  },

  requestNPC: function(npcId) {
    var payload = {npcId: npcId};
    SocketModel.emit('battle:requestNPC', payload);
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
