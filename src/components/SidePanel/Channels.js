import React from 'react';
import { useCustomReducer } from "../../hooks";
import { Menu,Icon,Modal, Form,Input,Button } from "semantic-ui-react";

const initial = {
  channels : [],
  modalAdd : {
    visible : false
  },
  channelForm : {}
}

const Channels = () => {
  const [dataReducer,reducerFunc] = useCustomReducer(initial);

  const handleChange = (event) => {
    reducerFunc('channelForm', {[event.target.name] : event.target.value})
  }
  const isFormValid = () => dataReducer.channelForm.channelName && dataReducer.channelForm.channelDetails;
  const handleSubmit = event => {
    if(isFormValid()){
      
    }
  }

  return(<React.Fragment>
    <Menu.Menu
      style={{paddingBottom : '2em'}}
    >
      <Menu.Item>
        <span>
          <Icon name="exchange" /> CHANNELS
        </span> {' '}
        ({ dataReducer.channels.length }) <Icon name="add" onClick={() => reducerFunc('modalAdd',{visible : true})} />
      </Menu.Item>
      {/* Channels */}
    </Menu.Menu>
    <Modal 
      basic 
      open={dataReducer.modalAdd.visible} 
      onClose={() => reducerFunc('modalAdd',{visible : false})}
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
        <Button color="green" inverted>
          <Icon name="checkmark" /> Add
        </Button>
        <Button color="red" inverted onClick={() => reducerFunc('modalAdd',{visible : false})}>
          <Icon name="remove"/> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  </React.Fragment>)
}

export default Channels;