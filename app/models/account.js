var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');
var request = require('superagent');
var is = require('is_js');

var CHANGE_EVENT = 'change';

var _account = Immutable.Map({});

var SocketModel = require('./socket');

var AccountModel = module.exports = assign({}, EventEmitter.prototype, {

  get: function() {
    return _account;
  },

  getDeck: function() {
    return _account.get('deck');
  },

  isEmpty: function() {
    return _account.get('id') ? false : true;
  },

  login: function(username, password, callback) {
    request.post('/api/account/login')
      .send({username: username, password: password})
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (is.not.null(res.body)) {
          SocketModel.connect();
        }
        _account = Immutable.fromJS(res.body || {});
        callback(err);
        this.emitChange();
      }.bind(this));
  },

  logout: function(callback) {
    request.post('/api/account/logout')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        SocketModel.disconnect();
        _account = Immutable.Map({});
        if (callback) {
          callback();
        }
        this.emitChange();
      }.bind(this));
  },

  loginBySession: function(callback) {
    request.post('/api/account/loginBySession')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        _account = Immutable.fromJS(res.body || {});
        if (is.function(callback)) {
          callback(err);
        }
        if (is.not.null(res.body)) {
          SocketModel.connect();
        }
        this.emitChange();
      }.bind(this));
  },

  register: function(form, callback) {
    request.post('/api/account/register')
      .send(form)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        _account = Immutable.Map(res.body || {});
        callback(err);
        this.emitChange();
        if (is.not.null(res.body)) {
          SocketModel.connect();
        }
      }.bind(this));
  },

  syncServer: function(accountId, callback) {
    request.get('/api/account/'+ accountId)
      .accpet('json')
      .end(function(err, res) {
        var account = JSON.parse(res.body);
        _account = Immutable.Map(account);
        callback(err, _account);
        this.emitChange();
      }.bind(this));
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