var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var MyNavbar = require('./layouts').Navbar;
var BS = require('react-bootstrap');
var Jumbotron = BS.Jumbotron;
var Button = BS.Button;
var Grid = BS.Grid;

var Home = module.exports = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <Grid>
          <MyNavbar>
          </MyNavbar>
          <Jumbotron>
              <h1>這頁是那那西傳說官方首頁</h1>
              <a href="#/battle">戰鬥頁面測試</a>
              <p><Button bsStyle='primary' href="#/register">註冊</Button></p>
          </Jumbotron>
      </Grid>
    );
  }
});
