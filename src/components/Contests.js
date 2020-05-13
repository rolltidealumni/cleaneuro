import React, { useState, useEffect } from "react";
import realTime from "./../firebase/firebase";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import Nav from "./Nav";
import Moment from "moment";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import CardMedia from "@material-ui/core/CardMedia";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import Loader from "react-loader-spinner";
import { logoutUser } from "../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const Contests = (props) => {
  let history = useHistory();
  let contestz = [];
  let ordered = [];
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bottomNav] = useState(5);
  const [contests, setContests] = useState([]);
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCopied(false);
  };

  const navigate = () => {
    var win = window.open("http://blog.ratemyshot.co/", "_blank");
    win.focus();
  };

  const login = () => {
    if (!props.isAuthenticated) {
      history.push("/login");
    }
  };

  const route = () => {
    history.push("/");
  };

  const logout = () => {
    const { dispatch } = props;
    dispatch(logoutUser());
  };

  const getContests = async (mounted) => {
    setLoading(true);
    await realTime
      .ref("contests")
      .orderByChild("endDate")
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          console.log(snapshot.val());
          contestz.push(snapshot.val());
          let keys = Object.keys(contestz[0]);
          let result = Object.keys(contestz[0]).map(function (key) {
            return [Number(key), contestz[0][key]];
          });
          result.forEach(function (child, i) {
            ordered.push({
              index: i,
              key: keys[i],
              endDate: child[1].endDate,
              title: child[1].title,
              coverImage: child[1].coverImage,
              category: child[1].category,
              description: child[1].description,
              details: child[1].details,
            });
          });
          setLoading(false);
        }
      });

    if (mounted) {
      setContests(ordered);
    }
    return ordered;
  };

  useEffect(
    () => {
      let mounted = true;
      getContests(mounted);
      return () => (mounted = false);
    },
    // eslint-disable-next-line
    [contests],
    props.isVerifying
  );

  return (
    <div style={{ marginTop: "16px", color: "#212121" }}>
      <Nav
        loginFlag={false}
        navigate={() => navigate()}
        handleOpen={() => false}
        logout={() => logout()}
        bottomNav={bottomNav}
        login={() => login()}
        isVerifying={props.isVerifying}
        isAuthenticated={props.isAuthenticated}
      />
      <Snackbar
        open={copied}
        anchorOrigin={{ horizontal: "top", vertical: "left" }}
        autoHideDuration={4000}
        onClose={() => handleCloseSnack()}
      >
        <Alert onClose={() => handleCloseSnack()} severity="success">
          Copied!
        </Alert>
      </Snackbar>
      <div className="cards">
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
          <Link color="inherit" onClick={() => {route()}} style={{cursor: "pointer"}}>
            Home
          </Link>
          <Typography color="textPrimary">Contests</Typography>
        </Breadcrumbs>
        {loading ? (
          <div id="loader">
            <center>
              <Loader
                style={{ margin: "200px" }}
                type="Oval"
                color="#61dbfb"
                height={60}
                width={60}
              />
            </center>
          </div>
        ) : contests.length > 0 ? (
          contests.map((contest, i) => {
            return (
              <Card className="contestContainer">
                <CardMedia
                  image={contest.coverImage}
                  title={contest.title}
                  style={{ height: "200px" }}
                />
                <CardContent>
                  <Typography
                    variant="h4"
                    component="p"
                    style={{ fontSize: "19px", fontWeight: "550" }}
                  >
                    {contest.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    style={{ fontSize: "12px" }}
                  >
                    {contest.category}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    style={{ marginTop: "14px" }}
                  >
                    {contest.description}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Tooltip placement="right" title="Copy link">
                    <CopyToClipboard
                      text="https://ratemyshot.co/contests"
                      onCopy={() => setCopied(true)}
                    >
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </Tooltip>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent style={{ paddingTop: "0px" }}>
                    <Typography
                      variant="body2"
                      component="p"
                      style={{ marginTop: "14px" }}
                      paragraph
                    >
                      <Typography
                        variant="h5"
                        component="p"
                        style={{
                          fontSize: "15px",
                          marginBottom: "5px",
                          fontWeight: "550",
                        }}
                      >
                        {" "}
                        Details
                      </Typography>
                      {contest.details}
                    </Typography>
                    <Chip
                      label={
                        "Ends in " +
                        Moment(new Date(contest.endDate)).diff(
                          Moment(),
                          "days"
                        ) +
                        " days"
                      }
                      variant="outlined"
                    ></Chip>
                  </CardContent>
                </Collapse>
              </Card>
            );
          })
        ) : (
          <span className="no-results">There are no contests to display</span>
        )}
      </div>
      <div id="footerArea-fixed">
        <span id="footer">
          © Rate My Shot | All Rights Reserved |{" "}
          <a href="https://blog.ratemyshot.co/contact" target="_blank"  rel="noopener noreferrer">
            Help
          </a>{" "}
          |{" "}
          <a href="https://blog.ratemyshot.co/privacy" target="_blank"  rel="noopener noreferrer">
            Privacy Policy
          </a>
        </span>
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

export default connect(mapStateToProps)(Contests);
