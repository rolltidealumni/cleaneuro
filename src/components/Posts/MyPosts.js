import React, {
  useState,
  useEffect
} from "react";
import realTime from "../../firebase/firebase";
import Post from "./Post";
import Card from "@material-ui/core/Card";
import Moment from "moment";
import Nav from "../Nav";
import Critique from "../Critique";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useHistory } from "react-router-dom";
import { logoutUser } from "../../actions";
import cloneDeep from 'lodash/cloneDeep';

const MyPosts = (props) => {
  let history = useHistory();
  const [sort] = useState({ sort: "total", order: "asc" });
  const [openCritique, setOpenCritique] = useState(false);
  const [critiquePost, setCritiquePost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  let postz = [];
  let postCameras = [];
  let postLens = [];
  let postAperture = [];
  let temp = [];

  const handleOpenCritique = (post) => {
    !openCritique && setCritiquePost(post);
    openCritique && setCritiquePost(null);
    setOpenCritique(!openCritique);
  }

  const handleOpen = () => {
    if (!props.isAuthenticated) {
      history.push("/login");
    }
  };

  useEffect(() => {
    if (!props.isAuthenticated) {
      history.push("/");
    }
    localStorage.setItem('route', 'stats');
    getPosts();
    // eslint-disable-next-line
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
    setPostLoading(true);
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
              expires: Moment(Moment(child[1].submitted)).add(7, 'd').format("dddd, MMMM Do"),
              submitted: child[1].submitted,
              imageLink: child[1].imageLink,
              aperture: child[1].aperture,
              lens: child[1].lens,
              camera: child[1].camera,
              category: child[1].category,
              author: child[1].author,
              caption: child[1].caption,
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
        setPosts(temp.sort((a, b) => (a[sort.sort] > b[sort.sort] ? 1 : -1)).filter(i => i.author === props.user.uid));
        setPostLoading(false);
      });
  }

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
    temp.map(p => sum = sum + p.average);
    return ({
      average: sum / temp.length,
      total: temp.length
    });
  }

  const getMax = () => {
    let temp = posts.filter(e => e.average > 0);
    var res = Math.max.apply(Math, temp.map(function (o) { return o.average; }))
    var obj = temp.find(function (o) { return o.average === res; });
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
      <Card
        style={{
          height: '350px',
          width: '100%',
          backgroundColor: '#eeee'
        }}
      >
        <div
          className={"MuiCard__head"}
          style={{
            marginTop: "110px",
            marginLeft: '5%',
            marginBottom: "20px",
          }}
        >
          <Typography style={{ marginTop: "45px", marginBottom: "0px" }}>
            <span style={{ cursor: 'pointer', fontSize: "28px", marginBottom: "2px", fontFamily: 'Nunito' }}>
              Stats
            </span>

            <div id="stat-panel">
              <div id="stat-total">
                <span id="stat-number">{cloneDeep(posts.length)}</span>
                <br />
                <span>Photo{posts.length > 1 ? "s" : null} Submitted</span>
              </div>
              {posts.length > 0 ? (
                <>
                  <div id="stat-total">
                    <span id="stat-number">{getAverage().total > 0 ? getAverage().average.toFixed(2) : "0"}</span>
                    <br />
                    <span>Average Rating</span>
                  </div>
                  <div id="stat-total">
                    <span id="stat-number"> {getAverage().total > 0 ? getAverage().total : "0"}</span>
                    <br />
                    <span>Photos Rated</span>
                  </div>
                  <div id="stat-total">
                    <span id="stat-number">{getMax() ? getMax().camera : "None"}</span>
                    <br />
                    <span>Most Popular Camera</span>
                  </div>
                </>
              ) : null}
            </div>
            <div id="stat-panel-mobile">
              <div id="stat-total-mobile">
                <span>Photos Submitted:{" "}</span>
                <span id="stat-number-mobile">{cloneDeep(posts.length)}</span>
              </div>
              {posts.length > 0 ? (
                <>
                  <div id="stat-total-mobile">
                    <span>Average Rating:{" "}</span>
                    <span id="stat-number-mobile">{cloneDeep(getAverage().average.toFixed(2))}</span>
                  </div>
                  <div id="stat-total-mobile">
                    <span>Photos Rated:{" "}</span>
                    <span id="stat-number-mobile">{cloneDeep(getAverage().total)}</span>
                  </div>
                  <div id="stat-total-mobile">
                    <span>Most Popular Camera:{" "}</span>
                    <span id="stat-number-mobile">{getMax() ? getMax().camera : null}</span>
                  </div>
                </>
              ) : null}
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
              backgroundColor: '#FBC02D'
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
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps)(MyPosts);