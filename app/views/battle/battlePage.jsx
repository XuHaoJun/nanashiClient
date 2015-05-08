var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Button = BS.Button;

var BattlePage = module.exports = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {secondsElapsed: 180};
  },

  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed - 1});
  },

  componentDidMount: function() {
    setInterval(this.tick, 1000);
  },

  componentWillUnmount: function() {
    clearInterval(this.tick);
  },

  render: function() {
    return (
      <Grid>
          <Row>
              <p>
                  倒數時間：{this.state.secondsElapsed}
              </p>
          </Row>
          <Row>
              <Colm md={4}>
                  <div className="center-block">
                      1
                  </div>
              </Colm>
              <Colm md={4}>
                  <div className="center-block">
                      1
                  </div>
              </Colm>
              <Colm md={4}>
                  <div className="center-block">
                          1
                  </div>
              </Colm>
          </Row>
          <nav className="navbar navbar-fixed-bottom"
               style={{marginBottom: '6vh'}}>
              <Grid>
                  <Row>
                      <Colm md={4}>
                          2
                      </Colm>
                      <Colm md={4}>
                          2
                      </Colm>
                      <Colm md={4}>
                          2
                      </Colm>
                  </Row>
                  <Row>
                      <Colm md={6}>
                          <Button bsSize="large">
                              技能1
                          </Button>
                          <Button bsSize="large">
                              技能2
                          </Button>
                          <Button bsSize="large">
                              技能3
                          </Button>
                          <Button bsSize="large">
                              技能4
                          </Button>
                      </Colm>
                      <Colm md={6}>
                          <Button bsSize="large">
                              替換
                          </Button>
                          <Button bsSize="large" href="#/stage">
                              逃跑
                          </Button>
                      </Colm>
                  </Row>
              </Grid>
          </nav>
      </Grid>
    );
  }
});
