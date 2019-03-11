import React, { Component } from 'react';
import { Card, CardActions, CardText} from 'material-ui/Card';
import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import trashIcon from '../static/trash.svg';

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
        thumbnail_width: this.data.thumbnail_width,
        url: this.data.thumbnail_url,
        caption: caption.substring(0, 400)
      });
    }
  }

  render() {
    const classVal = "card " + this.props.post.leader;
    const image = this.state.caption ? <img style={{ height: '400px' }} src={ this.state.url} alt="Instagram" /> : <span></span>;
    if(this.state.thumbnail_width !== 612) {
      return (
          <div>
            <Card id={'#'+ this.props.post.key} className={classVal}>
              <CardText className="cardText">
                <GridList className="image">
                  <GridTile style={{ height: '400px' }}>
                    <center>
                      <a href={this.state.url} target="_blank" rel="noopener noreferrer">
                        {image}
                      </a>
                    </center>
                  </GridTile>
                </GridList>
                <center>
                  <div className="caption" style={{height: '440px', 'marginLeft': '20px' }}>
                    <span style={{'maxHeight': '300px', 'minHeight': '300px'}}>"{this.state.caption} ..."</span>
                    <img style={{'float': 'right', 'height': '20px', 'width': '20px', 'cursor': 'pointer'}}
                    src={trashIcon}
                    alt="delete"
                    hidden
                    onClick={ () => this.props.onDelete(this.props.post, this.props.post.key) }
                    />
                  </div>
              </center>
              </CardText>
              <CardActions style={{padding: '0px !important', 'margin': '0 !important'}}>
                <FlatButton
                  className="gagunkbtn"
                  id="gagunk"
                  onClick={ () => this.props.onUpvote(this.props.post, this.props.post.key) }
                  type="button"
                  style={{width: '50%',  height:'40px', 'marginRight': 'none'}}
                  label="Uh-oh! 👎"
                >
                  <div>Uh-Oh <span role="img" aria-label="thumbsdown">👎</span>: {this.props.post.upvote}</div>
                  {this.props.post.upvote}
                </FlatButton>
                <FlatButton
                  className="gagunkbtn"
                  id="pass"
                  onClick={ () => this.props.onDownvote(this.props.post, this.props.post.key) }
                  type="button"
                  style={{width: '50%', height:'40px', 'right': 'none'}}
                  label="Pass 👍"
                >
                  <div>Pass <span role="img" aria-label="thumbsdown">👍</span>: {this.props.post.downvote}</div>
                  {this.props.post.downvote}
                </FlatButton>
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
