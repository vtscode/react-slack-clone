import React from 'react';
import firebase from '../../firebase';
import { Link } from 'react-router-dom';
import { Grid,Form,Segment,
  Button,Header,Message,Icon } from "semantic-ui-react";

class Login extends React.Component{

  state = {
    email : '',
    password : '',
    loading : false,
    errors:[],
  }

  handleChange = event => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  isFormValid = ({email,password}) => email && password

  provideError = (err) => {
    this.setState({
      loading : false, 
      errors : this.state.errors.concat(err)
    });
  }

  displayErrors = errors => errors.map((err, i) => <p key={i}>{err.message}</p>)
  handleSubmit = event => {
    if(this.isFormValid(this.state)){
      this.setState({errors : [], loading : true})
      event.preventDefault(); // prevent default action on reload page
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email,this.state.password)
        .then(signedInUser => {
          console.log(signedInUser)
        })
        .catch(err => {
          console.log(err)
          this.provideError(err)
        })
    }
  }

  handleInputError = (err,nameInput) =>{
    return err.some(error => error.message.toLowerCase().includes(nameInput)) ? 'error' : ''
  }

  render(){

    const {email,password,loading,errors} = this.state;

    return(
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{maxWidth : 450}}>
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input 
                fluid name="email" className={this.handleInputError(errors,'email')} icon="mail" iconPosition="left" placeholder="Email Address" onChange={this.handleChange} type="email" 
                value={email}
              />
              <Form.Input 
                fluid name="password" icon="lock" className={this.handleInputError(errors,'password')} iconPosition="left" placeholder="Password" onChange={this.handleChange} type="password" value={password}
              />
              <Button className={loading ? 'loading': ''} disabled={loading} color="violet" fluid size="large">Submit</Button>
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
          <Message>Don't have an account ? <Link to="/register" >Register</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login;