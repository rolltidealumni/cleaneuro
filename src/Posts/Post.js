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
      let caption = this.data.title;
      this.caption = this.data.title;
      let pattern = /\B@[a-z0-9_-]+/gi;
      let mentions = caption.match(pattern);
      if (mentions) {
        mentions.forEach(function(element) {
            caption = caption.replace(element, 'r̶e̶d̶a̶c̶t̶e̶d̶');
        })
      }
      this.setState({
        fulltext: caption,
        url: this.data.thumbnail_url,
        caption: caption.substring(0, 500)
      });
    }
  }

  render() {
    if(this.data) {
      return (
          <div>
            <Card id={'#'+ this.props.post.key} style={{ height: '500px', margin: '20px', 'marginBottom': '75px' }} className={this.props.post.leader}>
              <CardText style={{ height: '428px' }}>
                <GridList>
                  <GridTile style={{ height: '400px' }}>
                    <img style={{ height: '400px' }} src={ this.state.url} alt="Instagram" />
                  </GridTile>
                  <GridTile style={{height: '440px', 'marginLeft': '20px' }}>
                    <span style={{'maxHeight': '300px', 'minHeight': '300px'}}>"{this.state.caption} ..."</span>
                    <p></p>
                    <div>
                      <div>Uh-Oh: {this.props.post.upvote}</div>
                      <Line percent={this.props.post.upvote} strokeWidth="4" trailWidth="0" strokeColor="#D8877B" />
                      <div>Pass: {this.props.post.downvote}</div>
                      <Line percent={this.props.post.downvote} strokeWidth="4" trailWidth="0" strokeColor="#C7CA9A" />
                    </div>
                  </GridTile>
                </GridList>
              </CardText>
              <CardActions style={{padding: '0px !important', 'margin': '0 !important'}}>
                <FlatButton
                  className="gagunkbtn"
                  id="gagunk"
                  onClick={ () => this.props.onUpvote(this.props.post, this.props.post.key) }
                  type="button"
                  style={{width: '50%',  height:'40px', 'marginRight': 'none'}}
                  label="Uh-oh!"
                />
                <FlatButton
                  className="gagunkbtn"
                  id="pass"
                  onClick={ () => this.props.onDownvote(this.props.post, this.props.post.key) }
                  type="button"
                  style={{width: '50%', height:'40px', 'right': 'none'}}
                  label="Pass"
                />
              </CardActions>
            </Card>
          </div>
        )
      }
      else {
        return (<span></span>)
      }
    }
}

export default Post;
