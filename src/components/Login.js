import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { myFirebase } from "../firebase/firebase";
import validator from "validator";
import { makeStyles } from "@material-ui/core/styles";
import arrow from "../static/arrow.svg";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";
import exit from "../static/close.svg";
import CardActions from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ReactCodeInput from 'react-verification-code-input';
import loadingSpinner from "../static/loading.gif";

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
    };
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [phone, verifyCodeFlag]);

  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    return (
      <div>
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
            Artive is <br />
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
            <TextField
              InputProps={{ classes, disableUnderline: true }}
              style={{
                margin: "5px",
                width: "50%",
                marginBottom: "10px",
                marginTop: "21px",
              }}
              id="phone"
              placeholder={"Mobile Phone"}
              onChange={(e) => validatePhone(e.target.value)}
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
            /> :
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
            />}
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
