var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');
var rp = require('superagent-promise');

var CHANGE_EVENT = 'change';

var ERROR_EVENT = '_error';

var _account = Immutable.Map({});

var _drawedCards = Immutable.fromJS([]);

var _lastModifiedCard = null;

var _lastDeletedCardIds = Immutable.fromJS([]);

var _lastErrors = Immutable.Map({});

var SocketModel = require('./socket');

var AccountModel = module.exports = assign({}, EventEmitter.prototype, {

  emitError: function() {
    this.emit(ERROR_EVENT);
  },

  emitChange: function() {
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
  },

  get: function() {
    return _account;
  },

  getCardPartyInfo: function() {
    return _account.get('cardPartyInfo');
  },

  getLastModifiedCard: function() {
    return _lastModifiedCard;
  },

  getLastDeletedCardIds: function() {
    return _lastDeletedCardIds;
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

  login: function(username, password) {
    return (
      rp.post('/api/auth/local', {username: username, password: password})
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
          SocketModel.connect();
          this.emitChange();
          return res.body;
        }.bind(this)).catch(function(err) {
          var loginError = {error: 'wrong password or username'};
          _lastErrors = _lastErrors.set('login', Immutable.fromJS(loginError));
          this.emitError();
          _account = Immutable.Map({});
          this.emitChange();
          throw err;
        }.bind(this))
    );
  },

  fetch: function() {
    return (
      rp.get('/api/account')
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
          SocketModel.connect();
          _account = Immutable.fromJS(res.body);
          this.emitChange();
          return res.body;
        }.bind(this)).catch(function(err) {
          _account = Immutable.Map({});
          _lastErrors = _lastErrors.set('fetch', Immutable.fromJS(err.response.body));
          this.emitError();
          this.emitChange();
          throw err;
        }.bind(this))
    );
  },

  logout: function() {
    return (
      rp.post('/api/account/logout')
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
          SocketModel.disconnect();
          _account = Immutable.Map({});
          return res.body;
        })
    );
  },

  register: function(form) {
    return (
      rp.post('/api/account', form)
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
          return res.body;
        }.bind(this)).catch(function(err) {
          _lastErrors = _lastErrors.set('register', Immutable.fromJS(err.response.body));
          this.emitError();
          throw err;
        }.bind(this))
    );
  },

  decomposeCard: function(cardId) {
    var form = {id: cardId};
    return (
      rp.post('/api/account/cardDecompose', form)
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
          var getCry = res.body;
          _account = _account.update('cry', function(cry) { return cry + getCry; });
          _account = _account.update('deck', function(deck) {
            var index = deck.findIndex(function(card) {
              return card.get('id') == cardId;
            });
            if (index != -1) {
              _lastDeletedCardIds =  _lastDeletedCardIds.push(cardId);
              return deck.delete(index);
            }
            return deck;
          });
          this.emitChange();
          return res.body;
        }.bind(this)).catch(function(err) {
          _lastErrors = _lastErrors.set('decomposeCard', Immutable.fromJS(err.message));
          this.emitError();
          throw err;
        })
    );
  },

  cardEffortUpdate: function(cardId, updates) {
    var form = {id: cardId, cardEffortUpdates: updates};
    return (
      rp.post('/api/account/cardEffortUpdate', form)
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
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
          return res.body;
        }.bind(this).catch(function(err) {
          _lastErrors = _lastErrors.set('cardEffortUpdate',
                                        Immutable.fromJS(err.response.body));
          this.emitError();
          throw err;
        }.bind(this)))
    );
  },

  cardLevelUp: function(cardId) {
    var form = {id: cardId};
    var card = _account.get('deck').find(function(card2) {
      return card2.get('id') == cardId;
    });
    return (
      rp.post('/api/account/cardLevelUp', form)
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
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
          return res.body;
        }.bind(this)).catch(function(err) {
          _lastErrors = _lastErrors.set('cardLevelUp',
                                        Immutable.fromJS(err.response.body));
          this.emitError();
          throw err;
        }.bind(this))
    );
  },

  cardPartyLeave: function(cardPartyId, callback) {
    var form = {cardPartyId: cardPartyId};
    return (
      rp.post('/api/account/cardPartyLeave', form)
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
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
          return res.body;
        }.bind(this)).catch(function(err) {
          _lastErrors = _lastErrors.set('cardPartyLeave',
                                        Immutable.fromJS(err.response.body));
          this.emitError();
          throw err;
        }.bind(this))
    );
  },

  cardPartyJoin: function(cardId, slotIndex) {
    var cardPartyInfoId = _account.get('cardPartyInfo').get(0).get('id');
    var form = {cardId: cardId,
                slotIndex: slotIndex,
                cardPartyInfoId: cardPartyInfoId};
    return (
      rp.post('/api/account/cardPartyJoin', form)
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
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
                }
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
          this.emitChange();
          return res.body;
        }.bind(this)).catch(function(err) {
          _lastErrors = _lastErrors.set('cardPartyJoin',
                                        Immutable.fromJS(err.response.body));
          this.emitError();
          throw err;
        }.bind(this))
    );
  },

  getLastDrawedCard: function() {
    var last = _drawedCards.last();
    if (_drawedCards.count() > 0) {
      _drawedCards = _drawedCards.pop();
    }
    return last || null;
  },

  drawCard: function() {
    return (
      rp.post('/api/account/drawCard')
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
          var card = Immutable.fromJS(res.body);
          _account = _account.set('deck', _account.get('deck').push(card));
          var cardPrice = 1;
          _account = _account.set('money', _account.get('money') - cardPrice);
          _drawedCards = _drawedCards.push(card);
          this.emitChange();
        }.bind(this)).catch(function(err) {
          _lastErrors = _lastErrors.set('drawCard',
                                        Immutable.fromJS(err.response.body));
          this.emitError();
          throw err;
        }.bind(this))
    );
  }
});
