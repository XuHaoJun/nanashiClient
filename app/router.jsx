var Router = require('director').Router;

var Controllers = require('./controllers');

var routes = {
  '/': Controllers.Home,
  '/login': Controllers.Account.login,
  '/register': Controllers.Account.register,
  '/battle': Controllers.Battle.home
};

var _router = Router(routes);

_router.configure({
  async: true,
  notfound: function() {
    router.setRoute('/');
  }
});

module.exports = _router;
