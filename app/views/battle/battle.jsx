var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var LoginPanel = require('../account').LoginPanel;

var Home = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {secondsElapsed: 0};
  },

  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },

  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  render: function() {
    return (
      <div>
          <div id="userdata">
              <a href="#/">Back</a><span id="getname"></span>
          </div>
          <div id="behind" style={{height:'100vh',width:'20%',float:'left','marginLeft':'1em',color: 'lightgray'}}>
              <button id="c4" type="button" className="cardFrame">c4</button>
              <br></br>
              <button id="c5" type="button" className="cardFrame">c5</button>
          </div>
          <div id="enemy" style={{height:'140px', width:'78%', float:'left'}}>
              <button id="e1" type="button" style={{marginLeft: '25%'}} className="cardFrame">e1</button>
              <button id="e2" type="button" className="cardFrame">e2</button>
              <button id="e3" type="button" className="cardFrame">e3</button>
          </div>
          <div> kiki 有 {this.state.secondsElapsed} 隻</div>
          <div id="battlemMessage" style={{height:'180px', width:'78%', float:'left'}}></div>
          <div id="front" style={{height:'140px', width:'78%', float:'left'}}>
              <button id="c1" type="button" style={{marginLeft: '25%'}} className="cardFrame">c1</button>
              <button id="c2" type="button" className="cardFrame">c2</button>
              <button id="c3" type="button" className="cardFrame">c3</button>
          </div>
          <div style={{height:'140px', width:'78%',float:'left',position:'relative'}}>
              <div id="battleFuncs">
                  <button id="sk1" type="button">技能1</button>
                  <button id="sk2" type="button">技能2</button>
                  <br></br>
                  <button id="sk3" type="button">技能3</button>
                  <button id="sk4" type="button">技能4</button>
              </div>
              <h1>
                  <a href="#/login">登入頁面</a>
              </h1>
              <a href="#/register">註冊頁面</a>
              <h1>登入的區塊可以重覆使用，自製的 html tag: LoignPanel </h1>
              <LoginPanel />
          </div>
      </div>
    );
  }
});
