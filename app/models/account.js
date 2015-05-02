var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');
var request = require('superagent');
var is = require('is_js');

var CHANGE_EVENT = 'change';

var _account = Immutable.Map({});

var _drawedCards = Immutable.fromJS([]);

var SocketModel = require('./socket');

var AccountModel = module.exports = assign({}, EventEmitter.prototype, {

  initialize: function() {
    _account = Immutable.Map({});
  },

  get: function() {
    return _account;
  },

  getDeck: function() {
    return _account.get('deck') || Immutable.fromJS([]);
  },

  getMoney: function() {
    return _account.get('money');
  },

  isEmpty: function() {
    return _account.get('id') ? false : true;
  },

  login: function(username, password, callback) {
    request.post('/api/account/login')
      .send({username: username, password: password})
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err !== null) {
          _account = Immutable.Map({});
        } else {
          SocketModel.connect();
          _account = Immutable.fromJS(res.body);
        }
        if (callback) {
          callback(err);
        }
        this.emitChange();
      }.bind(this));
  },

  loginBySession: function(callback) {
    request.post('/api/account/loginBySession')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err !== null) {
          _account = Immutable.Map({});
        } else {
          SocketModel.connect();
          _account = Immutable.fromJS(res.body);
        }
        if (callback) {
          callback(err);
        }
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
          callback(err);
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
        if (callback) {
          callback(err);
        }
        this.emitChange();
        if (is.not.null(res.body)) {
          SocketModel.connect();
        }
      }.bind(this));
  },

  getLastDrawedCard: function() {
    var last = _drawedCards.last();
    if (_drawedCards.count() > 0) {
      _drawedCards = _drawedCards.pop();
    }
    return last;
  },

  drawCard: function(callback) {
    request.post('/api/account/drawCard')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        console.log('new card', res.body);
        if (err == null && res.body) {
          var card = Immutable.fromJS(res.body);
          _account = _account.set('deck', _account.get('deck').push(card));
          var cardPrice = 1;
          _account = _account.set('money', _account.get('money') - cardPrice);
          _drawedCards = _drawedCards.push(card);
        }
        if (callback) {
          callback(err, card);
        }
        this.emitChange();
      }.bind(this));
  },

  syncServer: function(callback) {
    request.get('/api/account/'+ _account.get('id'))
      .accpet('json')
      .end(function(err, res) {
        var account = JSON.parse(res.body);
        _account = Immutable.Map(account);
        callback(err, _account);
        this.emitChange();
      }.bind(this));
  },

  emitChange: function() {
    window.account = _account;
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});
