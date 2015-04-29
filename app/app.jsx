window.$ = require('jquery'); // for bootstrap

window.onload = function() {
  var Router = require('./router');
  Router.init('/');
};
