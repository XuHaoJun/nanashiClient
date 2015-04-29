var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var BS = require('react-bootstrap');
var Panel = BS.Panel;
var Input = BS.Input;
var Button = BS.Button;

var AccountController = require('../../controllers/account');

var LoginPanel = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function () {
    return {
      username: '',
      password: '',
    };
  },

  validationUsername: function() {
    var length = this.state.username.length;
    if (length >= 4) {
      return 'success';
    } else if (length >= 1) {
      return 'error';
    }
    return '';
  },

  validationPassword: function() {
    var length = this.state.password.length;
    if (length >= 4) {
      return 'success';
    } else if (length >= 1) {
      return 'error';
    }
    return '';
  },

  handleUsernameChange: function() {
    this.setState({
      username: this.refs.usernameInput.getValue()
    });
  },

  handlePasswordChange: function() {
    this.setState({
      password: this.refs.passwordInput.getValue()
    });
  },

  handleLoginClick: function() {
    AccountController.login(this.state.username, this.state.password);
  },

  render: function() {
    return (
      <Panel header="會員登入">
          <Input type='text'
                 value={this.state.username}
                 placeholder=''
                 label='帳號'
                 help=''
                 bsStyle={this.validationUsername()}
                 hasFeedback
                 ref='usernameInput'
                 groupClassName='group-class'
                 wrapperClassName='wrapper-class'
                 labelClassName='label-class'
                 onChange={this.handleUsernameChange} />
          <Input type='text'
                 value={this.state.password}
                 placeholder=''
                 label='密碼'
                 help=''
                 bsStyle={this.validationPassword()}
                 hasFeedback
                 ref='passwordInput'
                 groupClassName='group-class'
                 wrapperClassName='wrapper-class'
                 labelClassName='label-class'
                 onChange={this.handlePasswordChange} />
          <Button bsSize="large"
                  onClick={this.handleLoginClick} >
              登入
          </Button>
      </Panel>
    );
  }
});
