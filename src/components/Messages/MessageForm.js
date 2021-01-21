import React from 'react';
import uuidv4 from "uuid";
import { AppContext } from "../App";
import FileModal from "./FileModal";
import firebase from "../../firebase";
import { MessageContext } from "./Messages";
import ProgressUpload from "./ProgressUpload";
import { useCustomReducer } from "../../hooks";
import { Segment,Button,Input } from "semantic-ui-react";

const initData = {
  storageRef : firebase.storage().ref(),
  message : '',
  loading : false,
  errors: [],
  modalUpload : {
    visible : false,
    uploadState : '',
    uploadTask : null,
    percentUploaded : 0,
    errors: []
  }
}
const MessageForm = ({isUploadingFile,getMessagesRef}) => {
  const [dataReducer,reducerFunc] = useCustomReducer(initData);
  const {msgData} = React.useContext(MessageContext);
  const {appData} = React.useContext(AppContext);

  const handleChange = event => {
    reducerFunc('message',event.target.value,'conventional')
  }
  const openModal = () => reducerFunc('modalUpload',{visible : true});
  const createMessage = (fileUrl = null) => {
    const msg = {
      timestamp : firebase.database.ServerValue.TIMESTAMP,
      user : {
        id : appData.user.uid,
        name : appData.user.displayName,
        avatar : appData.user.photoURL
      },
    }
    if(fileUrl){
      msg['image'] = fileUrl;
    }else{
      msg['content'] = dataReducer.message;
    }
    return msg
  }

  const sendMessage = () => {
    if(dataReducer.message){
      reducerFunc('loading',true,'conventional')
      getMessagesRef()
        .child(appData.channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          reducerFunc('loading',false,'conventional')
          reducerFunc('message','','conventional')
        }).catch(err => {
          reducerFunc('errors',[...dataReducer.errors,err],'conventional')
          reducerFunc('loading',false,'conventional')
        })
    }else{
      reducerFunc('errors',[...dataReducer.errors,{message : 'Add a message'}],'conventional')
    }
  }
  const errorUpload = err => reducerFunc('modalUpload',{
    errors : err,
    uploadState : 'error',
    uploadTask : null
  })
  const getPath = () => {
    if(appData.isPrivateChannel){
      return `chat/private-${appData.channel.id}`;
    }else{
      return 'chat/public';
    }
  }
  const uploadFile = (file,metadata) => {
    const filePath = `${getPath()}/${uuidv4()}.jpg`;

    reducerFunc('modalUpload',{
      uploadState : 'uploading',
      uploadTask : dataReducer.storageRef.child(filePath).put(file,metadata)
    })
  }

  const processUpload = () => {
    const pathToUpload = appData.channel.id;
    const ref = getMessagesRef();
    if(dataReducer.modalUpload.uploadTask){
      dataReducer.modalUpload.uploadTask.on('state_changed',snap => {
        const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        isUploadingFile(percentUploaded)
        reducerFunc('modalUpload',{percentUploaded})
      },err => {
        errorUpload(err)
      },() => {
        dataReducer.modalUpload.uploadTask.snapshot.ref.getDownloadURL().then(url => {
          sendFileMsg(url,ref,pathToUpload)
        }).catch(err => {
          errorUpload(err)
        })
      })
    }
  }

  const sendFileMsg = (url,ref,pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(createMessage(url))
      .then(() => {
        reducerFunc('modalUpload',{
          uploadState : 'done',
        })
      }).catch(err => {
        errorUpload(err)
      })
  }

  React.useEffect(() => {
    processUpload();
  },[dataReducer.modalUpload.uploadTask])

  return(
    <Segment className="message__form">
      <Input
        fluid
        style={{marginBottom : '0.7em'}}
        label={<Button icon="add" />}
        labelPosition="left"
        onChange={handleChange}
        value={dataReducer.message}
        placeholder="Write your message"
        className={dataReducer.errors.some(err => err.message.includes('message')) ? 'error' : ''}
        name="message"
      />
      <Button.Group icon widths="2">
        <Button 
          onClick={sendMessage}
          color="orange"
          disabled={dataReducer.loading}
          loading={dataReducer.loading}
          content="Add Reply"
          labelPosition="left"
          icon="edit"
        />
        <Button 
          color="teal"
          disabled={dataReducer.modalUpload.uploadState === 'uploading'}
          onClick={openModal}
          content="Upload Media"
          labelPosition="right"
          icon="cloud"
        />
      </Button.Group>
      <FileModal 
        dataMsgForm={dataReducer} 
        reducerFuncMsgForm={reducerFunc} 
        uploadFile={uploadFile}
      />
      <ProgressUpload 
        dataMsgForm={dataReducer} 
      />
    </Segment>
  )
}

export default MessageForm;