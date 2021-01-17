import React from 'react';
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import { Segment,Comment } from "semantic-ui-react";

const Messages = () => {
  return(
    <React.Fragment>
      <MessagesHeader/> 
      <Segment>
        <Comment.Group className="messages">
          {/* Mess */}
        </Comment.Group>
      </Segment>

      <MessageForm /> 
    </React.Fragment>
  )
}

export default Messages;