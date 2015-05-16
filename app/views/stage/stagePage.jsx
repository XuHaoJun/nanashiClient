var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Button = BS.Button;
var ButtonToolbar = BS.ButtonToolbar;

var ChatPanel = require('../chatPanel');
var MenuButton = require('../account/menuButton');

var AccountModel = require('../../models/account');

function getInitialState() {
  return {
    account: AccountModel.get(),
  };
}

var StagePage = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return getInitialState();
  },

  componentDidMount: function() {
    AccountModel.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AccountModel.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getInitialState());
  },

  render: function() {
    return (
      <Grid fluid>
          <Row>
              <Colm md={1}></Colm>
              <Colm md={3}>
                  <h3>
                      帳號: {this.state.account.get('username')}
                  </h3>
              </Colm>
              <Colm md={1}></Colm>
              <Colm md={2}>
                  <h3>
                      水晶: {this.state.account.get('cry')}
                  </h3>
              </Colm>
              <Colm md={2}>
                  <h3>
                      錢: {this.state.account.get('money')}
                  </h3>
              </Colm>
              <Colm md={3}>
                  <MenuButton />
              </Colm>
          </Row>
          <Row>
              <Colm md={12}>
                  地圖： 貓咪實驗室
              </Colm>
          </Row>
          <Row>
              <Colm md={6}>
              </Colm>
              <Colm md={6}>
              <Button href="#/battle/NPC/1">
                  NPC-01
              </Button>
              </Colm>
          </Row>
          <div style={{width: '25vw',
                       position: 'fixed',
                       bottom: '0px',
                       height: '20vh',
                      }}>
              <ChatPanel />
          </div>
          <div style={{width: '25vw',
                       position: 'fixed',
                       left: '34vw',
                       bottom: '5vh',
                      }}>
              <ButtonToolbar>
                  <Button bsSize="large" href="#/cardParty">編隊</Button>
                  <Button bsSize="large" href="#/drawCard">抽卡</Button>
                  <Button bsSize="large">玩家對戰</Button>
              </ButtonToolbar>
          </div>
      </Grid>
    );
  }
});
