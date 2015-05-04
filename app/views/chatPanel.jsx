var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var BS = require('react-bootstrap');
var Input = BS.Input;

var ChatModel = require('../models/chat');
var ChatController = require('../controllers/chat');

var ChatPanel = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps: function() {
    return {
      maxMessage: 25
    };
  },

  getInitialState: function() {
    return {
      showTextInput: false,
      messages: ChatModel.getMessages()
    };
  },

  componentDidMount: function() {
    ChatModel.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ChatModel.removeChangeListener(this._onChange);
  },

  componentDidUpdate: function() {
    var chatMessages = this.refs.chatMessages.getDOMNode();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  },

  _onChange: function() {
    this.setState({messages: ChatModel.getMessages()});
  },

  handleSendMessage: function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      ChatController.sendMessage(this.refs.textInput.getValue());
      this.refs.textInput.getInputDOMNode().value = '';
    }
  },

  render: function() {
    var messages = this.state.messages.map(function(msg, i) {
      return (
        <div key={i}>
            { msg }
        </div>
      );
    }, this);
    return (
      <div style={{position: 'relative', height: '100%', width: '100%'}}>
          <div ref="chatMessages"
               style={{position: 'absolute',
                       bottom: '50px',
                       width: '100%',
                       height: '100%',
                       overflow: 'auto',
                       backgroundColor: 'rgb(237, 239, 244)',
                       border: '1px solid rgba(29, 49, 91, .3)'
                      }}>
              { messages }
          </div>
          <div style={{position: 'absolute', bottom: '0px', width: '100%'}}>
              <Input ref="textInput" type="text"
                     onKeyDown={this.handleSendMessage} />
          </div>
      </div>
    );
  }
});
