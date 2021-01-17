import React from 'react';
import MsgComp from "./MsgComp";
import { AppContext } from "../App";
import firebase from "../../firebase";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import { useCustomReducer } from "../../hooks";
import { Segment,Comment } from "semantic-ui-react";

export const MessageContext = React.createContext({});
const initData = {
  messagesRef : firebase.database().ref('messages'),
  allMsg : [],
  msgLoad : true,
  getAllUniqueUser : 0,
  searchTerm :{
    loading : false,
    query : '',
    results : []
  }
}
const Messages = () => {
  const {appData} = React.useContext(AppContext)
  const [dataReducer,reducerFunc] = useCustomReducer(initData);

  const countUniqueUser = msg => {
    let getAllUniqueUser = msg.reduce((acc,message) => {
      if(!acc.includes(message.user.name)){
        acc.push(message.user.name)
      }
      return acc;
    },[])
    reducerFunc('getAllUniqueUser',getAllUniqueUser.length,'conventional');
  }
  const addListeners = dt => {
    let loadedMsg = [];
    dataReducer.messagesRef.child(dt).on('child_added', snap => {
      loadedMsg.push(snap.val());
      reducerFunc('allMsg',loadedMsg,'conventional');
      reducerFunc('msgLoad',false,'conventional');
      countUniqueUser(loadedMsg);
      return;
    })
  }
  const isUploadingFile = percent => {
    if(percent > 0 && percent < 100) {
      return true
    }
    return false;
  }

  const handleSearchChange = event => {
    reducerFunc('searchTerm',{query : event.target.value, loading: true});
    const channelMsg = [...dataReducer.allMsg];
    const rx = new RegExp(event.target.value,'gi');
    const searchResults = channelMsg.reduce((acc,msg) => {
      if((msg.content && msg.content.match(rx)) || (msg.user.name && msg.user.name.match(rx))){
        acc.push(msg)
      }
      return acc
    },[]);
    setTimeout(() => 
      reducerFunc('searchTerm',{results : searchResults, loading: false})
    ,700);
  }

  React.useEffect(() => {
    if(appData.user && appData.channel.id){
      addListeners(appData.channel.id)
    }
  },[appData.channel.id])  

  return(
    <MessageContext.Provider 
      value={{
        msgData : dataReducer,
        msgDispatch : reducerFunc
      }}
    >
      <MessagesHeader handleSearchChange={handleSearchChange} /> 
      <Segment>
        <Comment.Group className={isUploadingFile ? "messages__progress": "messages"}>
          {dataReducer.searchTerm.query ? dataReducer.searchTerm.results.map(x => <MsgComp key={x.timestamp} msg={x} />)
          : dataReducer.allMsg.map(x => <MsgComp key={x.timestamp} msg={x} />)}
        </Comment.Group>
      </Segment>

      <MessageForm isUploadingFile={isUploadingFile} /> 
    </MessageContext.Provider>
  )
}

export default Messages;