import React, { Component, Image } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import FlatButton from 'material-ui/FlatButton';
import {MuiThemeProvider, getMuiTheme} from 'material-ui/styles';
import axios from 'axios';

class Posts extends Component {
  handleUpvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      instagramLink: post.instagramLink,
      upvote: post.upvote + 1,
      downvote: post.downvote
    });
  }

  handleDownvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      instagramLink: post.instagramLink,
      upvote: post.upvote,
      downvote: post.downvote + 1
    });
  }

  getMedia = (url) => {
    axios.get('https://cors-anywhere.herokuapp.com/https://api.instagram.com/oembed/?url=' + url)
      .then(res => {
        console.log(res.data.thumbnail_url);
      });
  }

  render() {
    let posts = this.props.posts;

    const muiTheme = getMuiTheme({
      palette: {
        accent1Color: 'deepOrange500'
      }
    })

    if (!posts) {
      return false;
    }

    if (this.props.loading) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="Posts">
          { Object.keys(posts).map((key) => {
              this.getMedia(posts[key].instagramLink);
              return (
                  <Card>
                    <CardTitle title="Card title" subtitle="Card subtitle" />
                    <CardMedia
                      style={{
                        width: '20%',
                        margin: '0 auto',
                        border: '2px solid #FF9800',
                        backgroundColor: '#ffd699',
                      }}
                    >
                      <img src="https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/21980985_1924045324511515_3480637532423585792_n.jpg" alt="" />
                    </CardMedia>
                    <CardText>
                      <div>Upvotes: { posts[key].upvote }</div>
                      <div>Downvotes: { posts[key].downvote }</div>
                    </CardText>
                    <CardActions>
                      <FlatButton
                        onClick={ (key) => this.handleUpvote(posts[key], key) }
                        type="button"
                        label="Uh-oh!"
                      />
                      <FlatButton
                        onClick={ (key) => this.handleDownvote(posts[key], key) }
                        type="button"
                        label="Pass"
                      />
                    </CardActions>
                  </Card>
              );
          })}
      </div>
    </MuiThemeProvider>
    );
  }
}

export default Posts;
