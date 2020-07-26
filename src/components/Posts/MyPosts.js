import React, {
  useState,
  useEffect
} from "react";
import realTime from "../../firebase/firebase";
import Post from "./Post";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import Nav from "../Nav";
import Critique from "../Critique";
import Typography from "@material-ui/core/Typography";
import {
  connect
} from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import { useHistory } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";
import InputLabel from "@material-ui/core/InputLabel";
import Box from "@material-ui/core/Box";
import cameraLogo from "../../static/camera-two.svg";
import twitter from "../../static/twitter.svg";
import facebook from "../../static/facebook.svg";
import filter from "../../static/filter.svg";
import lens from "../../static/lens.svg";
import aperture from "../../static/aperture.svg";
import category from "../../static/label.svg";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { FormControl } from "@material-ui/core";
import { logoutUser } from "../../actions";
import cloneDeep from 'lodash/cloneDeep';

const MyPosts = (props) => {
  let history = useHistory();
  const [openDialog, setOpenDialog] = useState(false);
  const [filterValue, setFilterValue] = useState({ value: "", key: "" });
  const [sort] = useState({ sort: "total", order: "asc" });
  const [openCritique, setOpenCritique] = useState(false);
  const [critiquePost, setCritiquePost] = useState(null);
  const [ordered, setOrdered] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [cameraList, setCameraList] = useState([]);
  const [lensList, setLensList] = useState([]);
  const [apertureList, setApertureList] = useState([]);
  const [lensValue, setLensValue] = useState("");
  const [apertureValue, setApertureValue] = useState("");
  const [strict, setStrict] = useState([]);
  const [cameraValue, setCameraValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [average, setAverage] = useState([]);
  let postz = [];
  let postCameras = [];
  let postLens = [];
  let postAperture = [];
  let temp = [];

  const goToHelp = () => {
    var win = window.open(
      "https://join.slack.com/t/ratemyshot/shared_invite/zt-edfbwbw4-Wncezi48LIFbph8NDzHKuA",
      "_blank"
    );
    if (win) win.focus();
  };

  const handleOpenCritique = (post) => {
    !openCritique && setCritiquePost(post);
    openCritique && setCritiquePost(null);
    setOpenCritique(!openCritique);
  }

  const handleOpen = () => {
    if (!props.isAuthenticated) {
      history.push("/login");
    } else {
      setOpenDialog(true);
    }
  };

  useEffect(() => {
    if (!props.isAuthenticated) {
      history.push("/");
    }
    getPosts();
  }, [props.user]
  );

  const logout = () => {
    const { dispatch } = props;
    dispatch(logoutUser());
  };

  const login = () => {
    history.push("/login");
  };

  const getPosts = () => {
    realTime
      .ref("posts")
      .orderByChild(sort.sort)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          postz.push(snapshot.val());
          let keys = Object.keys(postz[0]);
          var result = Object.keys(postz[0]).map(function (key) {
            return [Number(key), postz[0][key]];
          });
          result.forEach(function (child, i) {
            postCameras.push(child[1].camera);
            postLens.push(child[1].lens);
            postAperture.push(child[1].aperture);

            temp.push({
              index: i,
              key: keys[i],
              submitted: child[1].submitted,
              imageLink: child[1].imageLink,
              aperture: child[1].aperture,
              lens: child[1].lens,
              camera: child[1].camera,
              category: child[1].category,
              author: child[1].author,
              location: child[1].location,
              oneStar: child[1].oneStar,
              twoStars: child[1].twoStars,
              threeStars: child[1].threeStars,
              fourStars: child[1].fourStars,
              fiveStars: child[1].fiveStars,
              editorspick: child[1].editorspick,
              total: child[1].total,
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
        }

        if (!filterValue.value) {
          setCameraList([...new Set(postCameras.sort((a, b) => (a > b ? 1 : -1)))]);
          setLensList([...new Set(postLens.sort((a, b) => (a > b ? 1 : -1)))]);
          setApertureList([...new Set(postAperture.sort((a, b) => (a > b ? 1 : -1)))]);
        }
        setOrdered(temp.sort((a, b) => (a[sort.sort] > b[sort.sort] ? 1 : -1)).filter(i => i.author === props.user.uid));
        setPosts(temp.sort((a, b) => (a[sort.sort] > b[sort.sort] ? 1 : -1)).filter(i => i.author === props.user.uid));
        setStrict(temp.sort((a, b) => (a[sort.sort] > b[sort.sort] ? 1 : -1)).filter(i => i.author === props.user.uid));
      });
  }

  const updateFilter = (value, key) => {
    if (value !== "") {
      const results = ordered.filter(item => {
        return (item[key] === value)
      });
      setOrdered(results);
      setPosts(results)
    }

    if (value === "") {
      setPosts(strict);
      setOrdered(strict);
    }
  };

  const updateRating = (post, key, rating) => {
    setPostLoading(true);
    if (rating === 1) {
      props.firebase.ref("posts/" + key).update({
        oneStar: post.oneStar + 1,
        total: post.total + 1,
      });
    } else if (rating === 2) {
      props.firebase.ref("posts/" + key).update({
        twoStars: post.twoStars + 1,
        total: post.total + 1,
      });
    } else if (rating === 3) {
      props.firebase.ref("posts/" + key).update({
        threeStars: post.threeStars + 1,
        total: post.total + 1,
      });
    } else if (rating === 4) {
      props.firebase.ref("posts/" + key).update({
        fourStars: post.fourStars + 1,
        total: post.total + 1,
      });
    } else if (rating === 5) {
      props.firebase.ref("posts/" + key).update({
        fiveStars: post.fiveStars + 1,
        total: post.total + 1,
      });
    }
    setPostLoading(false);
  };

  const getAverage = () => {
    let sum = 0;
    let temp = posts.filter(e => e.average > 0);
    temp.map(p => {
      sum = sum + p.average;
    });
    return ({
      average: sum / temp.length,
      total: temp.length
    });
  }

  const getMax = () => {
    let temp = posts.filter(e => e.average > 0);
    var res = Math.max.apply(Math, temp.map(function (o) { return o.average; }))
    var obj = temp.find(function (o) { return o.average == res; });
    return obj;
  }

  return (
    <div>
      <Nav
        loginFlag={false}
        handleOpen={() => handleOpen()}
        logout={() => logout()}
        login={() => login()}
        isVerifying={props.isVerifying}
        isAuthenticated={props.isAuthenticated}
      />
      {openCritique ? (
        <Critique
          openDialog={openCritique}
          post={critiquePost}
          setOpenDialog={() => setOpenCritique()}
          handleClose={() => setOpenCritique()}
          {...props}
        />
      ) : null}
      <Card className={"MuiProjectCard--01"}
        style={{
          height: '350px',
          width: '100%'
        }}
      >
        <div
          className={"MuiCard__head"}
          style={{
            marginTop: "110px",
            marginLeft: "92px",
            marginBottom: "20px",
          }}
        >
          <Typography style={{ marginLeft: "15px", marginTop: "45px", marginBottom: "0px" }}>
            <span style={{ cursor: 'pointer', fontSize: "28px", fontWeight: "600", marginBottom: "2px" }}>
              Analytics
            </span>
            <div style={{ marginTop: '20px' }}>
              Photos submitted: {cloneDeep(posts.length)}
            </div>
            <div style={{ marginTop: '5px' }}>
              Average rating: {cloneDeep(getAverage().average.toFixed(2))}
            </div>
            <div style={{ marginTop: '5px' }}>
              Photos rated: {cloneDeep(getAverage().total)}
            </div>
            <div style={{ marginTop: '5px' }}>Most popular photo:{" "}
              {getMax() ? <a className="pop-link" href={"post/" + cloneDeep(getMax().key)}>{cloneDeep(getMax().location)}</a> : null}
            </div>
            <div style={{ marginTop: '5px' }}>Most popular camera:{" "}
              {getMax() ? <a className="pop-link" href={"post/" + cloneDeep(getMax().key)}>{cloneDeep(getMax().camera)}</a> : null}
            </div>
          </Typography>
        </div>
      </Card>
      <div className="cards-analytics" > {
        postLoading ? (<LinearProgress id="line-progress"
          style={
            {
              display: 'absolute',
              top: '48px',
              backgroundColor: 'white'
            }
          }
        />
        ) : posts.length > 0 ? (
          posts.map((post, i) => {
            return (
              <Post
                showZoomModal={(image) => props.showZoomModal(image)}
                isAuthenticated={props.isAuthenticated}
                showEditModal={(post) => props.showEditModal(post)}
                postLoading={postLoading}
                adminFlag={props.adminFlag}
                key={i}
                id={i}
                openCritique={(post) => handleOpenCritique(post)}
                post={post}
                updateRating={(post, i, rating) =>
                  updateRating(post, post.key, rating)
                }
                {...props}
              />
            );
          })
        ) : (<span className="no-results" > There are no posts to display </span>)}
      </div> {!postLoading ? (<div id="footerArea" >
        <span id="footer" > ©2020 artive, LLC / All Rights Reserved / {" "} <Link style={{ cursor: "pointer" }} onClick={() => goToHelp()} >Help</Link>{" "} / {" "}
          <a alt="twitter"
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
            /></a></span ></div>) : null} </div>);
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps)(MyPosts);