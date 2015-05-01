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

var cardPartyPage = module.exports = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    var css = {height: "100%", minHeight: "100%", maxHeight: "100%"};
    var brand = (<a href="#/stage"><Glyphicon glyph='arrow-left' /> 返回關卡界面</a>);
    return (
      <Grid>
          <Row>
              <Navbar brand={brand}>
              </Navbar>
          </Row>
          <Row>
              編隊 1 2 3 4 5
          </Row>
          <Row>
              你的卡！
          </Row>
      </Grid>
    );
  }
});
