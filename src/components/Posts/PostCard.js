import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Moment from "moment";
import jquery from 'jquery';
import FlatButton from "material-ui/FlatButton";
import cameraLogo from "../../static/camera-two.svg";
import loading from "../../static/loading.gif";
import aperture from "../../static/aperture.svg";
import ImageLoader from "react-load-image";
import { useHistory } from "react-router-dom";
import locationLogo from "../../static/location.svg";
import category from "../../static/label.svg";
import Tooltip from "@material-ui/core/Tooltip";
import lens from "../../static/lens.svg";
import loyalty from "../../static/loyalty.svg";
import Skeleton from '@material-ui/lab/Skeleton';
import StarRatings from "react-star-ratings";
import Typography from "@material-ui/core/Typography";

const PostCard = (post) => {
  let history = useHistory();
  Moment.locale("en");
  const [portraitPhoto, setPortraitPhoto] = useState([{}]);

  const changeRating = (newRating, name) => {
    if (post.isAuthenticated) {
      post.updateRating(post.post, post.post.key, newRating);
    }
  };

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

  return (
    <Card className={"MuiProjectCard--01"} id="post-card"
      style={{
        height: '421px',
        float: getHeight(post.post) !== '300px' ? 'right' : undefined
      }}
    >
      <ImageLoader src={post.post.imageLink} onLoad={(t) => isPortrait(t, post)}>
        <CardMedia
          id={post.post.key}
          className={"MuiCardMedia-root cardImage"}
          style={{
            backgroundPosition: 'bottom center',
            cursor: 'pointer'
          }}
          image={post.post.imageLink}
          onClick={
            !post.adminFlag
              ? () => openUniquePost(post.post)
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
          position: post.post.editorspick ? "relative" : "initial",
          top: post.post.editorspick ? "-30px" : "initial",
        }}
      >
        <Typography
          style={{ marginLeft: "15px", marginTop: post.post.editorspick ? "45px" : "10px", marginBottom: "0px" }}
          gutterBottom
        >
          <span
            onClick={() => openUniquePost(post.post)}
            style={{ cursor: 'pointer', fontSize: "18px", fontWeight: "200", marginBottom: "2px" }}
          >
           {post.post.location && post.post.location.length > 20 ? (post.post.location.substring(0, 20 - 3) + "...") : post.post.location}
            <div
              id="editor-pick"
              style={{
                display: post.post.editorspick ? "block" : "none",
                float: 'right',
                color: !post.post.editorspick ? 'white' : 'black',
                backgroundColor: !post.post.editorspick ? 'rgb(28, 28, 28)' : '#fbc02d'
              }}
            >
              <img
                alt="loyalty"
                src={loyalty}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "3px", color: 'black' }}
              />{" "}
              Editor's Pick
            </div>
          </span>
          <span
            style={{
              paddingLeft: '40px',
              borderRadius: '4px',
              marginBottom: '20px',
              paddingTop: getHeight(post.post) === '300px' ? 'initial' : '0px !important',
              paddingBottom: '5px',
              width: '100%',
              overflow: 'hidden',
              float: 'right',
              zIndex: '1',
              fontSize: '10px',
              fontStyle: 'italic',
              marginLeft: '40px',
              marginTop: '6px',
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
            <img
              alt="category"
              src={category}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '15px' }}
            />{" "}
            {post.post.category}
          </span>
        </Typography>
        <Typography
          className={"MuiTypography--headLabel"}
          variant={"overline"}
          gutterBottom
          style={{ margin: "5px", fontSize: "11px", paddingLeft: "10px" }}
        >
          {/* <StarRatings
              rating={post.post.average ? post.post.average : 0}
              starRatedColor="#212121"
              starHoverColor="#212121"
              changeRating={(rating) => changeRating(rating)}
              numberOfStars={5}
              name="rating"
              starDimension="15px"
            /> */}
          <span style={{ fontSize: "13px" }}>
            {post.postLoading && post.postLoading.key === post.post.key ? (
              <img
                width="19px"
                style={{ verticalAlign: "middle", paddingBottom: "2px" }}
                src={loading}
                alt="loading"
              />
            ) : null}
            <FlatButton
              label={"CRITIQUE"}
              primary={true}
              id="critiqueBtn"
              onClick={() => post.openCritique(post.post)}
              style={{ marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
            />
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
