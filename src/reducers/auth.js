import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  ACCOUNT_REQUEST,
  ACCOUNT_SUCCESS,
  ACCOUNT_FAILURE,
  VERIFY_ACCOUNT_SUCCESS
} from "../actions/";

export default (
  state = {
    isLoggingIn: false,
    isLoggingOut: false,
    isVerifying: false,
    loginError: false,
    logoutError: false,
    isAuthenticated: false,
    accountError: false,
    user: {},
    confirmationResult: {}
  },
  action
) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
        loginError: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: true,
        user: action.user
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        loginError: true
      };
    case ACCOUNT_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        accountError: true
      };
    case ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        accountError: false,
        verifyCode: true,
        confirmationResult: action.confirmationResult
      };
    case ACCOUNT_REQUEST:
      return {
        ...state,
        isVerifying: true,
        verifyCode: false,
        isLoggingIn: true,
        verifyingError: false,
        accountError: false,
        loginError: false,
      };
    case VERIFY_ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: true,
        accountError: false
      };
    case LOGOUT_REQUEST:
      return {
        ...state,
        isLoggingOut: true,
        logoutError: false
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggingOut: false,
        isAuthenticated: false,
        user: {}
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        isLoggingOut: false,
        logoutError: true
      };
    case VERIFY_REQUEST:
      return {
        ...state,
        isVerifying: true,
        isLoggingIn: true,
        verifyingError: false,
        accountError: false,
        loginError: false,
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        isVerifying: false,
        isLoggingIn: false,
        verifyingError: false,
        loginError: false
      };
    default:
      return state;
  }
};