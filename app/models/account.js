var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');
var request = require('superagent');

var CHANGE_EVENT = 'change';

var ERROR_EVENT = 'error';

var _account = Immutable.Map({});

var _drawedCards = Immutable.fromJS([]);

var _lastModifiedCard = null;

var SocketModel = require('./socket');

var _lastErrors = Immutable.Map({});

var AccountModel = module.exports = assign({}, EventEmitter.prototype, {

  get: function() {
    return _account;
  },

  getCardPartyInfo: function() {
    return _account.get('cardPartyInfo');
  },

  getLastModifiedCard: function() {
    return _lastModifiedCard;
  },

  getDeck: function() {
    return _account.get('deck', Immutable.fromJS([]));
  },

  getMoney: function() {
    return _account.get('money', null);
  },

  getLastErrors: function() {
    return _lastErrors;
  },

  getLastErrorByName: function(name) {
    return _lastErrors.get(name, null);
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
        _account = Immutable.fromJS(res.body || {});
        if (callback) {
          callback(err);
        }
        if (res.body !== null) {
          SocketModel.connect();
        }
        this.emitChange();
      }.bind(this));
  },

  cardEffortUpdate: function(cardId, updates, callback) {
    var form = {id: cardId, cardEffortUpdates: updates};
    request.post('/api/account/card/effortUpdate')
      .send(form)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err === null) {
          var foundIndex;
          var card = _account.get('deck').find(function(card2, index) {
            if (card2.get('id') == cardId) {
              foundIndex = index;
              return true;
            }
            return false;
          });
          _account = _account.updateIn(['deck', foundIndex], function(card) {
            var newCard;
            for (var key in updates) {
              newCard = card.set(key, card.get(key) + updates[key]);
            }
            _lastModifiedCard = newCard;
            return newCard;
          });
          this.emitChange();
        } else {
          _lastErrors.set('cardEffortUpdate', res.body);
          this.emitError();
        }
        if (callback) {
          callback(err);
        }
      }.bind(this));
  },

  cardLevelUp: function(cardId, callback) {
    var form = {id: cardId};
    var card = _account.get('deck').find(function(card2) {
      return card2.get('id') == cardId;
    });
    request.post('/api/account/card/levelUp')
      .send(form)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err === null) {
          var foundIndex;
          var card = _account.get('deck').find(function(card, index) {
            if (card.get('id') == cardId) {
              foundIndex = index;
              return true;
            }
            return false;
          }, null);
          _account = _account.update('cry', function(cry) {
            var newCry = cry - (card.get('level') * 10 + 25);
            return newCry;
          });
          _account = _account.updateIn(
            ['deck', foundIndex], function(card) {
              var newCard = card.set('level', card.get('level') + 1);
              _lastModifiedCard = newCard;
              return newCard;
            });
          this.emitChange();
        }
        if (callback) {
          callback(err);
        }
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
            function(cardPartys) {
              var foundIndex;
              var foundCardParty = cardPartys.find(function(cardParty, index) {
                if (cardParty.get('id') == res.body) {
                  foundIndex = index;
                  return true;
                };
                return false;
              });
              if (foundCardParty) {
                return cardPartys.set(foundIndex, foundCardParty.set('slot_index', slotIndex));
              }
              return (
                cardPartys.push(
                  Immutable.Map({id: res.body,
                                 card_id: cardId,
                                 card: foundCard,
                                 card_party_info_id: cardPartyInfoId,
                                 slot_index: slotIndex}))
              );
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


  emitError: function() {
    this.emit(ERROR_EVENT);
  },

  emitChange: function() {
    window.account = _account;
    this.emit(CHANGE_EVENT);
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
  }
});
