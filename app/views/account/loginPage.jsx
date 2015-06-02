var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var MyNavbar = require('../layouts/navbar');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var LoginPanel = require('./loginPanel');

var LoginPage = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount: function() {
    document.title = 'Nanashi - 登入';
  },

  render: function() {
    return (
      <div style={{paddingTop: '70px'}}>
          <MyNavbar />
          <Grid fluid>
              <Row>
                  <Colm md={3} />
                  <Colm md={5}>
                      <LoginPanel />
                  </Colm>
              </Row>
          </Grid>
      </div>
    );
  }
});
