// for bootstrap and react-tostr
window.$ = require('jquery');
window.jQuery = require('jquery');

window.onload = function() {
  var Router = require('./router');
  Router.init('/');
};
