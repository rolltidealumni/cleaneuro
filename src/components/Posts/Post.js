import React, { Component } from 'react';
import { Card, CardActions, CardText} from 'material-ui/Card';
import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import trashIcon from '../../static/trash.svg';

class Post extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const image = <img style={{ height: '80%', width: '80%'}} src={this.props.post.imageLink} alt="image" />;
    if(image) {
      return (
          <div className="cardContainer" style={{ marginBottom: '20px' }}>
            <Card id={'#'+ this.props.post.key}>
              <CardText className="cardText">
                <GridList className="image">
                  <GridTile style={{ height: '400px', overflow: 'scroll' }}>
                    <center>
                      <a href={this.props.post.imageLink} target="_blank" rel="noopener noreferrer">
                        {image}
                      </a>
                    </center>
                  </GridTile>
                </GridList>
                <div className="caption" style={{'marginLeft': '0px' }}>
                  <span style={{'maxHeight': '300px', 'minHeight': '300px'}}>"{this.props.post.caption}"</span>
                  <img style={{'float': 'right', 'height': '20px', 'width': '20px', 'cursor': 'pointer'}}
                  src={trashIcon}
                  alt="delete"
                  hidden
                  onClick={ () => this.props.onDelete(this.props.post, this.props.post.key) }
                  />
                </div>
              </CardText>
              {/* <CardText className="cardTextRight">
               <GridList className="containerRight">
                 <GridTile style={{ height: '400px' }}>
                    <div>Test</div>                  
                </GridTile>
               </GridList>
              </CardText> */}
              <CardActions style={{padding: '0px !important', 'margin': '0 !important'}}>
                <FlatButton
                  className="gagunkbtn"
                  id="pass"
                  onClick={ () => this.props.onUpvote(this.props.post, this.props.post.key) }
                  type="button"
                  style={{width: '50%',  height:'40px', 'marginRight': 'none'}}
                  label="👍"
                  disabled={!this.props.isAuthenticated}
                >
                  <div><span role="img" aria-label="thumbsdown">👍</span>: {this.props.post.upvote}</div>
                  {this.props.post.upvote}
                </FlatButton>
                <FlatButton
                  className="gagunkbtn"
                  id="gagunk"
                  onClick={ () => this.props.onDownvote(this.props.post, this.props.post.key) }
                  type="button"
                  style={{width: '50%', height:'40px', 'right': 'none'}}
                  label="👎"
                  disabled={!this.props.isAuthenticated}
                >
                  <div><span role="img" aria-label="thumbsdown">👎</span>: {this.props.post.downvote}</div>
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
