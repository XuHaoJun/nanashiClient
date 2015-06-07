var Socket = require('socket.io-client');
var _socket = null;
var _isFirst = true;

module.exports = {
  get: function() {
    return _socket;
  },

  logout: function() {
    if (_socket && _socket.disconected === false) {
      _socket.emit('logout');
    }
  },

  connect: function(callback) {
    if (_socket && _socket.disconected === false) {
      return false;
    }
    if (_isFirst) {
      _isFirst = false;
      var ChatModel = require('./chat');
      var BattleModel = require('./battle');
      _socket = Socket();
      _socket.on('connection', callback);
      _socket.on('chat', function(msg) {
        ChatModel.addMessage(msg);
      });
      _socket.on('battle', function(payload) {
        BattleModel[payload.action](payload);
      });
      _socket.on('_error', function(err) {
        if (err.error == 'duplicate connection.') {
          alert('重複帳號登入! 聊天和戰鬥功能將會無法使用');
        }
      });
    } else {
      _socket.connect();
    }
    return true;
  },

  disconnect: function() {
    if (_socket) {
      _socket.disconnect();
    }
  },

  emit: function(name, data) {
    if (_socket) {
      _socket.emit(name, data);
    }
  },

  isDisconected: function() {
    return _socket === null || _socket.disconected;
  },

  isConnecting: function() {
    return _socket && _socket.disconected === false;
  }
};
