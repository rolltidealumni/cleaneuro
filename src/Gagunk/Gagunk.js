import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import * as firebase from "firebase";

import config from '../firebase-config';

import Posts from '../Posts/Posts';

class App extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      loading: true,
      openDialog: false,
      instagramLink: '',
    };

    firebase.initializeApp(config);
  }

  componentWillMount = () => {
    let postsRef = firebase.database().ref('posts').orderByChild('upvote');

    postsRef.on('value', (snapshot) => {
      this.setState({
        ...this.state,
        posts: snapshot.val(),
        loading: false
      });
    });
  }


  handleOpen = () => {
    this.setState({
      ...this.state,
      openDialog: true
    });
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      openDialog: false,
      instagramLink: ''
    });
  };

  handleChange = (e) => {
    this.setState({
      ...this.state,
      instagramLink: e.target.value
    });
  }

  handleSubmit = (e) => {
    let postsRef = firebase.database().ref('posts');

    postsRef.push({
      instagramLink: this.state.instagramLink,
      upvote: 0,
      downvote: 0
    });

    this.setState({
      ...this.state,
      openDialog: false,
      instagramLink: ''
    });
    window.location.reload(true);
  }


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.handleSubmit}
      />,
    ];

    let posts = this.state.posts;
    return (
      <div>
        <AppBar
          className="gagunkNav"
          title={<span>Ga-Gunk!</span>}
          iconElementRight={<FlatButton label="Submit Post" onClick={this.handleOpen}/>}
          iconStyleLeft={{ display: 'none' }}
        />
        <Dialog
          title="Submit Post"
          actions={actions}
          modal={true}
          open={this.state.openDialog}
        >
          <TextField
            hintText="Instagram URL"
            fullWidth={true}
            value={this.state.instagramLink}
            onChange={this.handleChange}
          />
        </Dialog>
        <Posts
          firebase={firebase.database()}
          posts={posts}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default App;
