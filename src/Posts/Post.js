import React, { Component } from 'react';
import { Card, CardActions, CardText} from 'material-ui/Card';
import { GridList, GridTile } from 'material-ui/GridList';
import { Line } from 'rc-progress';
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
    this.data = false;

    try {
      const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.instagram.com/oembed/?url=${this.props.post.instagramLink}`);
      this.data = await res.json();
    } catch (e) {
    }

    if (this.data) {
      this.setState({
        url: this.data.thumbnail_url,
        caption: this.data.title
      });
    }
  }

  render() {
    if(this.data) {
      return (
          <Card style={{ margin: '20px' }}>
            <CardText>
              <GridList>
                <GridTile>
                  <img src={ this.state.url} alt="Instagram" />
                </GridTile>
                <GridTile style={{'marginLeft': '20px' }}>
                  <span>"</span>{this.state.caption}<span>"</span>
                  <p></p>
                  <div>Uh-Oh: {this.props.post.upvote}</div>
                  <Line percent={this.props.post.upvote} strokeWidth="4" trailWidth="0" strokeColor="#D8877B" />
                  <div>Pass: {this.props.post.downvote}</div>
                  <Line percent={this.props.post.downvote} strokeWidth="4" trailWidth="0" strokeColor="#C7CA9A" />
                </GridTile>
              </GridList>
            </CardText>
            <CardActions style={{padding: '0px !important', 'margin': '0 !important'}}>
              <FlatButton
                className="gagunkbtn"
                id="gagunk"
                onClick={ () => this.props.onUpvote(this.props.post, this.props.id) }
                type="button"
                style={{width: '50%', 'marginRight': 'none'}}
                label="Uh-oh!"
              />
              <FlatButton
                className="gagunkbtn"
                id="pass"
                onClick={ () => this.props.onDownvote(this.props.post, this.props.id) }
                type="button"
                style={{width: '50%', 'right': 'none'}}
                label="Pass"
              />
            </CardActions>
          </Card>
        )
      }
      else {
        return (<span></span>)
      }
    }
}

export default Post;
