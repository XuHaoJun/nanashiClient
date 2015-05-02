var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var BS = require('react-bootstrap');
var Panel = BS.Panel;
var Input = BS.Input;
var Button = BS.Button;

var AccountController = require('../../controllers/account');

var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/;
function isEmail(email) {
  if(email.length>254)
    return false;

  var valid = tester.test(email);
  if(!valid)
    return false;

  // Further checking of some things regex can't handle
  var parts = email.split("@");
  if(parts[0].length>64)
    return false;

  var domainParts = parts[1].split(".");
  if(domainParts.some(function(part) { return part.length>63; }))
    return false;

  return true;
}

var LoginPanel = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function () {
    return {
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
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

  validationPasswordConfirm: function() {
    var length = this.state.passwordConfirm.length;
    if (this.validationPassword() == 'success' &&
      this.state.passwordConfirm == this.state.password) {
        return 'success';
    } else if (length >= 1) {
      return 'error';
    }
    return '';
  },

  validationEmail: function() {
    var length = this.state.email.length;
    if (length > 0 && !isEmail(this.state.email)) {
      return 'error';
    } else if(isEmail(this.state.email)) {
      return 'success';
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

  handlePasswordConfirmChange: function() {
    this.setState({
      passwordConfirm: this.refs.passwordConfirmInput.getValue()
    });
  },

  handleEmailChange: function() {
    this.setState({
      email: this.refs.emailInput.getValue()
    });
  },

  checkRegister: function() {
    if (this.validationEmail() == 'success' &&
      this.validationPassword() == 'success' &&
      this.validationUsername() == 'success') {
        return false;
    } else {
      return true;
    }
  },

  handleRegisterClick: function() {
    var postForm = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
    };
    AccountController.register(postForm);
  },

  render: function() {
    return (
      <Panel header="會員註冊">
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
          <Input type='password'
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
          <Input type='password'
                 value={this.state.passwordConfirm}
                 placeholder=''
                 label='密碼確認'
                 help=''
                 bsStyle={this.validationPasswordConfirm()}
                 hasFeedback
                 ref='passwordConfirmInput'
                 groupClassName='group-class'
                 wrapperClassName='wrapper-class'
                 labelClassName='label-class'
                 onChange={this.handlePasswordConfirmChange} />
          <Input type='email'
                 value={this.state.email}
                 placeholder=''
                 label='信箱'
                 help=''
                 bsStyle={this.validationEmail()}
                 hasFeedback
                 ref='emailInput'
                 groupClassName='group-class'
                 wrapperClassName='wrapper-class'
                 labelClassName='label-class'
                 onChange={this.handleEmailChange} />
          <Button bsSize="large"
                  bsStyle="success"
                  onClick={this.handleRegisterClick} >
              註冊
          </Button>
      </Panel>
    );
  }
});
