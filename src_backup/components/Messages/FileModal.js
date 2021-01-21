import React from 'react';
import mime from "mime-types";
import { useCustomReducer } from "../../hooks";
import { Input,Modal,Button,Icon } from "semantic-ui-react";

const initData ={
  file : null,
  authorized : ['image/png','image/jpeg']
}
export default ({dataMsgForm,reducerFuncMsgForm,uploadFile}) => {
  const [dataReducer,reducerFunc] = useCustomReducer(initData);

  const closeModal = () => reducerFuncMsgForm('modalUpload',{visible : false});
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0]
    if(fileUploaded){
      reducerFunc('file',fileUploaded,'conventional')
    }
  }
  const isAuthorized = filename => dataReducer.authorized.includes(mime.lookup(filename));
 
  const sendFile = () => {
    if(dataReducer.file){
      if(isAuthorized(dataReducer.file.name)){
        // send file
        const metadata = { contentType : mime.lookup(dataReducer.file.name) };
        uploadFile(dataReducer.file,metadata);
        closeModal()
        reducerFunc('file',null,'conventional')
      }
    }
  }

  return(
  <Modal
    basic
    open={dataMsgForm.modalUpload.visible}
    onClose={closeModal}
  >
    <Modal.Header>Select an Image File</Modal.Header>
    <Modal.Content>
      <Input 
        fluid
        onChange={handleChange}
        label="File type : jpg, png"
        name="file"
        type="file"
      />
    </Modal.Content>
    <Modal.Actions>
      <Button
        color="green"
        inverted
        onClick={sendFile}
      >
        <Icon name="checkmark" /> Send
      </Button>
      <Button
        color="red"
        inverted
        onClick={closeModal}
      >
        <Icon name="remove" /> Cancel
      </Button>
    </Modal.Actions>
  </Modal>)
}