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
      isValid: true,
      instagramLink: '',
    };
    
    firebase.initializeApp(config);
    }

  componentWillMount = () => {
    let posts = [];
    let postsRef = firebase.database().ref('posts').orderByChild('upvote');
    postsRef.on("value", function(snapshot) {
        let index = 0;
        snapshot.forEach(function(child, i) {
            posts.push({
              index: index,
              key: child.key,
              instagramLink: child.val().instagramLink,
              upvote: child.val().upvote,
              downvote: child.val().downvote,
        });
        index++;
      });
    });
    postsRef.on('value', (snapshot) => {
      this.setState({
        ...this.state,
        posts: posts.reverse(),
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

  navigate = () => {
    window.location = "https://github.com/themorganthompson/gagunk";
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

  validate = (e) => {
    return this.state.instagramLink.includes('https://www.instagram.com/p/');
  }

  handleSubmit = (e) => {
    if(this.validate(e)) {
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
    } else {
      this.setState({
        isValid: false
      });
    }
  }


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        class="cancelBtn"
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        class="submitBtn"
        onClick={this.handleSubmit}
      />,
    ];

    let posts = this.state.posts;
    return (
      <div>
        <AppBar
          className="gagunkNav"
          title={<span>Ga-Gunk!</span>}
          iconElementRight={<div><FlatButton className="gagunkbtn" label="About" onClick={this.navigate}/><FlatButton className="gagunkbtn" label="Submit Post" onClick={this.handleOpen}/></div>}
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
            onKeyPress={this.handleChange}
            onFocus={ this.handleChange }
            onBlur={ this.handleChange }
            value={this.state.instagramLink}
            onChange={this.handleChange}
          />
          <div style={{'color': 'red'}} hidden={this.state.isValid}>Please paste a valid Instagram link.</div>
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
