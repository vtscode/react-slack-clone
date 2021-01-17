import React from 'react';
import { Segment,Button,Input } from "semantic-ui-react";

const MessageForm = () => {
  return(
    <Segment className="message__form">
      <Input
        fluid
        style={{marginBottom : '0.7em'}}
        label={<Button icon="add" />}
        labelPosition="left"
        placeholder="Write your message"
        name="message"
      />
      <Button.Group icon widths="2">
        <Button 
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
        />
        <Button 
          color="green"
          content="Upload Media"
          labelPosition="right"
          icon="cloud"
        />
      </Button.Group>
    </Segment>
  )
}

export default MessageForm;