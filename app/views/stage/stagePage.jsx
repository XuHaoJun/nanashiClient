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
  console.log(AccountModel.get());
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
    console.log(this.state);
    return (
      <Grid fluid>
          <Row>
              <Colm md={1}></Colm>
              <Colm md={3}>
                  <h3>
                      帳號: {this.state.account.get('username')}
                  </h3>
              </Colm>
              <Colm md={2}></Colm>
              <Colm md={1}>
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
          <nav className="navbar navbar-fixed-bottom">
              <Row>
                  <Colm md={3}>
                      <ChatPanel />
                  </Colm>
                  <Colm md={1}></Colm>
                  <Colm md={8}>
                      <ButtonToolbar>
                          <Button bsSize="large" href="#/deck">牌庫</Button>
                          <Button bsSize="large">編隊</Button>
                          <Button bsSize="large">抽卡</Button>
                          <Button bsSize="large">玩家對戰</Button>
                      </ButtonToolbar>
                  </Colm>
              </Row>
          </nav>
      </Grid>
    );
  }
});