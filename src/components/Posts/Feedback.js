import React, {
  useState,
  useEffect
} from "react";
import realTime from "../../firebase/firebase";
import Card from "@material-ui/core/Card";
import Moment from "moment";
import Nav from "../Nav";
import Link from "@material-ui/core/Link";
import Critique from "../Critique";
import Typography from "@material-ui/core/Typography";
import FlatButton from "material-ui/FlatButton";
import { connect } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useHistory } from "react-router-dom";
import { logoutUser } from "../../actions";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Feedback = (props) => {
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

  const handleOpen = () => {
    if (!props.isAuthenticated) {
      history.push("/login");
    }
  };

  useEffect(() => {
    if (!props.isAuthenticated) {
      history.push("/");
    }
    if (props.user) getPosts(props.user.uid);
  }, [props.user]
  );

  const logout = () => {
    const { dispatch } = props;
    dispatch(logoutUser());
  };

  const login = () => {
    history.push("/login");
  };

  const getPosts = (userUID) => {
    if (userUID !== undefined) {
      realTime
        .ref("post-critiques")
        .orderByChild("author")
        .equalTo(userUID)
        .on("value", (snapshot) => {
          if (snapshot.val()) {
            postz.push(snapshot.val());
            let keys = Object.keys(postz[0]);
            var result = Object.keys(postz[0]).map(function (key) {
              return [Number(key), postz[0][key]];
            });
            result.forEach(function (child, i) {
              temp.push({
                index: i,
                key: keys[i],
                Rating: child[1].Rating,
                author: child[1].author,
                comment: child[1].comment,
                post: child[1].post,
                submitted: child[1].submitted,
                uid: child[1].uid,
              });
            });
          }
          setPosts(temp.sort((a, b) => (a[sort.sort] > b[sort.sort] ? 1 : -1)).filter(i => i.author === userUID));
        });
    }
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
          height: '220px',
          width: '100%'
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
          <Typography style={{ marginLeft: "15px", marginTop: "45px", marginBottom: "0px" }}>
            <span style={{ cursor: 'pointer', fontSize: "28px", fontWeight: "600", marginBottom: "2px" }}>
              Feedback
            </span>
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
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-label="Expand"
                  aria-controls="additional-actions1-content"
                  id="additional-actions1-header"
                >
                  <Typography >{post.comment}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FlatButton
                    label={"VIEW PHOTO"}
                    primary={true}
                    id="feedbackBtn"
                    className={"analytics-btn"}
                    onClick={() => history.push("/post/" + post.post)}
                    style={{
                      textTransform: 'capitalize !important',
                      marginBottom: "10px",
                      width: "120px !important",
                      color: 'rgb(30,30,30)'
                    }}
                  />
                  <Typography color="textSecondary">
                    <span>Submitted on: {Moment(post.submitted).format("dddd, MMMM Do YYYY, h:mm:ss a")}</span>
                    <br />
                    <span>Rating: {post.Rating}</span>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (<span className="no-results" > There are no comments to display </span>)}
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

export default connect(mapStateToProps)(Feedback);