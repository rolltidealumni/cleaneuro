import React, { Component } from 'react';
import { Card, CardActions, CardMedia, CardText} from 'material-ui/Card';
import { GridList, GridTile } from 'material-ui/GridList';
import Badge from 'material-ui/Badge';

import FlatButton from 'material-ui/FlatButton';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      caption: ''
    }
  }

  async componentWillMount() {
    let data;

    try {
      const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.instagram.com/oembed/?url=${this.props.post.instagramLink}`);
      console.log(res);
      data = await res.json();
    } catch (e) {
      console.log(e);
    }

    this.setState({
      url: data.thumbnail_url,
      caption: data.title
    })
  }

  render() {
    const url = 'url('+this.state.url+') center center no-repeat';
    return (
      <Card style={{ margin: '20px' }}>
        <CardText>
          <GridList>
            <GridTile>
              <div style={{ background: url, backgroundSize: 'cover', height: '500px', width: '500px', overflow: 'hidden' }}></div>
            </GridTile>
            <GridTile style={{'margin-left': '20px' }}>
              <span>"</span>{this.state.caption}<span>"</span>
              <p></p>
              <div>Uh-Oh: {this.props.post.upvote}</div>
              <div>Pass: {this.props.post.downvote}</div>
            </GridTile>
          </GridList>
        </CardText>
        <CardActions style={{padding: '0px !important', 'margin': '0 !important'}}>
          <FlatButton
            class="gagunkbtn"
            id="gagunk"
            onClick={ () => this.props.onUpvote(this.props.post, this.props.id) }
            type="button"
            style={{width: '50%', 'margin-right': 'none'}}
            label="Uh-oh!"
          />
          <FlatButton
            class="gagunkbtn"
            id="pass"
            onClick={ () => this.props.onDownvote(this.props.post, this.props.id) }
            type="button"
            style={{width: '50%', 'margin-right': 'none'}}
            label="Pass"
          />
        </CardActions>
      </Card>
    )
  }
}

export default Post;
