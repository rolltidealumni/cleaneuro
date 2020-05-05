
  import React from 'react';
  import Card from '@material-ui/core/Card';
  import CardMedia from '@material-ui/core/CardMedia';
  import Moment from 'moment';
  import StarRatings from 'react-star-ratings';
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
        <div className={'MuiCard__head'} style={{ marginBottom: '20px'}}>
          <Typography className={'MuiTypography--heading'} style={{ marginLeft: "15px", marginTop: "15px", marginBottom: "0px"}} gutterBottom>
            <p style={{fontSize: "20px", fontWeight: "400", marginBottom: "2px"}}>{post.post.caption}</p>
          </Typography>
          <Typography
            className={'MuiTypography--headLabel'}
            variant={'overline'}
            gutterBottom
            style={{margin: '5px', fontSize: "11px", paddingLeft: '10px'}}
          >
          <StarRatings
            rating={3.4}
            starRatedColor="#212121"
            starHoverColor="#212121"
            changeRating={() => post.updateRating()}
            numberOfStars={5}
            name='rating'
            starDimension="15px"
          />
          <span style={{marginLeft: '5px', fontSize: '13px'}}>({post.post.upvote})</span>
          </Typography>
          <br/>
          <Typography
            className={'MuiTypography--overline'}
            variant={'overline'}
            style={{ marginLeft: "15px",fontSize: "13px", textTransform: "none"}}
            gutterBottom
          >
            {Moment(new Date(post.post.submitted)).format('MMMM, D YYYY')}
          </Typography>
        </div>
      </Card>
    )};

  export default MyCard;