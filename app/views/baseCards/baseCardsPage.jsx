var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var MyNavbar = require('../layouts/navbar');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Table = BS.Table;
var Spinner = require('react-spin');

var BaseCardsModel = require('../../models/baseCards');

var BaseCard = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var card = this.props.baseCard;
    return (
      <tr>
          <td>{card.get('id')}</td>
          <td>{card.get('name')}</td>
          <td>{card.get('rea')}</td>
          <td>{card.get('hp')}</td>
          <td>{card.get('spd')}</td>
          <td>{card.get('atk')}</td>
          <td>{card.get('def')}</td>
      </tr>
    );
  }
});

var BaseCardsTable = React.createClass({
  mixins: [PureRenderMixin],

  renderBaseCard: function(baseCard) {
    return (
      <BaseCard key={baseCard.get('id')} baseCard={baseCard} />
    );
  },

  render: function() {
    return (
      <Table striped bordered condensed hover>
          <thead>
              <tr>
                  <th>Id</th>
                  <th>名稱</th>
                  <th>稀有度</th>
                  <th>血量</th>
                  <th>速度</th>
                  <th>攻擊</th>
                  <th>防禦</th>
              </tr>
          </thead>
          <tbody>
              {this.props.baseCards.map(this.renderBaseCard, this)}
          </tbody>
      </Table>
    );
  }
});

function getInitialState() {
  return {
    baseCards: BaseCardsModel.get(),
  };
}

var BaseCardsPage = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return getInitialState();
  },

  componentDidMount: function() {
    BaseCardsModel.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    BaseCardsModel.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getInitialState());
  },

  render: function() {
    var spinCfg = {
      width: 12,
      radius: 35
    };
    return (
      <div style={{paddingTop: '70px'}}>
          <MyNavbar />
          <Grid fluid>
              {
                this.state.baseCards.count() > 0 ?
               <BaseCardsTable baseCards={this.state.baseCards} />
                 :
               <Spinner config={spinCfg} />
               }
          </Grid>
      </div>
    );
  }
});
