var Router = require('page');

var homeRoute = require('./controllers/home');
var loginRoute = require('./controllers/account').loginRoute;
var registerRoute = require('./controllers/account').registerRoute;
var cardPartyRoute = require('./controllers/account').cardPartyRoute;
var drawCardRoute = require('./controllers/account').drawCardRoute;
var stageRoute = require('./controllers/stage').homeRoute;
var battleRoute = require('./controllers/battle').homeRoute;
var baseCardsRoute = require('./controllers/baseCards').showRoute;

var routes = {
  '/': homeRoute,
  '/login': loginRoute,
  '/register': registerRoute,
  '/cardParty': cardPartyRoute,
  '/drawCard': drawCardRoute,
  '/stage': stageRoute,
  '/battle/:targetType/:id': battleRoute,
  '/baseCards': baseCardsRoute
};

for (var path in routes) {
  Router(path, routes[path]);
}

// use for server
window.Router = Router;

Router.setRoute = Router;

Router.getRoute = function() {
  return Router.current;
};

module.exports = Router;
