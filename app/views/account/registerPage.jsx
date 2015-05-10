var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var MyNavbar = require('../layouts/navbar');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var RegisterPanel = require('./registerPanel');

var RegisterPage = module.exports = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div>
          <MyNavbar />
          <Grid fluid>
              <Row>
                  <Colm md={3} />
                  <Colm md={5}>
                      <RegisterPanel />
                  </Colm>
              </Row>
          </Grid>
      </div>
    );
  }
});
