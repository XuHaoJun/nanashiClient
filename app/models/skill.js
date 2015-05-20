var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var SkillModel = module.exports = assign({}, EventEmitter.prototype, {
  getSkillNameById: function(sid) {
    switch(sid) {
    case 1:
      return '毒爪';
    case 2:
      return '肥肚撞擊';
    case 3:
      return '咬咬';
    case 4:
      return '飛天跳躍';
    default:
      return null;
    }
  }
});
