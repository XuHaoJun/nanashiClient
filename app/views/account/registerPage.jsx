var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var MyNavbar = require('../layouts').Navbar;
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var RegisterPanel = require('./registerPanel');

var RegisterPage = module.exports = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <Grid>
          <MyNavbar />
          <RegisterPanel />
      </Grid>
    );
  }
});
