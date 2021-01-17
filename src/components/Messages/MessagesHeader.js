import React from 'react';
import { AppContext } from "../App";
import { MessageContext } from "./Messages";
import { Header,Segment,Input,Icon } from "semantic-ui-react";

const MessagesHeader = ({handleSearchChange}) => {
  const {appData} = React.useContext(AppContext);
  const {msgData} = React.useContext(MessageContext);

  return(
    <Segment clearing>
      {/* Chnnel title */}
      <Header
        as="h2" 
        fluid="true"
        floated="left" 
        style={{marginBottom : 0}}
      >
        <span>#{appData.channel.name}
          <Icon name="star outline" />
        </span>
        <Header.Subheader>{msgData.getAllUniqueUser} user{msgData.getAllUniqueUser > 1 ? 's' : ''}</Header.Subheader>
      </Header>
      {/* Channel search input */}
      <Header floated="right">
        <Input 
          loading={msgData.searchTerm.loading}
          onChange={handleSearchChange}
          size="mini" 
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  )
}

export default MessagesHeader;