import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { myFirebase } from "../firebase/firebase";
import validator from "validator";
import { makeStyles } from "@material-ui/core/styles";
import arrow from "../static/arrow.svg";
import firebase from "firebase/app";
import Alert from '@material-ui/lab/Alert';
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";
import exit from "../static/close.svg";
import CardActions from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ReactCodeInput from 'react-verification-code-input';
import loadingSpinner from "../static/loading.gif";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const CssTextField = makeStyles((theme) => ({
  root: {
    "& input:valid:hover + fieldset": {
      borderColor: "#FBC02D",
      borderWidth: 2,
    },
    "& input:valid:focus + fieldset": {
      borderColor: "#FBC02D",
      padding: "4px !important", // override inline-style
    },
    "&input:-internal-autofill-selected": {
      backgroundColor: "lightcoral !important",
    },
  },
  focused: {},
}));

function Login(props) {
  let history = useHistory();
  const classes = CssTextField();
  let { isAuthenticated } = props;
  const [phone, setPhone] = useState(null);
  const [phoneError, setPhoneError] = useState(false);
  const [countryCode, setCountryCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [verifyCodeFlag, setVerifyCodeFlag] = useState(props.verifyCode);
  const [verificationCode, setVerificationCode] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState({});
  const [appVerifier, setAppVerifier] = useState(null);

  const handleSubmit = () => {
    if (verifyCodeFlag) {
      setLoading(true);
      const credential = firebase.auth.PhoneAuthProvider.credential(
        confirmationResult,
        verificationCode
      );
      myFirebase
        .auth()
        .signInWithCredential(credential)
        .then(function (result) {
          setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          setApiError(error.code);
        });
    } else {
      setLoading(true);
      setError(false);
      setApiError(false);
      if (validator.isMobilePhone(phone)) {
        myFirebase
          .auth()
          .signInWithPhoneNumber("+"+phone, appVerifier)
          .then(function (confirmationResult) {
            setVerifyCodeFlag(true);
            setLoading(false);
            setError(false);
            setApiError(false);
            setConfirmationResult(confirmationResult.verificationId);
          })
          .catch(function (error) {
            setLoading(false);
            setApiError(error.code);
          });
      } else {
        setLoading(false);
        setApiError('There was a problem. Please try again');
      }
    }
  };

  const validateCode = (code) => {
    setVerificationCode(code);
    if (verifyCodeFlag === true) {
      if (code == null) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "submit-account",
        {
          size: "invisible",
          callback: function (response) {
            handleSubmit();
          },
        }
      );
      setAppVerifier(window.recaptchaVerifier);
    };
    document.querySelector('body').scrollTo(0, 0)
    // eslint-disable-next-line
  }, [phone, verifyCodeFlag]);

  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    return (
      <div style={{ backgroundColor: "#FFFF" }}>
        <div id="login-cover-image" />
        <img
          alt="close"
          src={exit}
          onClick={() => history.push("/")}
          width="18px"
          style={{
            cursor: 'pointer',
            verticalAlign: 'middle',
            marginRight: '5px',
            position: 'absolute',
            right: '15px',
            top: '19px'
          }}
        />
        <div
          id="login-right"
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "16px",
            width: "40%",
            float: "right",
            fontFamily: "Nunito",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" style={{ padding: "20px" }}>
            <div className="wrapper" style={{ cursor: "pointer" }} onClick={() => history.push("/")}></div>
          </Typography>
          <div id="blurb">
            artive is <br />
            <span> a judgement-free,{" "}</span><br />
            <span style={{ color: "#FBC02D", fontWeight: "500" }}>
              anonymous{" "}
            </span><br />
            photography sharing platform<br />
            <span>that gives you a{" "}</span>
            <span style={{ color: "#FBC02D", fontWeight: "500" }}>
              no-bullshit{" "}
            </span><br />
            <span>creative space</span><br />
            <span>to become a <span style={{ color: "#FBC02D", fontWeight: "500" }}>better artist</span>.</span>
          </div>
          {!verifyCodeFlag ?
            <PhoneInput
              country={'us'}
              value={phone}
              placeholder={"Phone Number"}
              disabled={verifyCodeFlag}
              isValid={(value) => {
                if (validator.isMobilePhone(value)) {
                  setPhoneError(false);
                  return true;
                } else if (value.length > 4) {
                  setPhoneError(true);
                  return false;
                }
              }}
              onChange={phone => setPhone(phone)}
            /> :
            <>
              {apiError ? <center><Alert severity="error" style={{
                marginBottom: "10px",
                marginTop: "5px",
                textAlign: 'left'
              }}>
                {apiError}
              </Alert></center> : null}
              <ReactCodeInput
                style={{
                  margin: "5px",
                  width: "50%",
                  marginBottom: "10px",
                  marginTop: "21px",
                  backgroundColor: !verifyCodeFlag ? "lightgray" : undefined,
                }}
                id="code"
                onComplete={(e) => validateCode(e)}
              />
            </>
          }
          <center>
            <CardActions
              className="loginButtonContainer"
              style={{
                backgroundColor: "white", minWidth: "88px", textAlign: "center",
                width: "50%"
              }}
            >
              {verifyCodeFlag ? <center><Alert severity="info" style={{
                marginBottom: "10px",
                marginTop: "5px",
                textAlign: 'left'
              }}>
                A code was sent to <span style={{ fontWeight: 'bold' }}>{phone}</span>.
              Please enter the code here once you receive it.
          </Alert></center> : null}
              <FlatButton
                className={
                  !error && phone !== null && !phoneError
                    ? "gagunkbtn-submit"
                    : "gagunkbtn-submit-disabled"
                }
                id="submit-account"
                disabled={error || phone == null || loading || phoneError}
                label={
                  loading ? (
                    <img
                      width="35px"
                      style={{
                        verticalAlign: "middle",
                        paddingBottom: "4px",
                      }}
                      src={loadingSpinner}
                      alt="loading"
                    />
                  ) : (
                      <img src={arrow} fill={"grey"} height={20} alt="arrow" />
                    )
                }
                onClick={() => handleSubmit()}
              />
            </CardActions>
          </center>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    isAuthenticated: state.auth.isAuthenticated,
    verifyCodeFlag: state.auth.verifyCode,
    confirmationResult: state.auth.confirmationResult,
  };
}

export default connect(mapStateToProps)(Login);
