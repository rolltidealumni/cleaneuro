import React, { Component } from 'react';

class AddPost extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    instagramLink: ''
  };

  handleChange = (e) => {
    this.setState({
      instagramLink: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.firebase.ref('posts').push({
      instagramLink: this.state.instagramLink,
      upvote: 0,
      downvote: 0
    });

    this.setState({
      instagramLink: ''
    });
  }

  render() {
    return (
      <div className="AddPost">
        <input
          type="text"
          placeholder="Copy and paste the link to the Instagram post here"
          onChange={ this.handleChange }
          value={ this.state.instagramLink }
        />
        <button
          type="submit"
          onClick={ this.handleSubmit }
        >
          Submit
        </button>
      </div>
    );
  }
}

export default AddPost;
