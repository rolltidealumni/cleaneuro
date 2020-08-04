import React, { useEffect, useState } from "react";
import realTime from "../firebase/firebase";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Home";
import Contests from "./Contests";
import Login from "./Login";
import MyPosts from "./Posts/MyPosts";
import Feedback from "./Posts/Feedback";
import UniquePost from "./Posts/UniquePost";
import { useHistory } from "react-router-dom";

function App(props) {
  const { isAuthenticated, isVerifying, user } = props;
  const [route, setRoute] = useState(localStorage.getItem('route'))
  let results = [];
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [critiques, setCritiques] = useState([]);

  const fetchCritiques = async (mounted, user) => {
    setLoading(true);
    if (user) {
      await realTime
        .ref("post-critiques")
        .orderByChild("uid")
        .equalTo(user)
        .on("value", (snapshot) => {
          if (snapshot.val()) {
            let c = [];
            c.push(snapshot.val());
            let keys = Object.keys(c[0]);
            var result = Object.keys(c[0]).map(function (key) {
              return [Number(key), c[0][key]];
            });
            result.forEach(function (child, i) {
              results.push(child[1]);
              setLoading(false);
            });
          }

          if (mounted) {
            setCritiques(results);
          }
        });
    }
  }

  useEffect(() => {
    let mounted = true;
    if (user) fetchCritiques(mounted, user.uid);
    if (route) history.push("/" + route);
    return () => (mounted = false);
  }, [user]);

  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
      >
        <Home userCritiques={critiques} {...props} />
      </ProtectedRoute>
      <Route path="/login" render={(props) => <Login {...props} />} />
      <Route path="/activate" render={(props) => <Login {...props} />} />
      <Route path="/post/:id" render={(props) => <UniquePost isAuthenticated={isAuthenticated} userCritiques={critiques} user={user} {...props} />} />
      <Route path="/contests" render={(props) => <Contests {...props} />} />
      <Route path="/stats" render={(props) => <MyPosts isAuthenticated={isAuthenticated} userCritiques={critiques} user={user} {...props} />} />
      <Route path="/feedback" render={(props) => <Feedback isAuthenticated={isAuthenticated} userCritiques={critiques} user={user} {...props} />} />
    </Switch>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps)(App);
