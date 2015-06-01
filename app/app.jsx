window.$ = require('jquery');
window.jQuery = require('jquery');
window.React = require('react');

var React = require('react');
var VelocityTransitionGroup = require('./views/VelocityTransitionGroup');

var Router = require('./router');

var App = React.createClass({
  getInitialState: function() {
    return {
      page: null
    };
  },
  componentWillMount: function() {
    Router.render = function(component) {
      this.setState({page: component});
    }.bind(this);
    Router({
      dispatch: false
    });
    if (window && window._routerInitPath) {
      Router(window._routerInitPath);
    } else {
      Router('/');
    }
  },
  render: function() {
    var enterTransition = [[
      'transition.fadeIn',
      {duration: 600}
    ]];
    var key = Router.getRoute();
    return (
      <VelocityTransitionGroup enterTransition={enterTransition}>
          <div key={key}>
              {this.state.page}
          </div>
      </VelocityTransitionGroup>
    );
  }
});

React.render(<App />, document.body);
