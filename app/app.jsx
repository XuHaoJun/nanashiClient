var React = require('react');
var Socket = require('socket.io-client');

var Router = require('./router');

var Loading = require('./views').Loading;

window.$ = require('jquery'); // for bootstrap

window.onload = function() {
  var socket = Socket();
  socket.on('connect', function(){ console.log('connected!'); });
  socket.on('event', function(data){});
  socket.on('disconnect', function(){ console.log('wiwi');});

  var request = require('superagent');
  var accountId = '111111111111111';
  request.get('/api/account/'+ accountId +'/isLogined', function(err, res) {
    var v = JSON.parse(res.text);
    console.log(v);
  });
  Router.init('/');
};
