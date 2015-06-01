var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');
var rp = require('superagent-promise');

var CHANGE_EVENT = 'change';

var _baseCards = Immutable.fromJS([]);

var BaseCardsModel = module.exports = assign({}, EventEmitter.prototype, {
  isEmpty: function() {
    return _baseCards.count() > 0;
  },

  get: function() {
    return _baseCards;
  },

  fetch: function() {
    return (
      rp.get('/api/baseCards')
        .set('Accept', 'application/json')
        .end()
        .then(function(res) {
          _baseCards = Immutable.fromJS(res.body);
          this.emitChange();
        }.bind(this))
    );
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
