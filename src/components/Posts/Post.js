import React, { Component } from "react";
import PostCard from "./PostCard";

class Post extends Component {
  render() {
    return (
      <div className="cardContainer" style={{ marginBottom: "20px" }}>
        <PostCard
          postLoading={this.props.postLoading}
          post={this.props}
          isAuthenticated={this.props.isAuthenticated}
          showZoomModal={(image) => this.props.showZoomModal(image)}
          {...this.props}
        />
      </div>
    );
  }
}

export default Post;
