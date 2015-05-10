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
    cardPartyInfo: AccountModel.getCardPartyInfo()
  };
}

var _attributeTypes = ['hp', 'spd', 'atk', 'def'];
var _effortTypes = ['hp_effort', 'spd_effort', 'atk_effort', 'def_effort'];

var CardInfo = React.createClass({
  mixins: [PureRenderMixin],

  getInitialEffortUpdate: function() {
    return {
      hp_effort_update: 0,
      spd_effort_update: 0,
      atk_effort_update: 0,
      def_effort_update: 0
    };
  },

  getInitialState: function() {
    var state = this.getInitialEffortUpdate();
    state.effortUpdateButtonDisabled = true
    return state;
  },

  componentWillReceiveProps: function(nextProps) {
    var card = nextProps.card;
    // TODO
    // may be check same unusedeffort....
    if (this.props.card.get('id') == card.get('id')) {
      this.setState(this.getInitialEffortUpdate());
    }
  },

  cardEffortUpdates: function() {
    var effortUpdates = {};
    _effortTypes.forEach(function(v, index) {
      var effortUpdate = this.state[v + '_update'];
      if (effortUpdate > 0) {
        effortUpdates[v] = effortUpdate;
      }
    }.bind(this));
    return effortUpdates;
  },

  sumCardEffortUpdate: function() {
    return (
      this.state.hp_effort_update +
      this.state.spd_effort_update +
      this.state.atk_effort_update +
      this.state.def_effort_update
    );
  },

  isUsedEffortUpdate: function() {
    return (
      this.state.hp_effort_update > 0 ||
      this.state.spd_effort_update > 0 ||
      this.state.atk_effort_update > 0 ||
      this.state.def_effort_update > 0
    );
  },

  sumUnusedCardEffort: function(card, noUpdateValue) {
    var sumEffort = 0;
    _effortTypes.forEach(function(t) {
      sumEffort += card.get(t);
    });
    var level = card.get('level');
    if (noUpdateValue) {
      return (level - 1) - sumEffort;
    }
    return (level - 1) - sumEffort - this.sumCardEffortUpdate();
  },

  handleMinusEffort: function(attrName, event) {
    var effortName = attrName+'_effort';
    var effortUpdateName = effortName + '_update';
    var state = {};
    state[effortUpdateName] = this.state[effortUpdateName] - 1;
    state.effortUpdateButtonDisabled = false;
    if (state[effortUpdateName] < 0) {
      return;
    }
    this.setState(state);
  },

  handlePlusEffort: function(attrName, event) {
    var effortName = attrName+'_effort';
    var effortUpdateName = effortName + '_update';
    var state = {};
    state[effortUpdateName] = this.state[effortUpdateName] + 1;
    state.effortUpdateButtonDisabled = false;
    if (this.sumUnusedCardEffort(this.props.card) <= 0 ) {
      return;
    }
    this.setState(state);
  },

  renderCardAttributes: function() {
    return (
      _attributeTypes.map(function(attrName, index) {
        var effortName = attrName+'_effort';
        var effortUpdateName = effortName + '_update';
        var finalAttr = ((this.props.card.get('baseCard').get(attrName)) +
                                               (this.props.card.get(effortName) * 3) +
                                               (this.state[effortUpdateName] * 3));
        return (
          <div key={index}>
              {attrName}: {finalAttr} | {this.state[effortUpdateName]}
              <ButtonGroup bsSize='small' style={{marginLeft: '10px'}}>
                  <Button onClick={this.handleMinusEffort.bind(this, attrName)}>-</Button>
                  <Button onClick={this.handlePlusEffort.bind(this, attrName)}>+</Button>
              </ButtonGroup>
          </div>
        );
      }, this)
    );
  },

  render: function() {
    return (
      <div>
          <h3>
              {this.props.card.get('baseCard').get('name')}
          </h3>
          <h3>
              level: {this.props.card.get('level') }
          </h3>
          <Button bsSize="xsmall">重新配點</Button>
          {this.renderCardAttributes()}
          <p>
              尚未分配努力值： {this.sumUnusedCardEffort(this.props.card)}
          </p>
          <ButtonToolbar>
              <Button disabled={(this.props.card.get('level') >= 50)|| this.props.buttonDisabled}
                      onClick={this.props.onLevelUpButtonClick}>
                  升級
              </Button>
              <Button disabled={this.props.buttonDisabled}>
                  傳授
              </Button>
              <Button disabled={this.props.buttonDisabled}
                      onClick={this.props.onDecomposeButtonClick}>
                  分解
              </Button>
              <Button disabled={this.state.effortUpdateButtonDisabled || this.props.buttonDisabled}
                      onClick={this.props.onEffortUpdateButtonClick.bind(null, this.cardEffortUpdates())}
                      >
                  配點
              </Button>
          </ButtonToolbar>
      </div>
    );
  }
});

