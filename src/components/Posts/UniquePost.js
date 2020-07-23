import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Moment from "moment";
import twitter from "../../static/twitter.svg";
import FlatButton from "material-ui/FlatButton";
import facebook from "../../static/facebook.svg";
import cameraLogo from "../../static/camera-two.svg";
import realTime from "../../firebase/firebase";
import Critique from "../Critique";
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
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";

const UniquePost = (post) => {
  Moment.locale("en");
  let ordered = [];
  let history = useHistory();
  const [openCritique, setOpenCritique] = useState(false);
  const [portraitPhoto, setPortraitPhoto] = useState([{}]);
  let params = useParams();
  const [height, setHeight] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postResponse, setPostResponse] = useState({});
  
  const handleOpen = () => {
    if (!post.isAuthenticated) {
      history.push("/login");
    }
  };

  const handleOpenCritique = (post) => {
    setOpenCritique(!openCritique);
  }

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
    history.push("/");
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
              location: child[1].location,
              author: child[1].author,
              category: child[1].category,
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

  const goToHelp = () => {
    var win = window.open(
      "https://join.slack.com/t/ratemyshot/shared_invite/zt-edfbwbw4-Wncezi48LIFbph8NDzHKuA",
      "_blank"
    );
    if (win) win.focus();
  };

  const getHeight = (val) => {
    var obj = portraitPhoto.find(({ imageLink }) => imageLink === val);
    setHeight(obj ? '724px' : '466px');
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
      {openCritique ? (
        <Critique
          openDialog={openCritique}
          post={postResponse}
          setOpenDialog={() => setOpenCritique()}
          handleClose={() => setOpenCritique()}
          {...post}
        />
      ) : null}
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
        <Typography color="textPrimary">{postResponse.location}</Typography>
      </Breadcrumbs>
      <Card className={"MuiProjectCard--01"} id="unique-card"
        style={{
          height: height ? undefined : '466px',
          paddingBottom: '19px',
          width: height === '300px' ? '90%' : '50%',
        }}
      >
        <ImageLoader src={postResponse.imageLink} onLoad={(t) => isPortrait(t, postResponse)}>
          <CardMedia
            className={"MuiCardMedia-root"}
            style={{
              height: height ? '1294px' : '364px',
              backgroundPosition: height !== null && height !== '300px' ? 'bottom center' : 'center center',
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
              style={{ marginLeft: "15px", marginTop: postResponse.editorspick ? "45px" : "10px", marginBottom: "0px" }}
              gutterBottom
            >
              <span style={{ fontSize: "18px", fontWeight: "200", marginBottom: "2px" }}>
                {postResponse.location}
              </span>
              <span
                style={{
                  paddingLeft: '40px',
                  borderRadius: '4px',
                  marginBottom: '20px',
                  paddingTop: '3px !important',
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
                {postResponse.camera}
                <img
                  alt="aperture"
                  src={aperture}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '15px' }}
                />{" "}
                {postResponse.aperture}
                <img
                  alt="lens"
                  src={lens}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '15px' }}
                />{" "}
                {postResponse.lens}
                <img
                  alt="category"
                  src={category}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '15px' }}
                />{" "}
                {postResponse.category}
              </span>
            </Typography> : null}
            <span>
            {post.isAuthenticated ?
              <FlatButton
                label={post.user.uid === postResponse.author ? "Analytics" : "Critique"}
                primary={true}
                id="critiqueBtn"
                onClick={() => handleOpenCritique(postResponse)}
                style={{ textTransform: 'capitalize !important', left: '20px', marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
              /> :
              <FlatButton
                label={"Login"}
                primary={true}
                id="critiqueBtn"
                onClick={() => history.push("/login")}
                style={{ textTransform: 'capitalize !important', left: '20px', marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
              />}
          </span>
        </div>
      </Card>
      {!postLoading ? (<div id="footerArea" >
        <span id="footer" > ©2020 artive, LLC / All Rights Reserved / {" "} <a href="#" onClick={() => goToHelp()}> Help </a>{" "} /
            {" "} <a alt="twitter"
            href="https://twitter.com/artiveco"
            target="_blank"
            rel="noopener noreferrer"
          ><img alt="twitter" src={
            twitter
          }
            width="10px"
            style={
              {
                cursor: 'pointer',
                verticalAlign: "middle",
                marginLeft: "0px",
              }
            }
            /></a><a alt="twitter"
              href="https://facebook.com/artive.co"
              target="_blank"
              rel="noopener noreferrer"
            ><img alt="facebook" src={
              facebook
            }
              width="10px"
              style={
                {
                  cursor: 'pointer',
                  verticalAlign: "middle",
                  marginLeft: "3px",
                }
              }
            /></a></span ></div>) : null}
    </>
  );
};

export default UniquePost;
