var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Immutable = require('immutable');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Button = BS.Button;

var BattleModel = require('../../models/battle');
var SkillModel = require('../../models/skill');

var Card = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    if (this.props.card) {
      return (
        <div onClick={this.props.onClick}>
            {this.props.card.get('name')} ({this.props.card.get('hp')}/{this.props.card.get('max_hp')})
        </div>
      );
    }
    return null;
  }
});

function getInitialState() {
  return {
    battlePC2NPC1v1: BattleModel.getBattlePC2NPC1v1(),
    effectsQueue: BattleModel.getBattlePC2NPC1v1EffectsQueue()
  };
}


var BattlePage = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    var state = getInitialState();
    state.round_card_slot_index = 0;
    state.selectingTarget = false;
    state.prepareUseSkills = Immutable.fromJS([]);
    return state;
  },

  componentDidMount: function() {
    BattleModel.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    BattleModel.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    var state = getInitialState();
    this.setState(state);
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (this.state.battlePC2NPC1v1.get('num_round') !=
      nextState.battlePC2NPC1v1.get('num_round')) {
      nextState.round_card_slot_index = 0;
    }
  },

  handleTargetSelect: function(target, event) {
    event.preventDefault();
    if (!this.state.selectingTarget) {
      return;
    }
    var _target = {
      round_player: target.get('round_player'),
      round_card_slot_index: target.get('round_card_slot_index')
    };
    _target = Immutable.fromJS(_target);
    var lastPrepareUseSkill = this.state.lastPrepareUseSkill.set('target', _target);
    var prepareUseSkills = this.state.prepareUseSkills.push(lastPrepareUseSkill);
    var round_card_slot_index = this.state.round_card_slot_index + 1;
    var accountCardParty = this.state.battlePC2NPC1v1.getIn(['accountBattleCardPartyInfo', 'cardParty']);
    var state = {
      lastPrepareUseSkill: lastPrepareUseSkill,
      prepareUseSkills: prepareUseSkills
    };
    if (accountCardParty.count() === round_card_slot_index) {
      BattleModel.useSkillsByPC(prepareUseSkills.toJSON(), 'battlePC2NPC1v1');
    } else {
      state.round_card_slot_index = round_card_slot_index;
    }
    this.setState(state);
  },

  handleUseSkill: function(skillIndex, skillId, card, event) {
    event.preventDefault();
    var state = {
      selectingTarget: true,
    };
    var prepareUseSkill = {
      skillIndex: skillIndex,
      skillId: skillId,
      target: null,
      round_card_slot_index: card.get('round_card_slot_index')
    };
    prepareUseSkill = Immutable.fromJS(prepareUseSkill);
    state.lastPrepareUseSkill = prepareUseSkill;
    this.setState(state);
  },

  render: function() {
    var info = this.state.effectsQueue.map(function(effect, usindex) {
      var userCard;
      var index = effect.getIn(['user', 'round_card_slot_index']);
      var userPlayer = effect.getIn(['user', 'round_player']);
      if (userPlayer === 'NPC') {
        userCard = this.state.battlePC2NPC1v1.getIn(['npcBattleCardPartyInfo', 'cardParty', index]);
      } else {
        userCard = this.state.battlePC2NPC1v1.getIn(['accountBattleCardPartyInfo', 'cardParty', index]);
      }
      var targetCard;
      var target = effect.getIn(['effects', 0, 'hp', '$dec', 'target']);
      var targetPlayer = target.get('round_player');
      index = target.get('round_card_slot_index');
      if (targetPlayer === 'NPC') {
        targetCard = this.state.battlePC2NPC1v1.getIn(['npcBattleCardPartyInfo', 'cardParty', index]);
      } else {
        targetCard = this.state.battlePC2NPC1v1.getIn(['accountBattleCardPartyInfo', 'cardParty', index]);
      }
      var decHp = 1;
      var skillId = effect.get('skillId');
      var skillName = SkillModel.getSkillNameById(skillId);
      return (
        <p key={usindex}>
            {userPlayer}: {userCard.get('name')} 使用了'{skillName}'造成 {targetCard.get('name')} 傷害 {decHp}
        </p>
      );
    }, this);
    var accountCardParty = this.state.battlePC2NPC1v1.getIn(['accountBattleCardPartyInfo', 'cardParty']);
    var npcCardParty = this.state.battlePC2NPC1v1.getIn(['npcBattleCardPartyInfo', 'cardParty']);
    var card = accountCardParty.get(this.state.round_card_slot_index);
    var skill1 = card.get('skill1');
    var skill2 = card.get('skill2');
    var skill3 = card.get('skill3');
    var skill4 = card.get('skill4');
    var cardBorderClassName = this.state.selectingTarget ? 'battleTargetCard' : '';
    var cardClassName = cardBorderClassName + ' battleCard';
    return (
      <Grid fluid>
          <Row>
              <Colm md={4} xs={4} className={cardClassName}>
                  <Card card={npcCardParty.get(0)}
                        onClick={this.handleTargetSelect.bind(this, npcCardParty.get(0))}
                  />
              </Colm>
              <Colm md={4} xs={4} className={cardClassName}>
                  <Card card={npcCardParty.get(1)}
                        onClick={this.handleTargetSelect.bind(this, npcCardParty.get(1))}
                  />
              </Colm>
              <Colm md={4} xs={4} className={cardClassName}>
                  <Card card={npcCardParty.get(2)}
                        onClick={this.handleTargetSelect.bind(this, npcCardParty.get(2))}
                  />
              </Colm>
          </Row>
          <Row>
              <Colm md={4}>
              </Colm>
              <Colm md={4} style={{marginTop: '10vh'}}>
                  {info}
              </Colm>
          </Row>
          <nav className="navbar navbar-fixed-bottom"
               style={{marginBottom: '6vh'}}>
              <Grid fluid>
                  <Row>
                      <Colm md={4} xs={4} className={cardClassName}>
                          <Card card={accountCardParty.get(0)}
                                onClick={this.handleTargetSelect.bind(this, accountCardParty.get(0))}
                          />
                      </Colm>
                      <Colm md={4} xs={4} className={cardClassName}>
                          <Card card={accountCardParty.get(1)}
                                onClick={this.handleTargetSelect.bind(this, accountCardParty.get(1))}
                          />
                      </Colm>
                      <Colm md={4} xs={4} className={cardClassName}>
                          <Card card={accountCardParty.get(2)}
                                onClick={this.handleTargetSelect.bind(this, accountCardParty.get(2))}
                          />
                      </Colm>
                  </Row>
                  <Row>
                      <Colm md={6}>
                          <Row>
                              <Colm md={6}>
                                  <Button bsSize="large" block onClick={this.handleUseSkill.bind(this, 1, skill1, card)}>
                                      {SkillModel.getSkillNameById(skill1)}
                                  </Button>
                                  <Button bsSize="large" block onClick={this.handleUseSkill.bind(this, 2, skill2, card)}>
                                      {SkillModel.getSkillNameById(skill2)}
                                  </Button>
                              </Colm>
                              <Colm md={6}>
                                  <Button bsSize="large" block onClick={this.handleUseSkill.bind(this, 3, skill3, card)}>
                                      {SkillModel.getSkillNameById(skill3)}
                                  </Button>
                                  <Button bsSize="large" block onClick={this.handleUseSkill.bind(this, 4, skill4, card)}>
                                      {SkillModel.getSkillNameById(skill4)}
                                  </Button>
                              </Colm>
                          </Row>
                      </Colm>
                      <Colm md={6}>
                          <Button bsSize="large">
                              替換
                          </Button>
                          <Button bsSize="large" href="#/stage">
                              逃跑
                          </Button>
                      </Colm>
                  </Row>
              </Grid>
          </nav>
      </Grid>
    );
  }
});