var Deck = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      deck: this.sortedDeck(this.props.deck,
                            this.props.cardPartyInfo)
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({deck: this.sortedDeck(nextProps.deck,
                                         nextProps.cardPartyInfo)})
  },

  sortedDeck: function(deck, cardPartyInfo) {
    var cardPartys = cardPartyInfo.get(0).get('cardParty');
    return (
      deck.filterNot(function(card) {
        return (
          cardPartys.find(function(card2) {
            return card.get('id') == card2.get('card').get('id');
          }) ? true : false
        );
      }).sortBy(function(card) {return card.get('id');})
    );
  },

  render: function() {
    var deck = this.state.deck;
    deck = deck.map(
      function(card, k) {
        var borderCss = '1px solid blue';
        if (card.get('id') == this.props.selectedCard.get('id')) {
          borderCss = '2px solid red';
        }
        return (
          <Colm key={card.get('id')}
                md={2}
                onClick={this.props.onCardClick.bind(null, card)}
                style={{border: borderCss, height: '64px'}}>
              {card.get('id')}
              {card.get('baseCard').get('name')}
          </Colm>
        );
      }, this);
    var deckEnterTransition = [[
      {opacity: [ 1, 0 ]},
      {duration: 300,
       easing: 'easeInCubic'}
    ]];
    return (
      <VelocityTransitionGroup enterTransition={deckEnterTransition} >
          {deck}
      </VelocityTransitionGroup>
    );
  }
});

var CardPartyPage = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    var state = getInitialState();
    state.selectedCard = null;
    state.buttonDisabled = false;
    state.effortUpdateButtonDisabled = true;
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
    var lastModifiedCard = AccountModel.getLastModifiedCard();
    if (lastModifiedCard && this.state.selectedCard) {
      if (lastModifiedCard.get('id') == this.state.selectedCard.get('id')) {
        state.selectedCard = lastModifiedCard;
      }
    }
    var lastDeletedCardIds = AccountModel.getLastDeletedCardIds();
    if (this.state.selectedCard) {
      var found = lastDeletedCardIds.find(function(cardId) {
        return cardId == this.state.selectedCard.get('id')
      }, this);
      if (found) {
        state.selectedCard = null;
      }
    }
    this.setState(state);
  },

  handleSlotClick: function(slot, event) {
    event.preventDefault();
    if (Number.isInteger(slot) || slot === null) {
      return;
    }
    var card = slot;
    this.setState({selectedCard: card});
  },

  handleCardClick: function(card, event) {
    event.preventDefault();
    this.setState({selectedCard: card});
  },

  handleJoinParty: function(slotIndex, event) {
    event.preventDefault();
    var card = this.state.selectedCard;
    if (card !== null) {
      this.setState({buttonDisabled: true});
      AccountController.cardPartyJoin(card.get('id'), slotIndex);
    }
  },

  handleLeaveParty: function(cardParty, event) {
    event.preventDefault();
    if (cardParty === null) {
      return;
    }
    this.setState({buttonDisabled: true});
    AccountController.cardPartyLeave(cardParty.get('id'));
  },

  handleCardLevelUp: function(event) {
    event.preventDefault();
    var cardId = this.state.selectedCard.get('id');
    AccountController.cardLevelUp(cardId);
    this.setState({buttonDisabled: true});
  },

  handleDecomposeCard: function(event) {
    event.preventDefault();
    var cardId = this.state.selectedCard.get('id');
    AccountController.decomposeCard(cardId);
  },

  handleCardEffortUpdate: function(updates, event) {
    event.preventDefault();
    var cardId = this.state.selectedCard.get('id');
    AccountController.cardEffortUpdate(cardId, updates);
  },

  render: function() {
    if (this.state.selectedCard === null) {
      var minIdCard = this.state.deck.minBy(function(card) {return card.get('id');});
      this.state.selectedCard = minIdCard ? minIdCard : null;
    }
    var cardPartys = this.state.cardPartyInfo.get(0).get('cardParty');
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
    var brand = (<a href="#/stage"><Glyphicon glyph='arrow-left' /> 返回關卡界面</a>);
    return (
      <Grid>
          <Row>
              <Navbar brand={brand}>
              </Navbar>
          </Row>
          <Row>
              <Colm md={6}>
                  <Panel header="隊伍">
                      {slots}
                  </Panel>
                  <Panel header="牌庫">
                      <Deck ref="deck"
                            cardPartyInfo={this.state.cardPartyInfo}
                            deck={this.state.deck}
                            onCardClick={this.handleCardClick}
                            selectedCard={this.state.selectedCard}
                      />
                  </Panel>
              </Colm>
              <Colm md={6}>
                  <Panel header="卡片資料">
                      {
                        this.state.selectedCard ?
                       <CardInfo
                       ref="cardInfo"
                       key={this.state.selectedCard.get('id')}
                       buttonDisabled={this.state.buttonDisabled}
                       onLevelUpButtonClick={this.handleCardLevelUp}
                       onEffortUpdateButtonClick={this.handleCardEffortUpdate}
                       onDecomposeButtonClick={this.handleDecomposeCard}
                       card={this.state.selectedCard}
                       />
                       : null
                       }
                  </Panel>
              </Colm>
          </Row>
      </Grid>
    );
  }
});
