window.$ = require('jquery');
window.jQuery = require('jquery');
window.React = require('react');

window.onload = function() {
  var Router = require('./router');
  Router.init('/');
};
