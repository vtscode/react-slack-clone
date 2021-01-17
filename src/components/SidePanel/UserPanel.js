import React from 'react';
import firebase from "../../firebase";
import { Grid,Header,Icon,Dropdown, Image } from "semantic-ui-react";
import { AppContext } from "../App";

const UserPanel = () => {
  const {appData : {user}} = React.useContext(AppContext);
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signout'))
      .catch(err => console.log(err))
  }
  const dropdownOptions = [
    {
      key : 'user',
      text : <span>Sign in as <strong>{user.displayName}</strong></span>,
      disabled : true
    },
    {
      key : 'avatar',
      text : <span>Change avatar</span>,
    },
    {
      key : 'signout',
      text : <span onClick={handleSignOut}>Sign out</span>,
    },

  ]

  return(
    <Grid
      style={{background : '#4c3c4c'}}
    >
      <Grid.Column>
        <Grid.Row>
          {/* App header */}
          <Header inverted floated="left" as="h2">
            <Icon name="code"/>
            <Header.Content>WOW</Header.Content>
          </Header>
          {/* user dropdown */}
          <Header style={{padding : '.25em'}} inverted as="h4">
            <Dropdown 
              trigger={
                <span>
                  <Image src={user.photoURL} spaced="right" avatar />
                  {user.displayName}
                </span>
              }
              options={dropdownOptions}
            />
          </Header>
        </Grid.Row>


      </Grid.Column>
    </Grid>
  )

} 
export default UserPanel