import React, { Component } from 'react';
import './App.css';
import JSONTree from 'react-json-tree';

class JsonRead extends Component {
  constructor(props) {
      super(props);
      this.state={
      }
    }



    render() {
      const theme = {base00: '#272822'};
      return (
        <JSONTree
        data={this.props.jsonInfo}
        theme={theme} />
      );
      }
    }

export default JsonRead;
