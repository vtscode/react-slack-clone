import React from 'react';
import { AppContext } from "../App";
import firebase from "../../firebase";
import { connect } from 'react-redux';
import { Menu,Icon } from "semantic-ui-react";
import { useCustomReducer } from "../../hooks";
import { setCurrentChannel,setPrivateChannel } from "../../actions";

const initData = {
  users : [],
  activeChannel : '',
  userRef : firebase.database().ref('users'),
  connectedRef : firebase.database().ref('.info/connected'),
  presenceRef : firebase.database().ref('presence')
}
const DirectMessages = (props) => {
  const {appData} = React.useContext(AppContext)
  const [dataReducer,reducerFunc] = useCustomReducer(initData);

  // React.useEffect(() => {
  //   addListener()
  // },[dataReducer.users.length])

  React.useEffect(() => {
    if(appData.user.uid){
      addListener();
    }
  },[appData.user.uid]);

  const addListener = () => {
    const currentUserUID = appData.user.uid; 
    if(currentUserUID){
      let loadedUsers = [...dataReducer.users];
      // offline user
      dataReducer.userRef.on('child_added',snap => {
        if(currentUserUID !== snap.key){
          let user = snap.val();
          user['uid'] = snap.key;
          user['status'] = 'offline';
          loadedUsers.push(user);
        }
      })
      // presence user status
      dataReducer.connectedRef.on('value',snap => {
        if(snap.val() === true){
          let ref = dataReducer.presenceRef.child(currentUserUID)
          ref.set(true);
          ref.onDisconnect().remove(err => {
            if(err){
              console.log(err)
            }
          })
        }
      });
      reducerFunc('users',loadedUsers,'conventional');
    }
  }

  React.useEffect(() => {
    if(dataReducer.users.length){
      const currentUserUID = appData.user.uid; 
      dataReducer.presenceRef.on('child_added', snap => {
        if(currentUserUID !== snap.key){
          // add status to user
          addStatusToUser(snap.key)
        }
      })
      dataReducer.presenceRef.on('child_removed', snap => {
        if(currentUserUID !== snap.key){
          // remeve status to user
          addStatusToUser(snap.key,false)
        }
      })
    }
  },[dataReducer.users.length])

  const addStatusToUser = (userID,connected = true) => {
    const updatedUser = [...dataReducer.users].reduce((acc,u) => {
      if(u.uid === userID){
        u['status'] = `${connected ? 'online' : 'offline' }`
      }
      return acc.concat(u);
    },[]);

    reducerFunc('users',updatedUser,'conventional');
  }

  const changeChannel = user => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id : channelId,
      name : user.name
    }
    props.setCurrentChannel(channelData)
    props.setPrivateChannel(true);
    reducerFunc('activeChannel',user.uid,'conventional');
  }
  const getChannelId = userId => {
    const currentUID = appData.user.uid;
    return userId < currentUID ? `${userId}/${currentUID}` : `${currentUID}/${userId}`;
  }

  const isUserOnline = (user) => user.status === 'online';

  return(
  <Menu.Menu className="menu">
    <Menu.Item>
      <span>
        <Icon name="mail" /> DIRECT MESSAGES
      </span>{' '}
      ({dataReducer.users.length})
    </Menu.Item>
    {dataReducer.users.length ? dataReducer.users.map((x) => (
      <Menu.Item 
        key={x.uid} 
        active={x.uid === dataReducer.activeChannel}
        onClick={() => changeChannel(x)}
        style={{opacity : 0.7,fontStyle : 'italic'}}
      >
        <Icon name="circle"
          color={isUserOnline(x) ? 'green' : 'red'}
         />
         @ {x.name}
        </Menu.Item>
    )) : ''}
  </Menu.Menu>);
}
export default connect(null,{setCurrentChannel,setPrivateChannel})(DirectMessages);