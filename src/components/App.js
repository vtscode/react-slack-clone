import React from 'react';
import './App.css';
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import { connect } from 'react-redux';

export const UserContext = React.createContext({})

const App = (props) => {
  const [user,setUser] = React.useState({});

  React.useEffect(() => {
    if(props.currentUser){
      console.log(props.currentUser)
      setUser(props.currentUser)
    }
  },[])

  return (
  <UserContext.Provider value={{user}}>
    <Grid columns="equal" className="app" style={{background : '#eee'}}>
      <ColorPanel />
      <SidePanel />
      <Grid.Column style={{marginLeft : 320}}>
        <Messages />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  </UserContext.Provider>
  )
}
const mapStateToProps = state => ({
  currentUser : state.user.currentUser
})
export default connect(mapStateToProps)(App);
