
  import React from 'react';
  import Card from '@material-ui/core/Card';
  import FlatButton from 'material-ui/FlatButton';
  import CardContent from '@material-ui/core/CardContent';
  import Moment from 'moment';
  import Divider from '@material-ui/core/Divider';
  import Typography from '@material-ui/core/Typography';
  
  const MyCard = (post) => {
    Moment.locale('en');
    return (
      <Card className={'MuiProjectCard--01'}>
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
            {Moment(post.post.submitted).format('MMM, d YYYY')}
          </Typography>
          <Typography
            className={'MuiTypography--heading'}
            variant={'h5'}
            gutterBottom
          >
            <img style={{ height: '80%', width: '80%'}} src={post.post.imageLink} alt="image" />
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
            <div><span role="img" aria-label="thumbsdown">👍</span></div>
          </FlatButton>
      </Card>
    )};

  export default MyCard;