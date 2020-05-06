import React, { Component } from 'react';
import PostCard from "./PostCard";

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
    return (
        <div className="cardContainer" style={{ marginBottom: '20px' }}>
             <PostCard 
              post={this.props.post} 
              isAuthenticated={this.props.isAuthenticated} 
              showZoomModal={(image) => this.props.showZoomModal(image)}
              {...this.props} 
            />
        </div>
      )
    }
}

export default Post;
