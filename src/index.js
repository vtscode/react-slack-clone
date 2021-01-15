import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {Login,Register} from './components/Auth';
import registerServiceWorker from './registerServiceWorker';

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" render={(props) => <App {...props} />} />
      <Route path="/login" render={(props) => <Login {...props} />} />
      <Route path="/register" render={(props) => <Register {...props} />} />
    </Switch>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
