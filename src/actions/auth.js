import { myFirebase } from "../firebase/firebase";
import firebase from 'firebase/app';
import 'firebase/auth';

export const ACCOUNT_REQUEST = "ACCOUNT_REQUEST";
export const ACCOUNT_SUCCESS = "ACCOUNT_SUCCESS";
export const ACCOUNT_FAILURE = "ACCOUNT_FAILURE";
export const VERIFY_ACCOUNT_SUCCESS = "VERIFY_ACCOUNT_SUCCESS";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const VERIFY_REQUEST = "VERIFY_REQUEST";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";

const requestLogin = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const requestAccount = () => {
  return {
    type: ACCOUNT_REQUEST
  };
};

const receiveAccount = confirmationResult => {
  return {
    type: ACCOUNT_SUCCESS,
    confirmationResult
  };
};

const accountError = error => {
  return {
    type: ACCOUNT_FAILURE,
    error
  };
};

const receiveLogin = user => {
  return {
    type: LOGIN_SUCCESS,
    user
  };
};

const loginError = error => {
  return {
    type: LOGIN_FAILURE,
    error
  };
};

const requestLogout = () => {
  return {
    type: LOGOUT_REQUEST
  };
};

const receiveLogout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

const logoutError = error => {
  return {
    type: LOGOUT_FAILURE,
    error
  };
};

const verifyRequest = () => {
  return {
    type: VERIFY_REQUEST
  };
};

const verifySuccess = () => {
  return {
    type: VERIFY_SUCCESS
  };
};

export const loginUser = (email, password) => dispatch => {
  dispatch(requestLogin());
  myFirebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      if(user.emailVerification === false) {
        dispatch(loginError(true));
      } else {
        dispatch(receiveLogin(user));
      }
    })
    .catch(error => {
      dispatch(loginError(true));
      console.log(error.message);
    });
};

export const createUser = (phoneNumber, appVerifier) => dispatch => {
  dispatch(requestAccount());
  myFirebase
    .auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function (confirmationResult) {
      dispatch(receiveAccount(confirmationResult));
      window.confirmationResult = confirmationResult;
    }).catch(function (error) {
  });
};

export const verifyAccount = (user) => dispatch => {
  dispatch(requestAccount());
  user.sendEmailVerification().then(function() {
    myFirebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(receiveAccount());

    })
  }).catch(function(error) {
    dispatch(accountError(error.message));
  });
}

export const verifyLink = (user, url) => dispatch => {
  dispatch(verifyRequest());
  myFirebase.auth().signInWithEmailLink(user, url.href)
    .then(function(result) {
      dispatch(receiveLogin(user));
      dispatch(verifySuccess(user));
    })
    .catch(function(error) {
      dispatch(loginError(true));
    });
}

export const logoutUser = () => dispatch => {
  dispatch(requestLogout());
  myFirebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(receiveLogout());
    })
    .catch(error => {
      dispatch(logoutError());
    });
};

export const verifyAuth = () => dispatch => {
  dispatch(verifyRequest());
  myFirebase
    .auth()
    .onAuthStateChanged(user => {
      myFirebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
      if (user !== null) {
        dispatch(receiveLogin(user));
        dispatch(verifySuccess());
      } else {
        dispatch(verifySuccess());
      }
    });
};