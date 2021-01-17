import React from 'react';
import firebase from "../../firebase";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import MsgComp from "./MsgComp";
import { useCustomReducer } from "../../hooks";
import { Segment,Comment } from "semantic-ui-react";
import { AppContext } from "../App";

export const MessageContext = React.createContext({});
const initData = {
  messagesRef : firebase.database().ref('messages'),
  allMsg : [],
  msgLoad : true
}
const Messages = () => {
  const {appData} = React.useContext(AppContext)
  const [dataReducer,reducerFunc] = useCustomReducer(initData);

  const addListeners = dt => {
    let loadedMsg = [];
    dataReducer.messagesRef.child(dt).on('child_added', snap => {
      loadedMsg.push(snap.val());
      reducerFunc('allMsg',loadedMsg,'conventional');
      reducerFunc('msgLoad',false,'conventional');
      return;
    })
  }

  React.useEffect(() => {
    if(appData.user && appData.channel.id){
      addListeners(appData.channel.id)
    }
  },[appData.channel.id])

  const isUploadingFile = percent => {
    if(percent > 0 && percent < 100) {
      return true
    }
    return false;
  }

  return(
    <MessageContext.Provider 
      value={{
        msgData : dataReducer,
        msgDispatch : reducerFunc
      }}
    >
      <MessagesHeader/> 
      <Segment>
        <Comment.Group className={isUploadingFile ? "messages__progress": "messages"}>
          {dataReducer.allMsg.length && dataReducer.allMsg.map(x => <MsgComp key={x.timestamp} msg={x} />)}
        </Comment.Group>
      </Segment>

      <MessageForm isUploadingFile={isUploadingFile} /> 
    </MessageContext.Provider>
  )
}

export default Messages;