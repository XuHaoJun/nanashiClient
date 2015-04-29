var React = require('react');

var ChatModel = require('../models/chat');

module.exports = {
  sendMessage: function(msg) {
    ChatModel.sendMessage(msg);
  }
};
