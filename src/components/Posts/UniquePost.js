import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Moment from "moment";
import cameraLogo from "../../static/camera-two.svg";
import realTime from "../../firebase/firebase";
import loading from "../../static/loading.gif";
import aperture from "../../static/aperture.svg";
import Link from "@material-ui/core/Link";
import { useHistory, useParams } from "react-router-dom";
import Nav from "../Nav";
import ImageLoader from "react-load-image";
import category from "../../static/label.svg";
import Tooltip from "@material-ui/core/Tooltip";
import lens from "../../static/lens.svg";
import Skeleton from '@material-ui/lab/Skeleton';
import { logoutUser } from "../../actions";
import StarRatings from "react-star-ratings";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";

const UniquePost = (post) => {
  Moment.locale("en");
  let ordered = [];
  let history = useHistory();
  const [portraitPhoto, setPortraitPhoto] = useState([{}]);
  let params = useParams();
  const [height, setHeight] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postResponse, setPostResponse] = useState({});

  const changeRating = (newRating, name) => {
    if (post.isAuthenticated) {
      post.updateRating(post.post, post.key, newRating);
    }
  };

  const handleOpen = () => {
    if (!post.isAuthenticated) {
      history.push("/login");
    }
  };

  const navigate = () => {
    var win = window.open("http://blog.ratemyshot.co/", "_blank");
    win.focus();
  };

  const logout = () => {
    const { dispatch } = post;
    dispatch(logoutUser());
  };

  useEffect(
    () => {
      let mounted = true;
      window.scrollTo(0, 0);
      // eslint-disable-next-line 
      getPost(mounted, params.id);
      return () => (mounted = false);
    }, // eslint-disable-next-line 
    [post, getPost, params.id]);

  const route = () => {
    history.goBack();
  };

  const login = () => {
    history.push("/login");
  };
  
  // eslint-disable-next-line 
  const getPost = async (mounted, postKey) => {
    setPostLoading(true);
    await realTime
      .ref("posts")
      .orderByKey()
      .equalTo(postKey)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          let postz = [];
          postz.push(snapshot.val());
          let keys = Object.keys(postz[0]);
          var result = Object.keys(postz[0]).map(function (key) {
            return [Number(key), postz[0][key]];
          });
          result.forEach(function (child, i) {
            ordered.push({
              index: i,
              key: keys[i],
              submitted: child[1].submitted,
              imageLink: child[1].imageLink,
              aperture: child[1].aperture,
              lens: child[1].lens,
              camera: child[1].camera,
              category: child[1].category,
              caption: child[1].caption,
              oneStar: child[1].oneStar,
              twoStars: child[1].twoStars,
              threeStars: child[1].threeStars,
              fourStars: child[1].fourStars,
              fiveStars: child[1].fiveStars,
              total: child[1].total,
              editorspick: child[1].editorspick,
              average:
                (5 * child[1].fiveStars +
                  4 * child[1].fourStars +
                  3 * child[1].threeStars +
                  2 * child[1].twoStars +
                  1 * child[1].oneStar) /
                (child[1].fiveStars +
                  child[1].fourStars +
                  child[1].threeStars +
                  child[1].twoStars +
                  child[1].oneStar),
            });
          });
          setPostResponse(ordered[0]);
          setPostLoading(false);
        }
      });
  }

  const isPortrait = ({ target: img }, thisPost) => {
    let obj = {
      height: img.naturalHeight,
      width: img.naturalWidth,
      imageLink: thisPost.imageLink
    };
    if (img.naturalHeight > img.naturalWidth) {
      portraitPhoto.push(obj);
      setPortraitPhoto(portraitPhoto);
      getHeight(thisPost.imageLink);
    };
  };

  const getHeight = (val) => {
    var obj = portraitPhoto.find(({ imageLink }) => imageLink === val);
    setHeight(obj ? '724px' : '300px');
  };

  return (
    <>
      <Nav
        loginFlag={false}
        navigate={() => navigate()}
        handleOpen={() => handleOpen()}
        logout={() => logout()}
        login={() => login()}
        isVerifying={post.isVerifying}
        isAuthenticated={post.isAuthenticated}
      />
      <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
        <Link
          color="inherit"
          onClick={() => {
            route();
          }}
          style={{ cursor: "pointer" }}
        >
          Home
          </Link>
        <Typography color="textPrimary">{postResponse.caption}</Typography>
      </Breadcrumbs>
      <Card className={"MuiProjectCard--01"} id="unique-card"
        style={{
          height: height ? undefined : '493px',
          paddingBottom: '19px',
          width: height === '300px' ? '90%' : '50%'
        }}
      >
        <ImageLoader src={postResponse.imageLink} onLoad={(t) => isPortrait(t, postResponse)}>
          <CardMedia
            className={"MuiCardMedia-root"}
            style={{
              height: height ? height : '350px',
              backgroundPosition: height !== null && height === '300px' ? 'bottom center' : 'center center',
            }}
            image={postResponse.imageLink}
            id="cardImage-unique"
          >
          </CardMedia>
          <div>There was an error loading this image</div>
          <Skeleton animation="wave" variant="rect" height={300} />
        </ImageLoader>
        <div
          className={"MuiCard__head"}
          style={{
            marginBottom: "20px",
            position: postResponse.editorspick ? "relative" : "initial",
            top: postResponse.editorspick ? "-30px" : "initial",
          }}
        >
          {!postLoading ?
            <Typography
              className={"MuiTypography--heading"}
              style={{ marginLeft: "15px", marginTop: postResponse.editorspick ? "45px" : "15px", marginBottom: "0px" }}
              gutterBottom
            >
              <span
                style={{ fontSize: "20px", fontWeight: "400", marginBottom: "2px" }}
              >
                {postResponse.caption}
              </span>
              <span
                style={{
                  backgroundColor: "#EEEEEE",
                  padding: "10px",
                  borderRadius: "4px",
                  width: "100px",
                  overflow: "scroll",
                  float: "right",
                  zIndex: "1",
                  fontSize: "10px",
                  fontStyle: "italic",
                  marginRight: "20px",
                  marginTop: "6px",
                }}
              >
                <div
                  id="editor-pick"
                  style={{
                    display: "block",
                    color: !postResponse.editorspick ? 'white' : 'black',
                    backgroundColor: !postResponse.editorspick ? 'rgb(28, 28, 28)' : '#fbc02d'
                  }}
                >

                  {!postResponse.editorspick ? "Metadata" : "Editor's Pick!"}</div>
                <img
                  alt="camera"
                  src={cameraLogo}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                />{" "}
                {postResponse.camera}
                <br />
                <img
                  alt="aperture"
                  src={aperture}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                />{" "}
                {postResponse.aperture}
                <br />
                <img
                  alt="lens"
                  src={lens}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                />{" "}
                {postResponse.lens}
                <br />
                <img
                  alt="category"
                  src={category}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                />{" "}
                {postResponse.category}
              </span>
            </Typography> : null}
          {!postLoading ?
            <Tooltip title="Rate!" placement="right">
              <Typography
                className={"MuiTypography--headLabel"}
                variant={"overline"}
                gutterBottom
                style={{ margin: "5px", fontSize: "11px", paddingLeft: "10px" }}
              >
                <StarRatings
                  rating={postResponse.average ? postResponse.average : 0}
                  starRatedColor="#212121"
                  starHoverColor="#212121"
                  changeRating={(rating) => changeRating(rating)}
                  numberOfStars={5}
                  name="rating"
                  starDimension="15px"
                />
                <span style={{ marginLeft: "5px", fontSize: "13px" }}>
                  {postResponse.postLoading && postResponse.postLoading.key === postResponse.key ? (
                    <img
                      width="19px"
                      style={{ verticalAlign: "middle", paddingBottom: "2px" }}
                      src={loading}
                      alt="loading"
                    />
                  ) : null}
                </span>
              </Typography>
            </Tooltip> : null}
          <br />
          {!postLoading ?
            <Typography
              className={"MuiTypography--overline"}
              variant={"overline"}
              style={{
                marginLeft: "15px",
                fontSize: "13px",
                textTransform: "none",
              }}
              gutterBottom
            >
              {Moment(new Date(postResponse.submitted)).format("MMMM D, YYYY")}
            </Typography> : null}
        </div>
      </Card>
    </>
  );
};

export default UniquePost;
