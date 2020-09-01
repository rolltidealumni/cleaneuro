import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Moment from "moment";
import jquery from 'jquery';
import FlatButton from "material-ui/FlatButton";
import cameraLogo from "../../static/camera-two.svg";
import loading from "../../static/loading.gif";
import aperture from "../../static/aperture.svg";
// import review from "../../static/star-fill.svg";
import ImageLoader from "react-load-image";
import { useHistory } from "react-router-dom";
import lens from "../../static/lens.svg";
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from "@material-ui/core/Typography";

const PostCard = (post) => {
  let history = useHistory();
  Moment.locale("en");
  const [portraitPhoto, setPortraitPhoto] = useState([{}]);
  const openUniquePost = (post) => {
    history.push('post/' + post.key);
  }

  const isPortrait = ({ target: img }, thisPost) => {
    let obj = {
      height: img.naturalHeight,
      width: img.naturalWidth,
      imageLink: thisPost.post.imageLink
    };
    if (img.naturalHeight > img.naturalWidth) {
      portraitPhoto.push(obj);
      setPortraitPhoto(portraitPhoto)
    };

    if (thisPost) {
      jquery('#' + thisPost.key).css('height', img.naturalHeight);
    }
  };

  const getHeight = (val) => {
    var obj = portraitPhoto.find(({ imageLink }) => imageLink === val.imageLink);
    let height = obj ? '724px' : '300px';
    if (val) {
      jquery('#' + val.key).css('height', '300px');
    }

    if (height === '300px') jquery('#' + val.key).css('background-position', 'center');
    if (height !== '300px') jquery('#' + val.key).css('background-position', 'top center');
    return obj ? '724px' : '300px';
  }

  const haveTheyCritiqued = (postId) => {
    if (post.userCritiques) {
      return post.userCritiques.filter(x => x.post === postId).length > 0;
    } else {
      return false;
    }
  }

  return (
    <Card
      className={"MuiProjectCard--01"}
      id="post-card"
      style={{
        height: history.location.pathname !== "/" ? "300px" : "439px"
      }}
    >
      <ImageLoader src={post.post.imageLink} onLoad={(t) => isPortrait(t, post)}>
        <CardMedia
          id={post.post.key}
          className={"MuiCardMedia-root cardImage"}
          style={{
            backgroundPosition: 'bottom center',
            cursor: history.location.pathname === "/" ? 'pointer' : 'default !important',
          }}
          image={post.post.imageLink}
          onClick={
            !post.adminFlag
              ? () => {
                if (history.location.pathname !== "/") post.openCritique(post.post)
                if (history.location.pathname === "/") openUniquePost(post.post);
              }
              : post.adminFlag
                ? () => post.showEditModal(post.post)
                : null
          }
        >
        </CardMedia>
        <div>There was an error loading this image</div>
        <Skeleton animation="wave" variant="rect" height={300} />
      </ImageLoader>
      <div
        className={"MuiCard__head"}
        style={{
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <Typography
          style={{ marginLeft: "15px", marginTop: "6px", marginBottom: "0px" }}
          gutterBottom
        >
          <span
            onClick={() => {
              if (history.location.pathname === "/") openUniquePost(post.post);
            }}
            style={{ cursor: history.location.pathname === "/" ? 'pointer' : 'default !important', fontSize: "18px", fontWeight: "400", marginBottom: "2px", fontFamily: 'Nunito' }}
          >
            {post.post.caption}
          </span>
          <br />
          <span style={{padding: '6px', width: 'fit-content', backgroundColor: '#eeee', borderRadius: '4px', textAlign: 'center', fontSize: '12px'}}>
            {post.post.category}
          </span>
          <span
            style={{
              paddingLeft: '40px',
              borderRadius: '4px',
              marginBottom: '20px',
              paddingTop: getHeight(post.post) === '300px' ? 'initial' : '0px !important',
              paddingBottom: '5px',
              width: '100%',
              float: 'right',
              zIndex: '1',
              fontSize: '10px',
              fontStyle: 'italic',
              marginLeft: '40px',
              marginTop: '16px',
            }}
          >
            <img
              alt="camera"
              src={cameraLogo}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px" }}
            />{" "}
            {post.post.camera}
            <img
              alt="aperture"
              src={aperture}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '15px' }}
            />{" "}
            {post.post.aperture}
            <img
              alt="lens"
              src={lens}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '15px' }}
            />{" "}
            {post.post.lens}
          </span>
        </Typography>
        <Typography
          className={"MuiTypography--headLabel"}
          variant={"overline"}
          gutterBottom
          style={{ margin: "5px", fontSize: "11px", paddingLeft: "10px" }}
        >
          {history.location.pathname === "/" ? (
            <span style={{ position: "relative", top: "-20px", textTransform: 'uppercase', color: 'gray', fontSize: '10px' }}>
             {Math.round(post.post.expireDays) === 0 ? "Expires today" : 
              Math.round(post.post.expireDays) === 1 ? "Expires tomorrow" : 
              `Expires in ${Math.round(post.post.expireDays)} days`}
            </span>) : null}
          <span>
            {post.isAuthenticated ?
              <FlatButton
                label={
                  post.user.uid === post.post.author ?
                    "Stats" : haveTheyCritiqued(post.post.key) ?
                      "Critiqued" :
                      "Critique"}
                primary={true}
                id="critiqueBtn"
                disabled={haveTheyCritiqued(post.post.key)}
                className={post.user.uid === post.post.author ? "analytics-btn" :
                  haveTheyCritiqued(post.post.key) ? "login-critique" : null}
                onClick={() => post.openCritique(post.post)}
                style={{
                  textTransform: 'capitalize !important',
                  marginBottom: "10px",
                  width: "100%",
                  marginTop: "20px",
                  display: history.location.pathname === "/" ? "none" : "initial",
                  color: 'rgb(30,30,30)'
                }}
              /> :
              <FlatButton
                label={"Login"}
                primary={true}
                id="critiqueBtn"
                onClick={() => history.push("/login")}
                style={{
                  textTransform: 'capitalize !important',
                  display: history.location.pathname === "/" ? "none" : "initial",
                  marginBottom: "10px",
                  width: "100%",
                  marginTop: "20px",
                  color: 'lightgray'
                }}
              />}
          </span>
          <span style={{ fontSize: "13px" }}>
            {post.postLoading && post.postLoading.key === post.post.key ? (
              <img
                width="19px"
                style={{ verticalAlign: "middle", paddingBottom: "2px" }}
                src={loading}
                alt="loading"
              />
            ) : null}
          </span>
        </Typography>
        <br />
        <Typography
          className={"MuiTypography--overline"}
          variant={"overline"}
          style={{
            marginLeft: "15px",
            fontSize: "13px",
            textTransform: "none",
          }}
          gutterBottom
        ></Typography>
      </div>
    </Card>
  );
};

export default PostCard;
