import React from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Home";
import Contests from "./Contests";
import Login from "./Login";
import UniquePost from "./Posts/UniquePost";

function App(props) {
  const { isAuthenticated, isVerifying } = props;

  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
      >
        <Home {...props} />
      </ProtectedRoute>
      <Route path="/login" render={(props) => <Login {...props} />} />
      <Route path="/activate" render={(props) => <Login {...props} />} />
      <Route path="/post/:id" render={(props) => <UniquePost {...props} />} />
      <Route path="/contests" render={(props) => <Contests {...props} />} />
    </Switch>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
  };
}

export default connect(mapStateToProps)(App);
