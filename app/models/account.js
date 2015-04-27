var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');
var request = require('superagent');

var CHANGE_EVENT = 'change';

var _account = Immutable.Map({
  id: 1,
  username: 'wiwi',
  password: '1234'
});

var Account = module.exports = assign({}, EventEmitter.prototype, {

  get: function() {
    return _account;
  },

  isLogined: function(accountId, callback) {
    request.get('/api/account/'+ accountId +'/isLogined', function(err, res) {
      var v = JSON.parse(res.text);
      console.log(v);
      callback(err, v);
    });
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
