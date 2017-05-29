import React, { Component } from 'react';
var $ = require("jquery");
import io from 'socket.io-client';
var Select = require('react-select');
import Switch from 'react-toggle-switch'
import SoundInfo from './SoundInfo.js';
import Player from './Player.js'
import JsonRead from './JsonRead.js'
import Table from './Table.js'
import './App.css';

class List extends Component {
  constructor(props){
    super(props);
    this.state={
      users:[],
      files:[],
      text:'',
      selectedUser:null,
      selectFile:'',
      error:'',
      switchUpdate:true,
      sound:null,
      contents :'',
      likelihoodFilterOperation:'<=',
      likelihoodFilterValue:'',
      socketForUpdate:null,
      playing: false,
      pos: 0.001,
      name
    }
  }

readText(repliesFileName){
  var component=this;
  $.get ('users/'+this.state.selectedUser+'/replies/'+repliesFileName , function(data){
    component.setState({
      sound:null
    })

    component.setState({
      text:data.replyText,
      likelihood:data.likelihoodText,
      selectFile:repliesFileName,
      error:data.error,
      sound:data.sound,
      contents:data,
      name:data.name,
      playing: false,
      pos:0.00001
    })
  })
}

  addName(name)  {
    var component = this;
    $.get ('users/'+name+'/replies', data => {
      if (this.state.socketForUpdate !=null)
      {
        this.state.socketForUpdate.close()
        this.state.socketForUpdate.disconnect()
      }
      var socketForUpdate = io('/users/' + name + '/replies');
      socketForUpdate.on('connection', socketForUpdate => {
      });
      socketForUpdate.on('disconnect', function(){
      socketForUpdate.disconnect();
     });
      socketForUpdate.on('update', data => {
         if(component.state.switchUpdate===true)
         {
           component.readText(data.timestamp);
         }
        component.setState({
          files: [...component.state.files, data]
        });
      });
      component.setState({
        files:data.fileNames,
        selectedUser:name,
        sound:null,
        playing: false,
        pos: 0.001,
        socketForUpdate
      });
    });
  }

  handlePosChange = e => {
    this.setState({
      pos: e.originalArgs[0]
    });
  }

  resetPostion = () => {
    this.setState({
      pos: 0.0000001,
      playing: !this.state.playing
    });
  }

  updateNames(){
    var component = this;
    $.get('users/names', function(data){
      var users = data.userNames.map(name => {
        return {value:name,label:name}
      });
      component.setState({ //
        users
      });
    });
  }
  componentWillMount(){
    this.updateNames();
  }
  render() {
  return (
      <div>
              <div id="menu">
              <Select
              placeholder={'Pick user'}
              clearable={false}
              autosize={false}
              value={this.state.selectedUser}
              options={this.state.users}
              onChange={val =>this.addName(val.value)}
              />
              <br />
              <Table
                files={this.state.files}
                onRowClick={this.readText.bind(this)}
              />
              </div>

              <div id="center">
              <SoundInfo
                name={this.state.name}
                text={this.state.text}
                error={this.state.error}
                likelihood={this.state.likelihood}
                sound={this.state.sound} />
              <Player
                sound={this.state.sound}
                selectedUser={this.state.selectedUser}
                firstRegionStart={this.state.contents.jsonInfo && this.state.contents.jsonInfo.vad_on_time_in_samples+this.state.contents.jsonInfo.contents.time_offset_in_probe[0]}
                firstRegionEnd={this.state.contents.jsonInfo && this.state.contents.jsonInfo.vad_on_time_in_samples+this.state.contents.jsonInfo.contents.time_offset_in_probe[1]}
                secondRegionStart={this.state.contents.jsonInfo && this.state.contents.jsonInfo.vad_on_time_in_samples}
                secondRegionEnd={this.state.contents.jsonInfo && this.state.contents.jsonInfo.vad_off_time_in_samples}
                audioState={{pos: this.state.pos, playing: this.state.playing}}
                resetPostion={this.resetPostion}
                handlePosChange={this.handlePosChange}
              />
                </div>
            <div id="right">
              <div id="switch">
                    <Switch on={this.state.switchUpdate} onClick={()=>{
                      this.setState({
                        switchUpdate: !this.state.switchUpdate
                      });
                    }}>
                      <i className="some-icon"/>
                    </Switch>
                    <br/>
                      Off update/On update
                </div>{this.state.contents.jsonInfo&&
                    <JsonRead
                    jsonInfo={this.state.contents.jsonInfo}
                    />}
            </div>
            </div>
    );
  }
}
export default List;
