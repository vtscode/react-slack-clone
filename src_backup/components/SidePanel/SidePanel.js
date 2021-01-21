import React from 'react';
import Channels from "./Channels";
import UserPanel from "./UserPanel";
import { Menu } from "semantic-ui-react";
import DirectMessages from "./DirectMessages";

class SidePanel extends React.Component{
  render(){
    return(
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{background : '#4c3c4c', fontSize : '1.2rem'}}
      >
        <UserPanel />
        <Channels />
        <DirectMessages />
      </Menu>
    )
  }
}

export default SidePanel;