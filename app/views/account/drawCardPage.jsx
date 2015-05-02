var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var MyNavbar = require('../layouts/navbar');
var BS = require('react-bootstrap');
var Row = BS.Row;
var Colm = BS.Col;
var Grid = BS.Grid;
var Glyphicon = BS.Glyphicon;
var Button = BS.Button;
var Navbar = BS.Navbar;

var AccountController = require('../../controllers/account');
var AccountModel = require('../../models/account');

function getInitialState() {
  return {
    money: AccountModel.getMoney(),
    lastDrawedCard: AccountModel.getLastDrawedCard()
  };
}

var LastCard = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    var card = this.props.card;
    if (!card) {
      return (<div></div>);
    } else {
      return (
        <div>
            <h2>
                {card.get('baseCard').get('name')}
            </h2>
            <p>
                hp: {card.get('baseCard').get('hp')}
            </p>
            <p>
                spd: {card.get('baseCard').get('spd')}
            </p>
            <p>
                atk: {card.get('baseCard').get('atk')}
            </p>
            <p>
                def: {card.get('baseCard').get('def')}
            </p>
        </div>
      );
    }
  }
});

var DrawCardPage = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    var state = getInitialState();
    state.drawButtonText = '爽抽';
    state.disabledDrawButton = false;
    return state;
  },

  componentDidMount: function() {
    AccountModel.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AccountModel.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    var state = getInitialState();
    state.disabledDrawButton = false;
    state.drawButtonText = '爽抽';
    this.setState(state);
  },

  handleDrawCard: function() {
    this.setState({disabledDrawButton: true,
                   drawButtonText: '爽抽中...'});
    AccountController.drawCard();
  },

  render: function() {
    var brand = (
      <a href="#/stage">
          <Glyphicon glyph='arrow-left' /> 返回關卡界面
      </a>
    );
    var card = this.state.lastDrawedCard;
    return (
      <Grid>
          <Navbar brand={brand}>
          </Navbar>
          <Row>
              <Colm md={4}></Colm>
              <Colm md={8}>
                  <LastCard card={card} />
              </Colm>
          </Row>
          <Row>
              <Colm md={4}></Colm>
              <Colm md={8}>
                  <h2>您目前金幣數量： {this.state.money} </h2>
                  <h2>花費 {1} 金幣</h2>
                  <Button disabled={this.state.disabledDrawButton}
                          bsSize="large"
                          onClick={this.handleDrawCard}>
                      {this.state.drawButtonText}
                  </Button>
              </Colm>
          </Row>
      </Grid>
    );
  }
});
