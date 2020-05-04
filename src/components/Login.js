import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { myFirebase } from "../firebase/firebase";
import validator from 'validator';
import firebase from 'firebase/app';
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

function Login (props) {
  let { isAuthenticated } = props;
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [verifyCodeFlag, setVerifyCodeFlag] = useState(props.verifyCode);
  const [verificationCode, setVerificationCode] = useState(null);
  const [label, setLabel] = useState("Login");
  const [confirmationResult, setConfirmationResult] = useState({});
  const [appVerifier, setAppVerifier] = useState(null);
  
  const handleSubmit = () => {
    if(verifyCodeFlag) {
      setLoading(true);
      const credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult, verificationCode);
      myFirebase.auth().signInWithCredential(credential)
        .then(function (result) {
          setLoading(false);
         }).catch(function (error) {
          console.log(error);
        });
    } else {
        setLoading(true);
        setError(false);
        if(validator.isMobilePhone(phone)) {
          myFirebase
            .auth().signInWithPhoneNumber(phone, appVerifier)
            .then(function (confirmationResult) {
              setVerifyCodeFlag(true);
              setLoading(false);
              setError(false);
              setConfirmationResult(confirmationResult.verificationId);
            }).catch(function (error) {
              console.log(error);
          });
        }
      }
  };

 const validatePhone = (phone) => {
    setPhone(phone);
    if(validator.isMobilePhone(phone)) {
      setError(false);
    } else {
      setError(true);
    }
  }

  useEffect(() => {
    if(!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('submit-account', {
        'size': 'invisible',
        'callback': function(response) {handleSubmit(); }
      });
      setAppVerifier(window.recaptchaVerifier);
    }
  }, [phone, verifyCodeFlag])

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
                    <Typography variant="h4" style={{padding: "20px"}}>{label}</Typography>
                    <TextField 
                      style={{margin: "5px", width: '80%'}} 
                      id="phone" 
                      onChange={(e) => validatePhone(e.target.value)} 
                      label="Phone" 
                      error={error}
                      helperText={error ? "Invalid phone number" : null}
                      type="tel"
                      variant="outlined" 
                    />
                    <TextField 
                      style={{
                        margin: "5px", 
                        width: '80%',
                        backgroundColor: !verifyCodeFlag ? "lightgray" : undefined
                      }} 
                      id="code" 
                      onChange={(e) => setVerificationCode(e.target.value)} 
                      label="Verification Code" 
                      variant="outlined" 
                      type="number"
                      maxLength="6"
                      disabled={!verifyCodeFlag}
                     />
                    <CardActions style={{backgroundColor: 'white'}}>
                      <FlatButton 
                        className="gagunkbtn-submit"
                        id="submit-account" 
                        label={loading ? 
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
    isAuthenticated: state.auth.isAuthenticated,
    verifyCodeFlag: state.auth.verifyCode,
    confirmationResult: state.auth.confirmationResult
  };
}

export default connect(mapStateToProps)(Login);