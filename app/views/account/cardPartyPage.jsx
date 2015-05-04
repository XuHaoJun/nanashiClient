var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var BS = require('react-bootstrap');
var Panel = BS.Panel;
var Button = BS.Button;
var ButtonGroup = BS.ButtonGroup;
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
    deck: AccountModel.getDeck(),
    cardPartyInfo: AccountModel.getCardPartyInfo(),
    lastModifiedCard: AccountModel.getLastModifiedCard()
  };
}

var _attributeTypes = ['hp', 'spd', 'atk', 'def'];
var _effortTypes = ['hp_effort', 'spd_effort', 'atk_effort', 'def_effort'];

var CardInfo = React.createClass({
  mixins: [PureRenderMixin],

  sumCardEffort: function() {
    var card = this.props.card;
    var sumEffort = 0;
    _effortTypes.forEach(function(t) {
      sumEffort = card.get(t) + sumEffort;
    });
    var level = card.get('level');
    return (level - 1) - sumEffort;
  },

  render: function() {
    var card = this.props.card;
    return (
      <div>
          <h3>
              {card.get('baseCard').get('name')}
          </h3>
          <h3>
              level: {card.get('level') }
          </h3>
          <div>
              hp: {card.get('baseCard').get('hp')} + {card.get('hp_effort')}
              <ButtonGroup bsSize='small' style={{marginLeft: '10px'}}>
                  <Button>-</Button>
                  <Button>+</Button>
              </ButtonGroup>
          </div>
          <div>
              spd: {card.get('baseCard').get('spd')} + {card.get('spd_effort')}
              <ButtonGroup bsSize='small' style={{marginLeft: '10px'}}>
                  <Button>-</Button>
                  <Button>+</Button>
              </ButtonGroup>
          </div>
          <div>
              atk: {card.get('baseCard').get('atk')} + {card.get('atk_effort')}
              <ButtonGroup bsSize='small' style={{marginLeft: '10px'}}>
                  <Button>-</Button>
                  <Button>+</Button>
              </ButtonGroup>
          </div>
          <div>
              def: {card.get('baseCard').get('def')} + {card.get('def_effort')}
              <ButtonGroup bsSize='small' style={{marginLeft: '10px'}}>
                  <Button><strong>-</strong></Button>
                  <Button>+</Button>
              </ButtonGroup>
          </div>
          <p>
              尚未分配努力值： {this.sumCardEffort()}
          </p>
      </div>
    );
  }
});

var CardPartyPage = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    var state = getInitialState();
    state.selectedCard = null;
    state.buttonDisabled = false;
    return state;
  },

  sortDeck: function() {
    var cardPartys = this.state.cardPartyInfo.get(0).get('cardParty');
    return (
      this.state.deck.filterNot(function(card) {
        return (
          cardPartys.find(function(card2) {
            return card.get('id') == card2.get('card').get('id');
          }) ? true : false
        );
      }).sortBy(function(card) {return card.get('id');})
    );
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
    if (state.lastModifiedCard && this.state.selectedCard) {
      if (state.lastModifiedCard.get('id') == this.state.selectedCard.get('id')) {
        state.selectedCard = state.lastModifiedCard;
      }
    }
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

  handlCardLevelUp: function(event) {
    this.setState({buttonDisabled: true});
    var cardId = this.state.selectedCard.get('id');
    AccountController.cardLevelUp(cardId);
  },

  render: function() {
    var brand = (<a href="#/stage"><Glyphicon glyph='arrow-left' /> 返回關卡界面</a>);
    var deck = this.sortDeck();
    if (this.state.selectedCard === null) {
      this.state.selectedCard = deck.get(0) ? deck.get(0) : null;
    }
    var cardPartys = this.state.cardPartyInfo.get(0).get('cardParty');
    deck = deck.map(
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
                      {
                        this.state.selectedCard ?
                       <CardInfo card={this.state.selectedCard} />
                       : null
                       }
                       <ButtonToolbar>
                           <Button disabled={this.state.buttonDisabled}
                                   onClick={this.handlCardLevelUp}>
                               升級
                           </Button>
                           <Button disabled={this.state.buttonDisabled}>
                               傳授
                           </Button>
                           <Button disabled={this.state.buttonDisabled}>
                               分解
                           </Button>
                           <Button disabled={true}>
                               配點
                           </Button>
                       </ButtonToolbar>
                  </Panel>
              </Colm>
          </Row>
      </Grid>
    );
  }
});
