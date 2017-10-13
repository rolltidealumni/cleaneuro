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
    return (
      <Card style={{ margin: '20px' }}>
        <CardText>
          <GridList>
            <GridTile>
              <img style={{ height: '200px', width: 'auto', minWidth: '0' }} src={this.state.url} />
            </GridTile>
            <GridTile>
              {this.state.caption}
            </GridTile>
          </GridList>
        </CardText>
        <CardActions>
          <FlatButton
            onClick={ () => this.props.onUpvote(this.props.post, this.props.id) }
            type="button"
            label="Uh-oh!"
          />
          <Badge
            badgeContent={ this.props.post.upvote }
            primary={true}
            style={{ padding: '5px 5px 12px 12px'}}
          />
          <FlatButton
            onClick={ () => this.props.onDownvote(this.props.post, this.props.id) }
            type="button"
            label="Pass"
          />
          <Badge
            badgeContent={ this.props.post.downvote }
            primary={true}
            style={{ padding: '5px 5px 12px 12px'}}
          />
        </CardActions>
      </Card>
    )
  }
}

export default Post;
