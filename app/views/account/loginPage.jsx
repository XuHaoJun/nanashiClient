var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var MyNavbar = require('../layouts/navbar');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var LoginPanel = require('./loginPanel');

var LoginPage = module.exports = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <Grid>
          <MyNavbar />
          <LoginPanel />
      </Grid>
    );
  }
});
