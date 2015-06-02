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

  componentDidMount: function() {
    document.title = 'Nanashi';
  },

  render: function() {
    return (
      <div style={{paddingTop: '70px'}}>
          <MyNavbar>
          </MyNavbar>
          <Grid>
              <Jumbotron>
                  <h1>Nanashi 納納西傳說</h1>
                  <p>
                      類型：類型：卡片養成對戰
                  </p>
                  <p>
                      平台：平台：網頁遊戲
                  </p>
                  <p>
                      遊戲背景設定在一個人類，獸人與各種魔物共存的異世界，遊戲中玩家
                      扮演 故事主角：納納西。目的是為了征服這個充滿冒險與挑戰世界，
                      達成統一，玩家 在遊戲開始會組織自己的公會（牌庫）並招募隊友，
                      跟著隊友一日一日增加並成 長茁壯，並克服一次次的挑戰，來達成納
                      納西的野心。
                  </p>
              </Jumbotron>
          </Grid>
      </div>
    );
  }
});
