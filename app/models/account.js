var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');
var request = require('superagent');

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

  getCardPartyInfo: function() {
    return _account.get('cardPartyInfo');
  },

  getDeckNoCardParty: function() {
    var cardPartys = _account.get('cardPartyInfo').get(0).get('cardParty');
    return (
      _account.get('deck').filterNot(function(card) {
        return (
          cardPartys.find(function(card2) {
            return card.get('id') == card2.get('card').get('id');
          }) ? true : false
        );
      })
    );
  },

  getDeck: function() {
    return _account.get('deck') || Immutable.fromJS([]);
  },

  getMoney: function() {
    return _account.get('money') || null;
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
        if (res.body !== null) {
          SocketModel.connect();
        }
        this.emitChange();
      }.bind(this));
  },

  cardPartyLeave: function(cardPartyId, callback) {
    var form = {cardPartyId: cardPartyId};
    request.post('/api/account/cardParty/leave')
      .send(form)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err === null) {
          var foundCard;
          _account = _account.updateIn(
            ['cardPartyInfo', 0, 'cardParty'],
            function(cardPartys) {
              return (
                cardPartys.filterNot(function(cardParty) {
                  if (cardParty.get('id') == cardPartyId) {
                    foundCard = cardParty.get('card');
                    return true;
                  }
                  return false;
                })
              );
            }
          );
          console.log('leave foundCard', foundCard.toJS());
          // _account = _account.update('deck', function(deck) {
          //   return deck.push(foundCard).sortBy(function(card) { return card.get('id'); });
          // });
          this.emitChange();
        }
        if (callback) {
          callback(err);
        }
      }.bind(this));
  },

  cardPartyJoin: function(cardId, slotIndex, callback) {
    var cardPartyInfoId = _account.get('cardPartyInfo').get(0).get('id');
    var form = {cardId: cardId,
                slotIndex: slotIndex,
                cardPartyInfoId: cardPartyInfoId};
    request.post('/api/account/cardParty/join')
      .send(form)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err === null) {
          var foundCard = _account.get('deck').find(function(card) {
            return card.get('id') == cardId;
          });
          _account = _account.updateIn(
            ['cardPartyInfo', 0, 'cardParty'],
            function(cardParty) {
              return cardParty.push(
                Immutable.Map({id: res.body,
                               card_id: cardId,
                               card: foundCard,
                               card_party_info_id: cardPartyInfoId,
                               slot_index: slotIndex}));
            });
        }
        if (callback) {
          callback(err);
        }
        this.emitChange();
      }.bind(this));
  },

  getLastDrawedCard: function() {
    var last = _drawedCards.last();
    if (_drawedCards.count() > 0) {
      _drawedCards = _drawedCards.pop();
    }
    return last || null;
  },

  drawCard: function(callback) {
    request.post('/api/account/drawCard')
      .set('Accept', 'application/json')
      .end(function(err, res) {
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
