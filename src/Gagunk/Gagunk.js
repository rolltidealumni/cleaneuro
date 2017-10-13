import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

import * as firebase from "firebase";

import config from '../firebase-config';

import Posts from '../Posts/Posts';

class App extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      loading: true
    };

    firebase.initializeApp(config);
  }

  componentWillMount() {
    const postsRef = firebase.database().ref('posts');

    postsRef.on('value', (snapshot) => {
      this.setState({
        posts: snapshot.val(),
        loading: false
      });
    });
  }

  render() {
    return (
      <div>
        <AppBar
          title={<span>Ga Gunk</span>}
          iconElementRight={<FlatButton label="Submit Post" />}
          iconStyleLeft={{ display: 'none' }}
        />
        <Posts
          firebase={firebase.database()}
          posts={this.state.posts}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default App;
