import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import '../App.css'
import firebase from '../../firebase'


class Login extends Component {

    state = {
        email: "",
        password: "",
        errors: [],
        loading: false
    }

    handleChange = (event) => {
        this.setState({ [event.target.name] :  event.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();

        if(this.isFormValid(this.state)) {
           this.setState({ errors: [], loading: true })   
           firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser => {
                console.log(signedInUser)
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    loading: false
                });
            });
        }
    };  

    isFormValid = ({ email, password }) => email && password;

    displayErrors = errors => errors.map((error, i) =>  <p key={i}>{error.message}</p>);

    handleInputError = (errors, inputName) => {
       return errors.some(error => 
            error.message.toLowerCase().includes(inputName)) ? 
            'error' 
            : 
            " "
    }


    render() {
        const { email, password, loading, errors } = this.state 
        
        return (
         <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h2" icon color="orange" textAlign="center">
                    <Icon name="code branch" color="orange" />
                    Login to BitChat
                </Header>
                {errors.length > 0  && (
                    <Message error>
                        {this.displayErrors(errors)}
                    </Message>
                )}
                <Form onSubmit={this.handleSubmit} size="large">
                    <Segment stacked>
            
                        <Form.Input 
                            fluid name="email" 
                            icon="mail" 
                            iconPosition="left" 
                            placeholder="Email" 
                            onChange={this.handleChange} 
                            value={email}
                            className = {this.handleInputError(errors, 'email') }
                            type="email" />
                        <Form.Input 
                            fluid name="password" 
                            icon="lock" 
                            iconPosition="left" 
                            placeholder="Password" 
                            onChange={this.handleChange}
                            value={password} 
                            className = {this.handleInputError(errors, 'password') }
                            type="password" />
                    <Button 
                        disabled={loading} 
                        className={loading ? 'loading' : ''} 
                        color="orange" 
                        fluid size="large">
                        Submit
                    </Button>
                    </Segment>
                </Form>
                <Message>Don't have an account? <Link to="/register">Register</Link></Message>
            </Grid.Column>
         </Grid>
        )
    }
}

export default Login;