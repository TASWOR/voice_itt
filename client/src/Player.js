import React, { Component } from 'react';
import './App.css';
import Wavesurfer from 'react-wavesurfer';
window.WaveSurfer = require("wavesurfer.js");
let Timeline = require("react-wavesurfer/lib/plugins/timeline").default;
let Regions = require("react-wavesurfer/lib/plugins/regions").default;

class Player extends Component {

    render() {
      return ((this.props.sound && this.props.selectedUser) &&
          <div>
          <Wavesurfer
              audioFile={"/users/"+this.props.selectedUser+"/recognize/"+this.props.sound+".wav"}
              pos={this.props.audioState.pos}
              onPosChange={this.props.handlePosChange}
              playing={this.props.audioState.playing}>

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
                  end: this.props.firstRegionEnd,
                  drag:false,
                  resize:false,
                  color: 'hsla(255, 10%, 10%, 0.3)'
                },
                Two: {
                  start:this.props.secondRegionStart,
                  end:this.props.secondRegionEnd,
                  drag:false,
                  resize:false,
                  color: 'hsla(5, 10%, 10%, 0.3)'
                }
              }} />

              <button onClick={this.props.resetPostion}>Play/Stop</button>
          </Wavesurfer>
          </div>
          || null
      );
    }
  }
export default Player;
