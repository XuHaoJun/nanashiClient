var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var BS = require('react-bootstrap');
var Navbar = BS.Navbar;
var Nav = BS.Nav;
var NavItem = BS.NavItem;

var MyNavbar = module.exports = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    var brand = (<a href="#/">那那西傳說</a>);
    return (
      <Navbar brand={brand}>
          <Nav>
              <NavItem eventKey={1} href='#/login'>登入</NavItem>
              <NavItem eventKey={2} href='#/register'>註冊</NavItem>
          </Nav>
      </Navbar>
    );
  }
});
