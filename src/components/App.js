import React from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { getPosts } from "../actions";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Home";
import Login from "./Login";

function App(props) {
  const { isAuthenticated, isVerifying } = props;
  const { dispatch } = props;

  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        component={Home}
        onEnter={dispatch(getPosts())}
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
      />
      <Route path="/login" render={(props) => <Login {...props} />} />
    </Switch>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying
  };
}

export default connect(mapStateToProps)(App);