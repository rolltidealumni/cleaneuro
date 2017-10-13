import React, { Image } from 'react';
import { Card, CardActions, CardMedia, CardText} from 'material-ui/Card';
import Badge from 'material-ui/Badge';

import FlatButton from 'material-ui/FlatButton';


const Post = ({ id, post, onUpvote, onDownvote }) => (
  <Card>
    <CardMedia style={{ height: '200px', width: 'auto', minWidth: '0', padding: '10px 10px 0px 10px' }}>
      <img style={{ height: '200px', width: 'auto', minWidth: '0' }} src="https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/21980985_1924045324511515_3480637532423585792_n.jpg" alt="" />
    </CardMedia>
    <CardText>
      things
    </CardText>
    <CardActions>
      <FlatButton
        onClick={ () => onUpvote(post, id) }
        type="button"
        label="Uh-oh!"
      />
      <Badge
        badgeContent={ post.upvote }
        primary={true}
        style={{ padding: '5px 5px 12px 12px'}}
      />
      <FlatButton
        onClick={ () => onDownvote(post, id) }
        type="button"
        label="Pass"
      />
      <Badge
        badgeContent={ post.downvote }
        primary={true}
        style={{ padding: '5px 5px 12px 12px'}}
      />
    </CardActions>
  </Card>
)

export default Post;
