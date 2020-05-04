import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/Card';
import Backdrop from '@material-ui/core/Backdrop';
import CardActions from '@material-ui/core/Card';
import logo from "../static/ratemyshot.png";
import Loader from 'react-loader-spinner';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { loginUser } from "../actions";

function Login (props) {
  const { isAuthenticated } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const { dispatch } = props;
    dispatch(loginUser(email, password));
  };

  const navigate = () => {
    window.location = "https://github.com/themorganthompson/gagunk";
  };
 
  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    return ( 
      <div style={{marginTop: "16px"}}>
         <AppBar
          className="gagunkNav"
          title={<img src={logo} style={{width: "40px", marginTop: "12px"}}/>}
          iconElementRight={
            <div style={{ padding: "0"}}>
              <FlatButton className="gagunkbtn" label="About" onClick={() => navigate()}/>
            </div>}
          iconStyleLeft={{ display: 'none' }}
        />
        <Backdrop open={true}>
            <Card className="gagunkLogin" style={{backgroundColor: 'lightgray', width: '80%', margin: 'auto', marginTop: 'auto', textAlign: 'center', maxWidth: '580px'}}>
                <CardContent style={{backgroundColor: 'white'}}>
                    <Typography variant="h4" style={{padding: "20px"}}>Login</Typography>
                    <TextField style={{margin: "5px", width: '80%'}} id="email" onChange={(e) => setEmail(e.target.value)} label="Email" variant="outlined" />
                    <TextField style={{margin: "5px", width: '80%'}} id="password" onChange={(e) => setPassword(e.target.value)} label="Password" variant="outlined" />
                    <CardActions style={{backgroundColor: 'white'}}>
                      <FlatButton 
                        className="gagunkbtn-submit" 
                        label={props.isLoggingIn ? 
                          <span id="loginLoader"><Loader id="loginLoader" type="Oval" color="white" height={20} width={20}/></span> : "Submit"
                        }
                        onClick={() => handleSubmit()}
                      />
                    </CardActions>
                </CardContent>
              </Card>
        </Backdrop>
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