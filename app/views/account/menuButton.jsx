var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var BS = require('react-bootstrap');
var DropdownButton = BS.DropdownButton;
var Glyphicon = BS.Glyphicon;
var MenuItem = BS.MenuItem;

var AccountController = require('../../controllers/account');

var MenuButton = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  handleLogout: function(event) {
    event.preventDefault();
    AccountController.logout();
  },

  render: function() {
    return (
      <DropdownButton title={<Glyphicon glyph='menu-hamburger' />}>
          <MenuItem eventKey='1'>音樂設定</MenuItem>
          <MenuItem eventKey='2'>喵喵設定</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='3' onClick={this.handleLogout} >
              登出
          </MenuItem>
      </DropdownButton>
    );
  }
});
