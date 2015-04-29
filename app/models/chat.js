var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');
var request = require('superagent');
var is = require('is_js');

var CHANGE_EVENT = 'change';

var _chat = Immutable.fromJS({messages: []});

var SocketModel = require('./socket');

var ChatModel = module.exports = assign({}, EventEmitter.prototype, {
  get: function() {
    return _chat;
  },

  getMessages: function() {
    return _chat.get('messages');
  },

  addMessage: function(msg) {
    _chat = Immutable.Map({messages: _chat.get('messages').push(msg)});
    this.emitChange();
  },

  sendMessage: function(msg) {
    SocketModel.emit('chat', msg);
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});
