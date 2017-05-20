import React, { Component } from 'react';
import './App.css';
import Wavesurfer from 'react-wavesurfer';
window.WaveSurfer = require("wavesurfer.js");
let Timeline = require("react-wavesurfer/lib/plugins/timeline").default;
let Regions = require("react-wavesurfer/lib/plugins/regions").default;

class Player extends Component {
  constructor(props) {
      super(props);
      this.state={
        playing: false,
        pos: 0.0000001
      }
      this.handlePosChange = this.handlePosChange.bind(this);
      this.resetPostion = this.resetPostion.bind(this);
    }

    resetPostion(){
      this.setState({
        pos: 0.0000001,
        playing: !this.state.playing
      });
    }

    handlePosChange(e) {
      this.setState({
        pos: e.originalArgs[0]
      });
    }

    render() {
      return (this.props.sound && this.props.selectedUser &&
          <div>
          <Wavesurfer
              audioFile={"http://localhost:3000/users/"+this.props.selectedUser+"/recognize/"+this.props.sound+".wav"}
              pos={this.state.pos}
              onPosChange={this.handlePosChange}
              playing={this.state.playing}>

              <Timeline
                options={{
                     timeInterval: 0.25,
                     primaryLabelInterval: 4,
                     secondaryLabelInterval:2,
                     height: 30,
                     primaryFontColor: '#00f',
                     primaryColor: '#00f'
                   }}
              />

              <Regions regions={{
                One: {
                  start: this.props.firstRegionStart,
                  end: this.props.firstRegionEnd
                },
                Two: {
                  start: this.props.secondRegionStart,
                  end: this.props.secondRegionEnd
                }
              }} />

              <button onClick={this.resetPostion}>Play/Stop</button>
          </Wavesurfer>
          </div>
      ) || null;
    }
  }
export default Player;
