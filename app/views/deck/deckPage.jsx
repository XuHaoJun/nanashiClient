var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var BS = require('react-bootstrap');
var Panel = BS.Panel;
var Button = BS.Button;
var ButtonToolbar = BS.ButtonToolbar;
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Glyphicon = BS.Glyphicon;
var Navbar = BS.Navbar;

var AccountModel = require('../../models/account');

function getInitialState() {
  return {
    cardInfo: '',
    deck: AccountModel.getDeck(),
  };
}

var DeckPage = module.exports = React.createClass({
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

  handleCardClick: function(card, event) {
    var cardInfo = (
      <div>
          <p>
              {card.get('baseCard').get('name')}
          </p>
          <p>
              hp: {card.get('baseCard').get('hp')} + {card.get('hp_effort')}
          </p>
          <p>
              spd: {card.get('baseCard').get('spd')} + {card.get('spd_effort')}
          </p>
          <p>
              atk: {card.get('baseCard').get('atk')} + {card.get('atk_effort')}
          </p>
          <p>
              def: {card.get('baseCard').get('def')} + {card.get('def_effort')}
          </p>
      </div>
    );
    this.setState({cardInfo: cardInfo});
  },

  render: function() {
    var cards = this.state.deck.map(function(card, k) {
      var id = card.get('id');
      return (
        <Colm key={id}
              md={2}
              onClick={this.handleCardClick.bind(this, card)}
              style={{border: '1px solid blue', height: '64px'}}>
            {card.get('id')}
            {card.get('baseCard').get('name')}
        </Colm>
      );
    }, this);
    var panelCss = {height: "100%", minHeight: "100%", maxHeight: "100%"};
    var brand = (
      <a href="#/stage">
          <Glyphicon glyph='arrow-left' /> 返回關卡界面
      </a>
    );
    return (
      <Grid>
          <Row>
              <Navbar brand={brand}>
              </Navbar>
          </Row>
          <Row>
              <Colm md={6}>
                  <Panel header="牌庫" style={panelCss}>
                      <Row>
                          {cards}
                      </Row>
                  </Panel>
              </Colm>
              <Colm md={6}>
                  <Panel header="卡片資料" style={panelCss}>
                      {this.state.cardInfo}
                      <ButtonToolbar>
                          <Button>升級</Button>
                          <Button>傳授</Button>
                          <Button>配點</Button>
                          <Button>分解</Button>
                      </ButtonToolbar>
                  </Panel>
              </Colm>
          </Row>
      </Grid>
    );
  }
});
