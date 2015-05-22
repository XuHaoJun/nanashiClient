var React = require('react/addons');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Velocity = require('velocity-animate');
var BS = require('react-bootstrap');
var Panel = BS.Panel;
var Input = BS.Input;
var Button = BS.Button;
var ReactToastr = require('react-toastr');
var ToastContainer = ReactToastr.ToastContainer;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.jQuery);

var AccountController = require('../../controllers/account');

var AccountModel = require('../../models/account');

var LoginPanel = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount: function() {
    AccountModel.addErrorListener(this._onError);
  },

  componentWillUnmount: function() {
    AccountModel.removeErrorListener(this._onError);
  },

  _onError: function() {
    var loginError = AccountModel.getLastErrorByName('login');
    if (loginError) {
      this.refs.container.error("帳號或密碼錯誤", "登入失敗");
      this.setState({logining: false});
    }
  },

  getInitialState: function () {
    return {
      username: '',
      password: '',
      logining: false
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

  handlePasswordChange: function(e) {
    this.setState({
      password: this.refs.passwordInput.getValue()
    });
  },

  handleEnterKeyDown: function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      this.handleLoginClick();
    }
  },

  handleLoginClick: function() {
    if (this.validationPassword() == 'error' || this.validationPassword() == 'error') {
      this.refs.container.warning("帳號或密碼長度不足", "登入警告");
    } else {
      this.setState({logining: true});
      AccountController.login(this.state.username, this.state.password);
    }
  },

  scaleStart: function(event) {
    var dom = event.target;
    Velocity(dom, {scale: 1.30}, {duration: 250});
  },

  scaleReverse: function(event) {
    var dom = event.target;
    Velocity(dom, 'stop');
    Velocity(dom, 'reverse');
  },

  render: function() {
    return (
      <div>
          <ToastContainer toastMessageFactory={ToastMessageFactory} ref="container" className="toast-top-right" />
          <Panel header="會員登入">
              <Input type='text'
                     autoFocus
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
                     onKeyDown={this.handleEnterKeyDown}
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
                     onKeyDown={this.handleEnterKeyDown}
                     onChange={this.handlePasswordChange} />
              <Button bsSize="large"
                      block
                      disabled={this.state.logining}
                      onClick={this.handleLoginClick} >
                  {this.state.logining ? '登入中....' : '登入'}
              </Button>
              <div style={{marginTop: '24px'}}>
                  <a href="/auth/facebook">
                      <img src="/images/fbLogin.png"
                           style={{width: '45px', height: '45px'}}
                           onMouseEnter={this.scaleStart}
                           onMouseLeave={this.scaleReverse}
                      />
                  </a>
                  <a href="/auth/google" style={{marginLeft: '12px'}}>
                      <img src="/images/googleLogin.png"
                           style={{width: '45px', height: '45px'}}
                           onMouseEnter={this.scaleStart}
                           onMouseLeave={this.scaleReverse}
                      />
                  </a>
              </div>
          </Panel>
      </div>
    );
  }
});
