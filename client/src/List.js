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
import JSONTree from 'react-json-tree';
window.WaveSurfer = require("wavesurfer.js");
let Timeline = require("react-wavesurfer/lib/plugins/timeline").default;
let Regions = require("react-wavesurfer/lib/plugins/regions").default;

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
      name
    }
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
    var contents =data;
    var name = data.name;
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
      accessor: 'timestamp', // String-based value accessors!
      filterMethod: (filter, row) => (row[filter.id].includes(filter.value))
    }, {
      header: 'text',
      accessor: 'text',// Custom cell components!
      filterMethod: (filter, row) => (row[filter.id].includes(filter.value))
    },{
      header: 'likelihood',
      accessor: 'likelihood',
      filterMethod: (filter, row) => {
      console.log({filter, row});
      if("all" == filter.value.operation){
       return true;
       }
       if(row[filter.id] == "Empty text"){
         return false;
       }
       if("<=" == filter.value.operation){
         return row[filter.id] <= filter.value.value;
       }
       if(">" == filter.value.operation){
         return row[filter.id] > filter.value.value;
       }

       if(">=" == filter.value.operation){
         return row[filter.id] >= filter.value.value;
       }
       if("=" == filter.value.operation){
         return row[filter.id] == filter.value.value;
       }
       if("<" == filter.value.operation){
         return row[filter.id] < filter.value.value;
       }
},
filterRender: ({filter, onFilterChange}) =>{
  return (
  <div>
  <select
    onChange={
      event => {
        var value = event.target.value;
        //this.setState({likelihoodFilterOperation: value})
        onFilterChange({operation: value, value: (filter ? filter.value.value : 0) })
      }
    }
    value={filter ? filter.value.operation : 'all'}>
    <option value="all">All</option>
    <option value="=">=</option>
    <option value=">">&gt;</option>
    <option value="<=">&lt;=</option>


    <option value="<">&lt;</option>
    <option value=">=">&gt;=</option>
  </select>
  <input
    onChange={
      event => {
        var value = event.target.value;
        onFilterChange({operation: (filter ? filter.value.operation : 'all'), value: value})
      }
    }
    value={filter ? filter.value.value : 0}/>
  </div>
)}
}]

const theme = {base00: '#272822'};
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
      showPagination={false}
       showFilters={true}
        data={this.state.files}
        columns={columns}
        showPagination={true}
        showPageSizeOptions = {false}
        defaultPageSize={13}
        getTdProps={(state, rowInfo, column, instance) => {
          return {
            onClick: e => {
            this.readText(rowInfo.row.timestamp);

            }
          }
        }
      }

      />

      </div>

              <div id="center">
              <font color="red">{this.state.name != "" ?"Name: " + this.state.name : " "}</font><br/>
              {this.state.text}
              <br/>
              {this.state.likelihood}
              <br/>
              {this.state.error != "" ?" error: " + this.state.error : ""}
              {this.state.sound != null ?" Sound: " + this.state.sound : ""}<br/>
              <Player
                sound = {this.state.sound}
                selectedUser = {this.state.selectedUser}
                firstRegionStart = {this.state.contents.jsonInfo && this.state.contents.jsonInfo.vad_on_time_in_samples}
                firstRegionEnd = {this.state.contents.jsonInfo && this.state.contents.jsonInfo.vad_off_time_in_samples}
                secondRegionStart = {this.state.contents.jsonInfo && this.state.contents.jsonInfo.contents.time_offset_in_probe[0]}
                secondRegionEnd = {this.state.contents.jsonInfo && this.state.contents.jsonInfo.contents.time_offset_in_probe[1]}

              />

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

              </div>

            <JSONTree data={this.state.contents.jsonInfo}
            theme={theme} />


            </div>
        </div>
    );
  }
}

export default List;
