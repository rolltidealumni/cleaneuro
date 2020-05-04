import React, { Component } from 'react';
import { Card, CardActions, CardText} from 'material-ui/Card';
import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import trashIcon from '../../static/trash.svg';
import MyCard from "./MyCard";

class Post extends Component {
  constructor(props) {
    super(props);
    this.onImgLoad = this.onImgLoad.bind(this);
    this.state = {
      height: null,
      width: null
    };
  }

  onImgLoad ({target:img}) {
    this.setState({
      height: img.naturalHeight,
      width: img.naturalWidth
    });
  }
                               

  render() {
    // style={{height: (this.onImgLoad(image).width > this.onImgLoad(image).height) ? '315px' : `${this.onImgLoad(image).height+25}px`}}
    return (
        <div className="cardContainer" style={{ marginBottom: '20px' }}>
             <MyCard post={this.props.post} isAuthenticated={this.props.isAuthenticated} {...this.props} />
        </div>
      )
    }
}

export default Post;
