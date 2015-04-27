var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Loading = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      <h2>Loading....</h2>
    );
  }
});
