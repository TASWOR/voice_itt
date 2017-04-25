import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Wavesurfer from 'react-wavesurfer';
class Player extends Component {
  constructor(props) {
      super(props);

      this.state = {
        playing: false,
        pos: 0
      };
      this.handleTogglePlay = this.handleTogglePlay.bind(this);
      this.handlePosChange = this.handlePosChange.bind(this);
      this.resetPostion = this.resetPostion.bind(this);
    }
    resetPostion(){
      this.setState({
        pos: 0.001,
        playing:false
      });
    }
    handleTogglePlay() {
      this.setState({
        playing: !this.state.playing
      });
    }
    handlePosChange(e) {
      this.setState({
        pos: e.originalArgs[0]
      });
    }
    render() {
      return (
        <div>

          <Wavesurfer
            audioFile={'http://localhost:3000/users/demo_ebony/recognize/1483542422135.wav'}
            pos={this.state.pos}
            onPosChange={this.handlePosChange}
            playing={this.state.playing}
          />
          <button onClick={this.handleTogglePlay}>Play/Pause</button>
          <button onClick={this.resetPostion}>Reset</button>
        </div>
        );
    }
  }
export default Player;
