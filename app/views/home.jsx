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
      <Grid>
          <MyNavbar>
          </MyNavbar>
          <Jumbotron>
              <h1>這頁是那那西傳說官方首頁</h1>
              <p><a href="#/battle">戰鬥頁面測試</a></p>
              <p><a href="#/deck">牌庫頁面測試</a></p>
              <p><a href="#/stage">關卡頁面測試</a></p>
              <p><Button bsStyle='primary' href="#/register">註冊</Button></p>
          </Jumbotron>
          聊天室測試，登入後才有效，測試帳號: wiwi wiwi, dodo dodo
          <ChatPanel>
          </ChatPanel>
          <MenuButton />
      </Grid>
    );
  }
});
