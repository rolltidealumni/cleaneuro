
  import React from 'react';
  import Card from '@material-ui/core/Card';
  import FlatButton from 'material-ui/FlatButton';
  import CardContent from '@material-ui/core/CardContent';
  import CardMedia from '@material-ui/core/CardMedia';
  import Moment from 'moment';
  import Divider from '@material-ui/core/Divider';
  import Typography from '@material-ui/core/Typography';
  
  const MyCard = (post) => {
    Moment.locale('en');
    return (
      <Card className={'MuiProjectCard--01'}>
        <CardMedia
          className={'MuiCardMedia-root'}
          style={{height: "300px"}}
          image={post.post.imageLink}
        />
        <div className={'MuiCard__head'}>
          <Typography
            className={'MuiTypography--headLabel'}
            variant={'overline'}
            gutterBottom
            style={{margin: '5px', paddingLeft: '10px'}}
          >
          {post.post.upvote} likes
          </Typography>
        </div>
        <Divider className={'MuiDivider-root'} light />
        <CardContent className={'MuiCardContent-root'}>
          <Typography
            className={'MuiTypography--overline'}
            variant={'overline'}
            gutterBottom
          >
            {Moment(new Date(post.post.submitted)).format('MMMM, D YYYY')}
          </Typography>
          <Typography className={'MuiTypography--subheading'} gutterBottom>
            {post.post.caption}
          </Typography>
        </CardContent>
        <FlatButton
            className="gagunkbtn"
            id={!post.isAuthenticated ? 'disabled' : 'pass'}
            onClick={ () => post.onUpvote(post.post, post.post.key) }
            type="button"
            style={{width: '100%',  height:'40px', 'marginRight': 'none'}}
            label="👍"
            disabled={!post.isAuthenticated}
          >
            <div><span role="img" aria-label="thumbsdown">{!post.isAuthenticated ? "Login to like" : "👍"}</span></div>
          </FlatButton>
      </Card>
    )};

  export default MyCard;