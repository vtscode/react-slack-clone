import React from 'react';
import moment from "moment";
import { AppContext } from "../App";
import { Comment,Image } from "semantic-ui-react";

export default ({ msg }) => {
  const {appData} = React.useContext(AppContext);
  const isOwnMessage = (msg) => msg.user.id === appData.user.uid ? 'message__self' : '';

  const timeFromNow = dt => moment(dt).fromNow();
  const isFile = msg => msg.hasOwnProperty('image') && !msg.hasOwnProperty('content');

  return(
    <Comment>
      <Comment.Avatar src={msg.user.avatar} />
      <Comment.Content 
        className={isOwnMessage(msg)}
      >
        <Comment.Author as="a">{msg.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(msg.timestamp)}</Comment.Metadata>
        {isFile(msg) ? 
          <Image src={msg.image} className="message__image" /> : 
          <Comment.Text>{msg.content}</Comment.Text>
        }
      </Comment.Content>
    </Comment>
  );
}