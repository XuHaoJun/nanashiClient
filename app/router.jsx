var Router = require('director').Router;

var homeRoute = require('./controllers/home');
var loginRoute = require('./controllers/account').loginRoute;
var loginRouteBefore = require('./controllers/account').loginRouteBefore;
var registerRoute = require('./controllers/account').registerRoute;
var deckRoute = require('./controllers/deck').homeRoute;
var stageRoute = require('./controllers/stage').homeRoute;
var battleRoute = require('./controllers/battle').homeRoute;

var routes = {
  '/': homeRoute,
  '/login': loginRoute,
  '/register': registerRoute,
  '/deck': deckRoute,
  '/stage': stageRoute,
  '/battle': battleRoute
};

var _router = Router(routes);

console.log(_router);

_router.configure({
  async: true,
  notfound: function() {
    _router.setRoute('/');
  }
});

module.exports = _router;
