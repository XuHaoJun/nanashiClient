var $ = require('jquery');
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var BS = require('react-bootstrap');
var CollapsibleNav = BS.CollapsibleNav;
var Navbar = BS.Navbar;
var Nav = BS.Nav;
var NavItem = BS.NavItem;

var MyNavbar = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var brand = (<a href="/">那那西傳說</a>);
    return (
      <Navbar brand={brand} toggleNavKey={0} fixedTop>
          <CollapsibleNav eventKey={0}> {/* This is the eventKey referenced */}
              <Nav navbar right>
                  <NavItem eventKey={1} href='/login'>登入</NavItem>
                  <NavItem eventKey={2} href='/register'>註冊</NavItem>
              </Nav>
          </CollapsibleNav>
      </Navbar>
    );
  }
});
