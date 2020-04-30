import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { loginUser } from "../actions";

function Login(props) {
  const { isAuthenticated } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const { dispatch } = props;
    dispatch(loginUser(email, password));
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    return ( 
      <div style={{backgroundColor: 'lightgray', width: '40%', height: '350px', margin: 'auto', marginTop: '10%'}}>
        <div style={{width: '50%', margin: 'auto', textAlign: 'center', padding: '10%'}}>
          <h1>Login</h1>
          <input onChange={(e) => setEmail(e.target.value)} style={{margin: '4px'}}/>
          <br/>
          <input onChange={(e) => setPassword(e.target.value)} style={{margin: '4px'}}/>
          <br/>
          <button onClick={() => handleSubmit()} />
        </div>
      </div> 
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    loginError: state.auth.loginError,
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps)(Login);