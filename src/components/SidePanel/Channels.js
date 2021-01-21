import React from 'react';
import { AppContext } from "../App";
import { connect } from 'react-redux';
import firebase from "../../firebase";
import { useCustomReducer } from "../../hooks";
import { setCurrentChannel,setPrivateChannel } from "../../actions";
import { Menu,Icon,Modal, Form,Input,Button,Label} from "semantic-ui-react";

const initial = {
  channels : [],
  channel : null,
  activeChannel:'',
  modalAdd : {
    visible : false
  },
  firstLoad : true,
  channelForm : {},
  channelsRef : firebase.database().ref('channels'),
  messagesRef : firebase.database().ref('messages'),
  notifications : [], 
}

const Channels = (props) => {
  const {appData : {user}} = React.useContext(AppContext);
  const [dataReducer,reducerFunc] = useCustomReducer(initial);

  React.useEffect(() => {
    setFirstChannel()
  },[dataReducer.channels.length])
  React.useEffect(() => {
    addListeners();
    return dataReducer.channelsRef.off;
  },[])

  const addListeners = () => {
    let loadedChannels = [];
    dataReducer.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      reducerFunc('channels',loadedChannels,'conventional');
      addNotificationListener(snap.key);
    });
  }
  const addNotificationListener = (channelId) => {
    dataReducer.messagesRef.child(channelId).on('value', snap => {
      if(dataReducer.channel){
        handleNotifications(channelId,dataReducer.channel.id,dataReducer.notifications,snap);
      }
    })
  }
  const handleNotifications = (channelId, currentChannelId, notificationsState,snap) => {
        console.clear();
        console.log('chanel id : ',channelId);
        console.log(' currentChannelId : ', currentChannelId);
        console.log('notificationsState : ',notificationsState);
        console.log('snap: ',snap);
    let lastTotal = 0;
    const notifications = [...notificationsState];
    let index = notifications.findIndex(notification => notification.id === channelId);
    if(index !== -1){
      if(channelId !== currentChannelId){
        lastTotal = notifications[index].total;
        if(snap.numChildren() - lastTotal > 0){
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    }else{
      notifications.push({
        id : channelId,
        total : snap.numChildren(),
        lastKnownTotal : snap.numChildren(),
        count : 0
      })
    }
    reducerFunc('notifications',notifications,'conventional');
  }
  const setFirstChannel = () => {
    const firstChannel = dataReducer.channels[0];
    if(dataReducer.firstLoad && dataReducer.channels.length){
      props.setCurrentChannel(firstChannel)
      reducerFunc('firstLoad',false,'conventional')
      reducerFunc('activeChannel',firstChannel.id,'conventional')
      reducerFunc('channel',firstChannel,'conventional')
    }
  }
  const addChannel = () => {
    const key = dataReducer.channelsRef.push().key;
    const newChannel = {
      id : key,
      name : dataReducer.channelForm.channelName,
      details : dataReducer.channelForm.channelDetails,
      createdBy : {
        name : user.displayName,
        avatar : user.photoURL
      }
    }

    dataReducer.channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        reducerFunc('channelForm',{channelName : '', channelDetails : ''})
        closeModal()
      })
      .catch(err => console.log(err))
  }

  const handleChange = (event) => {
    reducerFunc('channelForm', {[event.target.name] : event.target.value})
  }
  
  const isFormValid = () => dataReducer.channelForm.channelName && dataReducer.channelForm.channelDetails;
 
  const closeModal = () => reducerFunc('modalAdd',{visible : false})
  const openModal = () => reducerFunc('modalAdd',{visible : true})
  const handleSubmit = event => {
    event.preventDefault();
    if(isFormValid()){
      addChannel()
    }
  }

  const changeChannel = chnnl => {
    setActiveChannel(chnnl);
    clearNotifications();
    props.setCurrentChannel(chnnl);
    props.setPrivateChannel(false);
    reducerFunc('channel',chnnl,'conventional')
  }
  const clearNotifications = () => {
    let index = dataReducer.notifications.findIndex(notif => notif.id === dataReducer.channel.id);

    if(index !== -1){
      let updateNotif = [...dataReducer.notifications];
      updateNotif[index].total = dataReducer.notifications[index].lastKnownTotal;
      updateNotif[index].count = 0;
      reducerFunc('notifications',updateNotif,'conventional');
    }
  }
  const getNotificationCount = ch => {
    let count = 0;

    dataReducer.notifications.forEach(notif => {
      if(notif.id === ch.id){
        count = notif.count;
      }
    });
    if(count > 0) return count;
  }
  const setActiveChannel = dt => {
    reducerFunc('activeChannel',dt.id,'conventional')
  }

  return(<React.Fragment>
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="exchange" /> CHANNELS
        </span> {' '}
        ({ dataReducer.channels.length }) <Icon name="add" onClick={openModal} />
      </Menu.Item>
      {dataReducer.channels.length ? 
       dataReducer.channels.map(x => (
         <Menu.Item 
          key={x.id}
          onClick={() => changeChannel(x)}
          name={x.name}
          style={{opacity: 0.7}}
          active={x.id === dataReducer.activeChannel}
        >
          {getNotificationCount(x) && (
            <Label color="red">{getNotificationCount(x)}</Label>
          )}
          # {x.name}
         </Menu.Item>
       )) 
      : ''}
    </Menu.Menu>
    <Modal 
      basic 
      open={dataReducer.modalAdd.visible} 
      onClose={closeModal}
    >
      <Modal.Header>Add a channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input 
              fluid
              label="Name of Channel"
              name="channelName"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Input 
              fluid
              label="About the Channel"
              name="channelDetails"
              onChange={handleChange}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={handleSubmit}>
          <Icon name="checkmark" /> Add
        </Button>
        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove"/> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  </React.Fragment>)
}

export default connect(null,{setCurrentChannel,setPrivateChannel})(Channels);