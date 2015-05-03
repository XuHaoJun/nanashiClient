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

var VelocityTransitionGroup = require('../VelocityTransitionGroup');

var AccountModel = require('../../models/account');

var AccountController = require('../../controllers/account');

function getInitialState() {
  return {
    deck: AccountModel.getDeckNoCardParty(),
    cardPartyInfo: AccountModel.getCardPartyInfo()
  };
}

var CardPartyPage = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    var state = getInitialState();
    var firstCard = state.deck.get(0);
    state.buttonDisabled = false;
    state.selectedCard = firstCard ? firstCard : null;
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
    state.buttonDisabled = false;
    this.setState(state);
  },

  handleSlotClick: function(slot, event) {
    if (Number.isInteger(slot) || slot === null) {
      return;
    }
    var card = slot;
    this.setState({selectedCard: card});
  },

  handleCardClick: function(card, event) {
    this.setState({selectedCard: card});
  },

  handleJoinParty: function(slotIndex, event) {
    var card = this.state.selectedCard;
    if (card !== null) {
      this.setState({buttonDisabled: true});
      AccountController.cardPartyJoin(card.get('id'), slotIndex);
    }
  },

  handleLeaveParty: function(cardParty, event) {
    if (cardParty === null) {
      return;
    }
    this.setState({buttonDisabled: true});
    AccountController.cardPartyLeave(cardParty.get('id'));
  },

  render: function() {
    var brand = (<a href="#/stage"><Glyphicon glyph='arrow-left' /> 返回關卡界面</a>);
    var cardPartys = this.state.cardPartyInfo.get(0).get('cardParty');
    var deck = this.state.deck.map(
      function(card, k) {
        var borderCss = '1px solid blue';
        if (card.get('id') == this.state.selectedCard.get('id')) {
          borderCss = '2px solid red';
        }
        return (
          <Colm key={card.get('id')}
                md={2}
                onClick={this.handleCardClick.bind(this, card)}
                style={{border: borderCss, height: '64px'}}>
              {card.get('id')}
              {card.get('baseCard').get('name')}
          </Colm>
        );
      }, this);
    var slots = [];
    [1,2,3,4,5].forEach(function(slotIndex, index) {
      var slot;
      var cardParty = cardPartys.find(function(card) {
        return card.get('slot_index') == slotIndex;
      });
      if (cardParty) {
        var borderCss = '1px solid blue';
        var card = cardParty.get('card');
        if (card.get('id') == this.state.selectedCard.get('id')) {
          borderCss = '2px solid red';
        }
        slot = (
          <Colm key={index}
                md={2}
                onClick={this.handleSlotClick.bind(this, card)}
                style={{border: borderCss, height: '64px'}}>
              <div>
                  {card.get('id')}
                  {card.get('baseCard').get('name')}
              </div>
              <div>
                  <Button disabled={this.state.buttonDisabled}
                          onClick={this.handleLeaveParty.bind(this, cardParty)}>
                      取消
                  </Button>
              </div>
          </Colm>
        );
      } else {
        slot = (
          <Colm key={index}
                md={2}
                onClick={this.handleSlotClick.bind(this, slotIndex)}
                style={{border: '1px solid blue', height: '64px'}}>
              <div>
                  {slotIndex}
              </div>
              <div>
                  <Button disabled={this.state.buttonDisabled}
                          onClick={this.handleJoinParty.bind(this, slotIndex)}>
                      出戰
                  </Button>
              </div>
          </Colm>
        );
      }
      slots.push(slot);
    }.bind(this));
    var cardInfo = null;
    if (this.state.selectedCard) {
      var card = this.state.selectedCard;
      cardInfo = (
        <div key={card.get('id')}>
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
    }
    var panelCss = {height: "100%", minHeight: "100%", maxHeight: "100%"};
    var deckEnterTransition = [[
      {opacity: [ 1, 0 ]},
      {duration: 300,
       easing: 'easeInCubic'}
    ]];
    return (
      <Grid>
          <Row>
              <Navbar brand={brand}>
              </Navbar>
          </Row>
          <Row>
              <Colm md={6}>
                  <Panel header="牌庫" style={panelCss}>
                      <VelocityTransitionGroup enterTransition={deckEnterTransition} >
                          {deck}
                      </VelocityTransitionGroup>
                  </Panel>
              </Colm>
              <Colm md={6}>
                  <Panel header="隊伍" style={panelCss}>
                      {slots}
                  </Panel>
                  <Panel header="卡片資料" style={panelCss}>
                      <VelocityTransitionGroup enterTransition={deckEnterTransition} >
                          {cardInfo}
                      </VelocityTransitionGroup>
                  </Panel>
              </Colm>
          </Row>
      </Grid>
    );
  }
});
