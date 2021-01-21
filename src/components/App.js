import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { Grid } from "semantic-ui-react";
import Messages from "./Messages/Messages";
import { useCustomReducer } from "../hooks";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import ColorPanel from "./ColorPanel/ColorPanel";

export const AppContext = React.createContext({})
const initData = {
  user : {},
  channel : {},
  isPrivateChannel :false
}
const App = (props) => {
  const [dataReducer,reducerFunc] = useCustomReducer(initData);
  
  React.useEffect(() => {
    if(props.currentChannel.id){
      reducerFunc('channel',props.currentChannel)
    }
  },[props.currentChannel.id])
  React.useEffect(() => {
    reducerFunc('isPrivateChannel',props.isPrivateChannel,'conventional')
  },[props.isPrivateChannel])
  React.useEffect(() => {
    if(props.currentUser){
      reducerFunc('user',props.currentUser)
    }
  },[])

  return (
  <AppContext.Provider 
    value={{
        appData : dataReducer,
        appDispatch : reducerFunc
      }}
    >
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
  </AppContext.Provider>
  )
}
const mapStateToProps = state => ({
  currentUser : state.user.currentUser,
  currentChannel : state.channel.currentChannel,
  isPrivateChannel : state.channel.isPrivateChannel
})
export default connect(mapStateToProps)(App);
