import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router'
var $ = require("jquery");
import io from 'socket.io-client';
var Select = require('react-select');
import './App.css';
class List extends Component {
  constructor(props){
    super(props);
    this.state={
      users:[],
      files:[],
      text:'',
      selectedUser:'',
      selectFile:''
    }
  }


readText(repliesFileName)
{
  var component=this;
  $.get ('users/'+this.state.selectedUser+'/replies/'+repliesFileName , function(data)
{
  var selectFile = repliesFileName
var text = data.replyText;
var likelihood = data.likelihoodText
component.setState({
  text,
  likelihood,
  selectFile
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
      var files = data.fileNames.map(replyInfo=>
      {
        var name = replyInfo.timestamp+ " likelihood " + replyInfo.likelihood+ " text " + replyInfo.text;

        return {value:replyInfo.timestamp,label:name}
      });
      var socket = io('/users/' + name + '/replies');
      // var socket = io();
      socket.on('connection', socket => {
        console.log('connected');
      });
      socket.on('update', data => {
        let option = {
          label: data,
          value: data
        };
          socket.on('disconnect', function(){
          socket.disconnect();
         });
        component.setState({
          files: [...component.state.files, option].sort(o => o.label) //spreading
        });
      });
      component.setState({
        files,
        selectedUser
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
      <Select
      placeholder = {'Pick file'}
      clearable= {false}
      autosize  ={false}
      value={this.state.selectFile}
      options={this.state.files}
      onChange={val =>this.readText(val.value)}
      /></div>
        <div id="text">
      {this.state.text}

      {this.state.likelihood}
      </div>
      </div>
    );
  }
}

export default List;
