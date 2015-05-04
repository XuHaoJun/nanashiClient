var Router = require('director').Router;

var homeRoute = require('./controllers/home');
var loginRoute = require('./controllers/account').loginRoute;
var registerRoute = require('./controllers/account').registerRoute;
var cardPartyRoute = require('./controllers/account').cardPartyRoute;
var drawCardRoute = require('./controllers/account').drawCardRoute;
var stageRoute = require('./controllers/stage').homeRoute;
var battleRoute = require('./controllers/battle').homeRoute;

var routes = {
  '/': homeRoute,
  '/login': loginRoute,
  '/register': registerRoute,
  '/cardParty': cardPartyRoute,
  '/drawCard': drawCardRoute,
  '/stage': stageRoute,
  '/battle': battleRoute
};

var _router = Router(routes);

_router.configure({
  async: true,
  notfound: function() {
    _router.setRoute('/');
  }
});

module.exports = _router;
