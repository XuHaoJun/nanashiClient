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
  componentDidMount: function() {
    Router.render = function(component) {
      this.setState({page: component});
    }.bind(this);
    Router.init();
  },
  render: function() {
    var enterTransition = [[
      'transition.fadeIn',
      {duration: 500}
    ]];
    var key = Router.getRoute(0);
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
