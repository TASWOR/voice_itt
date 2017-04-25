import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router'
var $ = require("jquery");
import io from 'socket.io-client';
import ReactTable from 'react-table';
var Select = require('react-select');
import Switch from 'react-toggle-switch'
import Player from './Player.js'
import './App.css';
import Wavesurfer from 'react-wavesurfer';
class List extends Component {
  constructor(props){
    super(props);
    this.state={
      users:[],
      files:[],
      text:'',
      selectedUser:'',
      selectFile:'',
      error:'',
      switchUpdate:true,
      sound:'',
      playing: false,
      pos: 0
    }
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
    this.resetPostion = this.resetPostion.bind(this);
  }


  resetPostion(){
    this.setState({
      pos: 0.0000001,
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

readText(repliesFileName)
{
  var component=this;
  $.get ('users/'+this.state.selectedUser+'/replies/'+repliesFileName , function(data)
{
  var selectFile = repliesFileName
var text = data.replyText;
var likelihood = data.likelihoodText;
var error = data.error;
var sound = data.sound;
component.setState({
  text,
  likelihood,
  selectFile,
  error,
  sound,
  playing: false,
  pos: 0.001
})
})
}

  addName(name)
  {
    var qqq = io;
    console.log(qqq);
    var component = this;
    $.get ('users/'+name+'/replies', function(data)
    {
      var selectedUser = name;
      var files = data.fileNames;
      var socket = io('/users/' + name + '/replies');
      // var socket = io();
      socket.on('connection', socket => {
        console.log('connected');
      });
      socket.on('disconnect', function(){
      socket.disconnect();
     });
      socket.on('update', data => {
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
        pos: 0.001
      });
    });
  }



  updateNames(){
    var component = this;
    $.get('users/names', function(data)
    {
      var users=data.userNames.map(name=>
      {
        return {value:name,label:name}
      });
      component.setState({ //
        users
      });
    });
  }
  componentWillMount()
  {
    this.updateNames();
    console.log(this.state.users);
  }
  render() {
    const columns = [{
      header: 'Name File',
      accessor: 'timestamp' // String-based value accessors!
    }, {
      header: 'likelihood',
      accessor: 'likelihood',
      render: props => <span className='number'>{props.value}</span> // Custom cell components!
    },{
      header: 'text',
      accessor: 'text'
    },{
      header: 'sound',
      accessor: 'sound'
    } ]
    //onMount
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
      <ReactTable
        defaultPageSize={15}
        data={this.state.files}
        columns={columns}
        getTdProps={(state, rowInfo, column, instance) => {
          return {
            onClick: e => {
            this.readText(rowInfo.row.timestamp);

            }
          }
        }
      }

      />
      <div id="switch">

            <Switch on={this.state.switchUpdate} onClick={()=>{
              this.setState({
                switchUpdate: !this.state.switchUpdate
              });
            }}>
              <i class="some-icon"/>
            </Switch>

        </div>
      </div>

              <div id="text">
              {this.state.sound}
              <br/>
              {this.state.error != "" ?" error: " + this.state.error : ""}<br/>
              {console.log(this.state.users)}
              {console.log(this.state.sound)}
              <Wavesurfer
                audioFile={this.state.sound != null ? "http://localhost:3000/users/"+this.state.selectedUser+"/recognize/"+this.state.sound+".wav" : undefined}
                pos={this.state.pos}
                onPosChange={this.handlePosChange}
                playing={this.state.playing}
              />
              <button onClick={this.handleTogglePlay}>Play/Pause</button>
              <button onClick={this.resetPostion}>Reset</button>
            </div>
            </div>
    );
  }
}

export default List;
