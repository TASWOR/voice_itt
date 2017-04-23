import React from 'react';
import ReactDOM from 'react-dom';
import List from './List.js'
import './index.css';
import Apply from './Apply.js';

import { browserHistory, Router, Route } from 'react-router';
class Main extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
            <Route path="/" component={List}/>
            <Route path="/apply" component={Apply}/>

      </Router>
    );
  }
}
ReactDOM.render(<Main />, document.getElementById('root'));
