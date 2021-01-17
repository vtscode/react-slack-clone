import React from 'react';
import firebase from "../../firebase";
import { Link } from 'react-router-dom';
import { Grid,Form,Segment,
  Button,Header,Message,Icon } from "semantic-ui-react";
import md5 from 'md5';

class Register extends React.Component{

  state = {
    email : '',
    username : '',
    password : '',
    passwordConfirmation : '',
    loading : false,
    errors:[],
    usersRef : firebase.database().ref('users')
  }

  handleChange = event => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }
  isFormEmpty = ({username,email,password,passwordConfirmation}) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length;
  }
  isPasswordValid = ({password,passwordConfirmation}) => {
    if(password.length < 6 || passwordConfirmation.length < 6){
      return false
    }else if(passwordConfirmation !== password){
      return false;
    }else{
      return true;
    }
  }
  isFormValid = () => {
    let errors = [];
    let error;
    if(this.isFormEmpty(this.state)){
      error = { message : 'Fill in all field' }
      this.setState({errors : errors.concat(error)})
      return false
    }else if(!this.isPasswordValid(this.state)){
      error = {message : 'Password is invalid'}
      this.setState({errors : errors.concat(error)})
      return false
    }else{
      return true;
    }
  }

  displayErrors = errors => errors.map((err, i) => <p key={i}>{err.message}</p>)

  clearForm = () => this.setState({ 
    loading : false,
    email : '',
    username : '',
    password : '',
    passwordConfirmation : ''
  })
  provideError = (err) => {
    this.setState({
      loading : false, 
      errors : this.state.errors.concat(err)
    });
  }

  handleSubmit = event => {
    if(this.isFormValid()){
      this.setState({errors : [], loading : true})
      event.preventDefault(); // prevent default action on reload page
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email,this.state.password)
        .then(createdUser => {
          console.log(createdUser)
          createdUser.user.updateProfile({
            displayName : this.state.username,
            photoURL : `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          })
          .then(() => {
            this.saveUser(createdUser).then(() => {
              console.log('user saved')
              this.clearForm();
            })
          })
          .catch(err => {
            this.provideError(err)
          })
        })
        .catch(err => {
          this.provideError(err)
        })
    }
  }
  saveUser = async createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name  :createdUser.user.displayName,
      avatar : createdUser.user.photoURL
    })
  }

  handleInputError = (err,nameInput) =>{
    return err.some(error => error.message.toLowerCase().includes(nameInput)) ? 'error' : ''
  }

  render(){

    const {username,email,password,passwordConfirmation,loading,errors} = this.state;

    return(
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{maxWidth : 450}}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input 
                fluid name="username" icon="user" iconPosition="left" placeholder="Username" onChange={this.handleChange} type="text" value={username}
              />
              <Form.Input 
                fluid name="email" className={this.handleInputError(errors,'email')} icon="mail" iconPosition="left" placeholder="Email Address" onChange={this.handleChange} type="email" 
                value={email}
              />
              <Form.Input 
                fluid name="password" icon="lock" className={this.handleInputError(errors,'password')} iconPosition="left" placeholder="Passowrd" onChange={this.handleChange} type="password" value={password}
              />
              <Form.Input 
                fluid name="passwordConfirmation" className={this.handleInputError(errors,'password')} icon="repeat" iconPosition="left" placeholder="Passowrd Confirmation" onChange={this.handleChange} type="password" value={passwordConfirmation}
              />
              <Button className={loading ? 'loading': ''} disabled={loading} color="orange" fluid size="large">Submit</Button>
            </Segment>
          </Form>
          {
            this.state.errors && this.state.errors.length > 0 && (
              <Message error>
                <h5>Error</h5>
                {this.displayErrors(this.state.errors)}
              </Message>
            )
          }
          <Message>Already to user ? <Link to="/login" >Login</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register;