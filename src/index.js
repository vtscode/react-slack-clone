import React from 'react';
import firebase from "./firebase";
import ReactDOM from 'react-dom';
import App from './components/App';
import Spinner from "./Spinner";
import {Login,Register} from "./components/Auth";
import registerServiceWorker from './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css';

import { BrowserRouter as Router, Switch, Route,withRouter } from "react-router-dom";

import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import {setUser,clearUserFromGlobState} from "./actions";
import rootReducer from "./reducers";
const store = createStore(rootReducer,composeWithDevTools());

class Root extends React.Component {
  
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.props.setUser(user)
        this.props.history.push('/');
      }else{
        this.props.history.push('/login');
        this.props.clearUserFromGlobState();
      }
    })
  }
  // componentDidUpdate(prevProps, prevState, snapshot){
  //   console.log('prev Props',prevProps)
  //   console.log('prev State',prevState)
  //   console.log('snapshot',snapshot)
  // }
  
  render(){
    return this.props.isLoading ? <Spinner /> : (
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
    );
  }
}

const mapStateToProps = state => ({ isLoading : state.user.isLoading})
const RootwithRouter = withRouter(connect(mapStateToProps,{ setUser,clearUserFromGlobState })(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootwithRouter />
    </Router>
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
