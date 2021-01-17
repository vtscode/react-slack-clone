import React from 'react';
import { AppContext } from "../App";
import firebase from "../../firebase";
import { Menu,Icon } from "semantic-ui-react";
import { useCustomReducer } from "../../hooks";

const initData = {
  users : [],
  userRef : firebase.database().ref('users'),
  connectedRef : firebase.database().ref('.info/connected'),
  presenceRef : firebase.database().ref('presence')
}
const DirectMessages = () => {
  const {appData} = React.useContext(AppContext)
  const [dataReducer,reducerFunc] = useCustomReducer(initData);

  const addStatusToUser = (userID,connected = true) => {
    const updatedUser = dataReducer.users.reduce((acc,u) => {
      if(u.uid === userID){
        u['status'] = `${connected ? 'online' : 'offline' }`
      }
      return acc;
    },[])
    reducerFunc('users',updatedUser,'conventional');
  }

  const addListener = () => {
    let currentUserUID = appData.user.uid; 
    if(currentUserUID){
      let loadedUsers = [];
      // offline user
      dataReducer.userRef.on('child_added',snap => {
        if(currentUserUID !== snap.key){
          let user = snap.val();
          user['uid'] = snap.key;
          user['status'] = 'offline';
          loadedUsers.push(user);
          console.log('loaded users',loadedUsers);
          reducerFunc('users',loadedUsers,'conventional');
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
      })
      
      dataReducer.presenceRef.on('child_added', snap => {
        if(currentUserUID !== snap.key){
          // add status to user
          addStatusToUser(snap.key)
        }
      })
      dataReducer.presenceRef.on('child_removed', snap => {
        if(currentUserUID !== snap.key){
          // remvoe status to user
          addStatusToUser(snap.key,false)
        }
      })
    }

  }

  const isUserOn = (user) => user.status === 'online';

  React.useEffect(() => {
    addListener()
  },[appData.user.uid])
  React.useEffect(() => {
    console.log(dataReducer.users)
  },[dataReducer.users])

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
        onClick={() => console.log(x)}
        style={{opacity : 0.7,fontStyle : 'italic'}}
      >
        <Icon name="circle"
          color={isUserOn(x) ? 'green' : 'red'}
         />
         @ {x.name}
        </Menu.Item>
    )) : ''}
  </Menu.Menu>);
}
export default DirectMessages;