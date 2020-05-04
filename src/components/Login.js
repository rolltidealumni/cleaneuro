import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/Card';
import Link from '@material-ui/core/Link';
import Backdrop from '@material-ui/core/Backdrop';
import CardActions from '@material-ui/core/Card';
import logo from "../static/ratemyshot.png";
import Loader from 'react-loader-spinner';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { loginUser, createUser } from "../actions";
import { ActionYoutubeSearchedFor } from "material-ui/svg-icons";

function Login (props) {
  let { user, isAuthenticated, loginError, accountError } = props;
  const [email, setEmail] = useState("");
  const [logError, setLogError] = useState(props.loginError);
  const [accError, setAccError] = useState(props.accountError)
  const [password, setPassword] = useState("");
  const [label, setLabel] = useState("Login");

  const handleSubmit = () => {
    const { dispatch } = props;
    if (label === "Register") {
      dispatch(createUser(email, password));
    } else {
      dispatch(loginUser(email, password));
    }
  };

  const clearErrors = () => {
    setAccError(false);
    setLogError(false);
  }

  useEffect(() => {
    if(loginError !== logError) {
      setLogError(loginError);
    }
    if(accError !== accountError) {
      setAccError(accountError);
    }
    if(user && user.emailVerified === false && email === user.email) {
      setLabel('Please verify your email');
      clearErrors();
    } else {
      setLabel('Login');
    }
  }, [user, email, loginError, accountError])

  const navigate = () => {
    window.location = "https://github.com/themorganthompson/gagunk";
  };
 
  if (user.emailVerified && isAuthenticated && !loginError && !accountError) {
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
                    <Typography variant="h4" style={{padding: "20px"}}>{label}</Typography>
                    {label === "Login" ? (
                        <div>New user? Click <Link href="#" onClick={() => {setLabel('Register'); clearErrors()}} style={{textDecoration: "none !important", color: "black"}}>here</Link> to register</div>
                      ) : label !== "Please verify your email" ?(
                        <div>Have an account? Click <Link href="#" onClick={() => setLabel('Login')} style={{textDecoration: "none !important", color: "black"}}>here</Link> to login</div>
                      ) : null
                    }
                    <TextField 
                      style={{margin: "5px", width: '80%'}} 
                      id="email" 
                      onChange={(e) => setEmail(e.target.value)} 
                      label="Email" 
                      variant="outlined" 
                      error={logError ? true : (accError ? true : false)} 
                      helperText={accError ? "The email address is already in use by another account." : logError ? "Account not found." : false}
                    />
                    <TextField type="password" style={{margin: "5px", width: '80%'}} id="password" onChange={(e) => setPassword(e.target.value)} label="Password" variant="outlined" />
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
    isAuthenticated: state.auth.isAuthenticated,
    accountError: state.auth.accountError,
    user: state.auth.user
  };
}

export default connect(mapStateToProps)(Login);