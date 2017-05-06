import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router'
var $ = require("jquery");
import io from 'socket.io-client';
var Select = require('react-select');
import './App.css';
import ReactTable from 'react-table';
class Po extends Component {
  render() {
    const data = [{
      name: 'Tanner Linsley',
      likelihood: 26,
      friend: {
        name: 'Jason Maurer',
        likelihood: 23,
        text: 'asd'
      }
    },

    {
      name: 'sdasd Linsley',
      likelihood: 2.6,
      text: 'asdq'
    },
    {
      name: 'Adasd Linsley',
      likelihood: 26,
      text: '121asd'
    },
    {
      name: 'adasd Linsley',
      likelihood: 20,
      text: '6sasd'

    },
    {
      name: 'Bdasd Linsley',
      likelihood: 21,
      text: 'basd'
    },
    {
      name: 'bdasd Linsley',
      likelihood: 26,
      text: 'Aasd'
    }
  ]


    const columns = [{
      header: 'Name File',
      accessor: 'name' // String-based value accessors!
    }, {
      header: 'likelihood',
      accessor: 'likelihood',
      render: props => <span className='number'>{props.value}</span> // Custom cell components!
    },{
      header: 'text',
      accessor: 'text'
    } ]
    return(
    <ReactTable
      data={data}
      columns={columns}
    />
  )
  }
}
export default Po;
