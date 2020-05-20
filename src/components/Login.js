import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { myFirebase } from "../firebase/firebase";
import validator from "validator";
import loadingSpinner from "../static/loading.gif";
import arrow from "../static/arrow.svg";
import loginLogo from "../static/login-logo.svg";
import firebase from "firebase/app";
import { Redirect } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/Card";
import Backdrop from "@material-ui/core/Backdrop";
import CardActions from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

function Login(props) {
  let { isAuthenticated } = props;
  const [phone, setPhone] = useState(null);
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
      if (validator.isMobilePhone(phone)) {
        myFirebase
          .auth()
          .signInWithPhoneNumber(phone, appVerifier)
          .then(function (confirmationResult) {
            setVerifyCodeFlag(true);
            setLoading(false);
            setError(false);
            setConfirmationResult(confirmationResult.verificationId);
          })
          .catch(function (error) {
            setLoading(false);
            setApiError(error.code);
          });
      }
    }
  };

  const validatePhone = (phone) => {
    setPhone(phone);
    if (validator.isMobilePhone(phone) && !phone.includes("+") === false) {
      setError(false);
      setApiError(null);
    } else {
      setError(true);
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
    } // eslint-disable-next-line
  }, [phone, verifyCodeFlag]);

  const navigate = () => {
    var win = window.open("http://blog.ratemyshot.co/", "_blank");
    win.focus();
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    return (
      <div style={{ float: "right", marginTop: "16px", height: "100%", width: "40%", textAlign: "center" }}>
        <Typography variant="h4" style={{ padding: "20px" }}>
          <div className="wrapper"></div>
        </Typography>
        <div>
          Relish in a{" "}
          <span style={{ color: "#FBC02D", fontWeight: "bold" }}>
            no-bullshit
          </span>
        </div>
        <div>creative space.</div>
        <TextField
          style={{
            margin: "5px",
            width: "80%",
            marginBottom: "10px",
            marginTop: "18px",
          }}
          id="phone"
          onChange={(e) => validatePhone(e.target.value)}
          label={
            <span>
              <span
                style={{
                  marginRight: "10px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#FBC02D",
                }}
              >
                + 1
              </span>
              <span style={{ verticalAlign: "middle" }}>
                Mobile Phone Number
              </span>
            </span>
          }
          error={error || apiError !== null}
          helperText={
            error
              ? "Invalid phone number. Must begin with + and country code"
              : apiError
              ? apiError
              : null
          }
          type="tel"
          disabled={verifyCodeFlag}
          variant="outlined"
        />
        <TextField
          style={{
            margin: "5px",
            marginBottom: "20px",
            width: "80%",
            backgroundColor: !verifyCodeFlag ? "lightgray" : undefined,
          }}
          id="code"
          onChange={(e) => validateCode(e.target.value)}
          label={
            <span>
              <span style={{ verticalAlign: "middle" }}>Verification Code</span>
            </span>
          }
          variant="outlined"
          type="number"
          maxLength="6"
          disabled={!verifyCodeFlag}
        />
        <CardActions
          className="loginButtonContainer"
          style={{ backgroundColor: "white" }}
        >
          <FlatButton
            className={
              !error && phone !== null
                ? "gagunkbtn-submit"
                : "gagunkbtn-submit-disabled"
            }
            id="submit-account"
            disabled={error || phone == null || loading}
            label={
              loading ? (
                <img
                  width="35px"
                  style={{
                    verticalAlign: "middle",
                    paddingBottom: "2px",
                  }}
                  src={loadingSpinner}
                  alt="loading"
                />
              ) : (
                <img src={arrow} fill={"grey"} height={20} />
              )
            }
            onClick={() => handleSubmit()}
          />
        </CardActions>
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
