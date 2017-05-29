import React, { Component } from 'react';
import './App.css';

class SoundInfo extends Component {

    render() {
      return (
        <div>
        <font color="red">{this.props.name !== "" ?"Name: " + this.props.name : " "}</font><br/>
        {this.props.text}
        <br/>
        {this.props.likelihood}
        <br/>
        {this.props.sound !== null ?" Sound: " + this.props.sound : ""}
        <br/>
        {this.props.error !== "" ?" error: " + this.props.error : ""}
        <br/>
        </div>
      )
      }
}

export default SoundInfo;
