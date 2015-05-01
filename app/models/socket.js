var Socket = require('socket.io-client');
var _socket = null;
var _isFirst = true;

module.exports = {
  get: function() {
    return _socket;
  },

  logout: function() {
    if (_socket && _socket.disconected == false) {
      _socket.emit('logout');
    }
  },

  connect: function() {
    if (_socket && _socket.disconected == false) {
      return false;
    }
    if (_isFirst) {
      _isFirst = false;
      var ChatModel = require('./chat');
      _socket = Socket();
      console.log('is first', _socket);
      _socket.on('chat', function(msg) {
        ChatModel.addMessage(msg);
        console.log('socket receive chat msg', msg);
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

  isConnecting: function() {
    return _socket && _socket.disconected == false;
  }
};
