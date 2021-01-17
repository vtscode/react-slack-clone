import React from 'react';
import firebase from "../../firebase";
import { setCurrentChannel } from "../../actions";
import { useCustomReducer } from "../../hooks";
import { Menu,Icon,Modal, Form,Input,Button } from "semantic-ui-react";
import { AppContext } from "../App";
import { connect } from 'react-redux';

const initial = {
  channels : [],
  activeChannel:'',
  modalAdd : {
    visible : false
  },
  firstLoad : true,
  channelForm : {},
  channelsRef : firebase.database().ref('channels')
}

const Channels = (props) => {
  const {appData : {user}} = React.useContext(AppContext);
  const [dataReducer,reducerFunc] = useCustomReducer(initial);

  const handleChange = (event) => {
    reducerFunc('channelForm', {[event.target.name] : event.target.value})
  }
  
  const isFormValid = () => dataReducer.channelForm.channelName && dataReducer.channelForm.channelDetails;
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
  const closeModal = () => reducerFunc('modalAdd',{visible : false})
  const openModal = () => reducerFunc('modalAdd',{visible : true})
  const handleSubmit = event => {
    if(isFormValid()){  
      addChannel()
    }
  }

  const changeChannel = chnnl => {
    setActiveChannel(chnnl);
    props.setCurrentChannel(chnnl)
  }
  const setActiveChannel = dt => {
    reducerFunc('activeChannel',dt.id,'conventional')
  }
  const setFirstChannel = () => {
    if(dataReducer.firstLoad && dataReducer.channels.length){
      props.setCurrentChannel(dataReducer.channels[0])
      reducerFunc('firstLoad',false,'conventional')
      reducerFunc('activeChannel',dataReducer.channels[0].id,'conventional')
    }
  }
  React.useEffect(() => {
    setFirstChannel()
  },[dataReducer.channels.length])
  React.useEffect(() => {
    let loadedChannels = []
    dataReducer.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val())
      reducerFunc('channels',loadedChannels,'conventional')
    });
    return () => dataReducer.channelsRef.off();
  },[])


  return(<React.Fragment>
    <Menu.Menu
      style={{paddingBottom : '2em'}}
    >
      <Menu.Item>
        <span>
          <Icon name="exchange" /> CHANNELS
        </span> {' '}
        ({ dataReducer.channels.length }) <Icon name="add" onClick={openModal} />
      </Menu.Item>
      {dataReducer.channels.length && 
       dataReducer.channels.map((x,idx) => (
         <Menu.Item 
          key={idx}
          onClick={() => changeChannel(x)}
          name={x.name}
          active={x.id === dataReducer.activeChannel}
          style={{opacity: 0.7}}
        >
          # {x.name}
         </Menu.Item>
       )) 
      }
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

export default connect(null,{setCurrentChannel})(Channels);