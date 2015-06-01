var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var MyNavbar = require('./layouts/navbar');
var BS = require('react-bootstrap');
var Jumbotron = BS.Jumbotron;
var Button = BS.Button;
var Grid = BS.Grid;

var ChatPanel = require('./chatPanel');
var MenuButton = require('./account/menuButton');

var Home = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      <div style={{paddingTop: '70px'}}>
          <MyNavbar>
          </MyNavbar>
          <Grid>
              <Jumbotron>
                  <h1>這頁是那那西傳說官方首頁</h1>
                  <p>未來放遊戲影片在這裡</p>
                  <p><Button bsStyle='primary' href="/register">註冊</Button></p>
              </Jumbotron>
          </Grid>
      </div>
    );
  }
});
