var _ = require('lodash');
var is = require('is_js');
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
  console.log(AccountModel.get());
  return {
    deck: AccountModel.getDeck() || null,
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

  render: function() {
    var css = {height: "100%", minHeight: "100%", maxHeight: "100%"};
    var brand = (<a href="#/stage"><Glyphicon glyph='arrow-left' /> 返回關卡界面</a>);
    var cards = [];
    if (is.existy(this.state.deck) && this.state.deck.count() > 0) {
      console.log('deck', this.state.deck);
      console.log('deck.get(0)', this.state.deck.get(0));
      var deck = this.state.deck.toJS();
      cards = _.map(deck, function(v, k) {
        return (
          <div>
              <p>名稱: {v.baseCard.name}</p>
              <p>等級: {v.lv}</p>
              <p> hp 努力值: {v.hp_effort}</p>
              <p> spd 努力值: {v.spd_effort}</p>
              <p> atk 努力值: {v.atk_effort}</p>
              <p> def 努力值: {v.def_effort}</p>
              <p> 技能 1: {v.skill1}</p>
              <p> 技能 2: {v.skill2}</p>
              <p> 技能 3: {v.skill3}</p>
              <p> 技能 4: {v.skill4}</p>
          </div>
        );
      });
    }
    return (
      <Grid>
          <Row>
              <Navbar brand={brand}>
              </Navbar>
          </Row>
          <Row>
              <Colm md={6}>
                  <Panel header="牌庫" style={css}>
                      一堆格子(卡片)
                      {cards}
                  </Panel>
              </Colm>
              <Colm md={6}>
                  <Panel header="卡片資料" style={css}>
                      卡片正反面
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
