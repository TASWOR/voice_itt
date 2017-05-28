import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router'
var $ = require("jquery");
import io from 'socket.io-client';
var Select = require('react-select');
import Switch from 'react-toggle-switch'
import SoundInfo from './SoundInfo.js';
import Player from './Player.js'
import JsonRead from './JsonRead.js'
import Table from './Table.js'
import './App.css';
import { Map } from 'immutable'

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
      name
    }
  }

readText(repliesFileName){
  var component=this;
  $.get ('users/'+this.state.selectedUser+'/replies/'+repliesFileName , function(data){
    var selectFile = repliesFileName
    var text = data.replyText;
    var likelihood = data.likelihoodText;
    var error = data.error;
    var sound = data.sound;
    var contents =data;
    var name = data.name;

    component.setState({
      sound:null
    })

    component.setState({
      text,
      likelihood,
      selectFile,
      error,
      sound,
      contents,
      name
    })
  })
}

  addName(name)  {
    var component = this;
    $.get ('users/'+name+'/replies', data => {
      var selectedUser = name;
      var files = data.fileNames;
      if (this.state.socketForUpdate !=null)
      {
        this.state.socketForUpdate.close()
        this.state.socketForUpdate.disconnect()
        console.log("closing socket for "+this.state.socketForUpdate)
      }
      var socketForUpdate = io('/users/' + name + '/replies');
      socketForUpdate.on('connection', socketForUpdate => {
        console.log('connected');
      });
      socketForUpdate.on('disconnect', function(){
      socketForUpdate.disconnect();
     });
      socketForUpdate.on('update', data => {
         if(component.state.switchUpdate==true)
         {
           component.readText(data.timestamp);
         }
        component.setState({
          files: [...component.state.files, data]
        });
      });
      component.setState({
        files,
        selectedUser,
        sound:null,
        playing: false,
        pos: 0.001,
        socketForUpdate
      });
    });
  }
  updateNames(){
    var component = this;
    $.get('users/names', function(data){
      var users=data.userNames.map(name=>{
        return {value:name,label:name}
      });
      component.setState({ //
        users
      });
    });
  }
  componentWillMount(){
    this.updateNames();
    console.log(this.state.users);
  }
  render() {
  return (
      <div>
              <div id ="menu">
              <Select
              placeholder = {'Pick user'}
              clearable= {false}
              autosize  ={false}
              value={ this.state.selectedUser}
              options={this.state.users}
              onChange={val =>this.addName(val.value)}
              />
              <br />
              <Table
                files = {this.state.files}
                onRowClick = {this.readText.bind(this)}
              />
              </div>

              <div id="center">
              <SoundInfo
                name = {this.state.name}
                text = {this.state.text}
                error = {this.state.error}
                likelihood = {this.state.likelihood}
                sound = {this.state.sound} />
              <Player
                sound = {this.state.sound}
                selectedUser = {this.state.selectedUser}
                firstRegionStart = {this.state.contents.jsonInfo && this.state.contents.jsonInfo.vad_on_time_in_samples}
                firstRegionEnd = {this.state.contents.jsonInfo && this.state.contents.jsonInfo.vad_off_time_in_samples}
                secondRegionStart = {this.state.contents.jsonInfo && this.state.contents.jsonInfo.contents.time_offset_in_probe[0]}
                secondRegionEnd = {this.state.contents.jsonInfo && this.state.contents.jsonInfo.contents.time_offset_in_probe[1]} />
                </div>
            <div id="right">
              <div id="switch">
                    <Switch on={this.state.switchUpdate} onClick={()=>{
                      this.setState({
                        switchUpdate: !this.state.switchUpdate
                      });
                    }}>
                      <i class="some-icon"/>
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
