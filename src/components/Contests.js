import React, { useState, useEffect } from "react";
import realTime from "./../firebase/firebase";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Chip from "@material-ui/core/Chip";
import trophy from "../static/trophy.svg";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import loadingSpinner from "../static/loading.gif";
import Nav from "./Nav";
import Moment from "moment";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import CardMedia from "@material-ui/core/CardMedia";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import FlatButton from "material-ui/FlatButton";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import Loader from "react-loader-spinner";
import ContestForm from "./ContestForm";
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
  const [user, setUser] = useState(props.user ? props.user.uid : {});
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disableEnterButton, setDisableEnterButton] = useState(false);
  const [enterButtonLoading, setEnterButtonLoading] = useState(false);
  const [bottomNav] = useState(5);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [contest, setContest] = useState(null);
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
      setCopied(false);
      setSuccess(false);
      return;
    }
    setCopied(false);
    setSuccess(false);
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

    if (user) {
      setEnterButtonLoading(true);
      realTime
        .ref("contest-submissions")
        .orderByChild("user")
        .equalTo(user)
        .on("value", (snapshot) => {
          if (snapshot.val()) {
            let submissionResult = [];
            let orderedSub = [];
            submissionResult.push(snapshot.val());
            let submissionKeys = Object.keys(submissionResult[0]);
            let subResult = Object.keys(submissionResult[0]).map(function (
              key
            ) {
              return [Number(key), submissionResult[0][key]];
            });
            subResult.forEach(function (child, i) {
              orderedSub.push({
                index: i,
                key: submissionKeys[i],
                user: child[1].user,
              });
            });
            if (orderedSub[0].user === user) {
              setDisableEnterButton(true);
            } else {
            setEnterButtonLoading(false);
            }
          } else {
            setEnterButtonLoading(false);
          }
        });
    }

    if (mounted) {
      setContests(ordered);
    }
    return ordered;
  };

  useEffect(
    () => {
      let mounted = true;
      getContests(mounted);
      setUser(props.user ? props.user.uid : {});
      return () => (mounted = false);
    },
    // eslint-disable-next-line
    [contests],
    props.isVerifying,
    props.user
  );

  const openSubmitDialog = (contest) => {
    setContest(contest);
    setOpenSubmit(true);
  };

  const handleClose = () => {
    setOpenSubmit(false);
  };

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
      <ContestForm
        contest={contest}
        user={user}
        openDialog={openSubmit}
        setOpenDialog={(value) => setOpenSubmit(value)}
        setSnackOpen={(value) => setSuccess(value)}
        handleClose={() => handleClose()}
        isVerifying={props.isVerifying}
      />
      <Snackbar
        open={copied}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={4000}
        onClose={() => handleCloseSnack()}
      >
        <Alert onClose={() => handleCloseSnack()} severity="success">
          Copied!
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={4000}
        onClose={() => handleCloseSnack()}
      >
        <Alert onClose={() => handleCloseSnack()} severity="success">
          Your post has been entered! Good luck <span role="img" aria-label="smile">😊</span>
        </Alert>
      </Snackbar>
      <div className="cards">
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
              <Card className="contestContainer" key={i}>
                <CardMedia
                  image={contest.coverImage}
                  title={contest.title}
                  style={{ height: "200px" }}
                />
                <div
                  id="editor-pick"
                  style={{
                    display: disableEnterButton ? "block" : "none",
                    marginBottom: "-28px",
                    width: "74px"
                  }}
                >
                  {" "}
                  <img
                    alt="trophy"
                    src={trophy}
                    width="18px"
                    style={{ verticalAlign: "middle", marginRight: "3px" }}
                  />{" "}
                  Entered
                </div>
                <div
                  className={"MuiCard__head"}
                  style={{
                    marginBottom: "0px",
                    position: disableEnterButton ? "relative" : "initial",
                  }}
                ></div>
                <CardContent style={{ paddingBottom: "0px" }}>
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
                  <center>
                    {!disableEnterButton && props.isAuthenticated ? (
                      <FlatButton
                        label={
                          enterButtonLoading ? (
                            <img
                              width="35px"
                              style={{
                                verticalAlign: "middle",
                                paddingBottom: "2px",
                              }}
                              src={loadingSpinner}
                              alt="loading"
                            />
                          ) : (
                            "Enter"
                          )
                        }
                        primary={true}
                        disabled={disableEnterButton}
                        className={
                          disableEnterButton
                            ? "disabledContestBtn"
                            : "contestBtn"
                        }
                        onClick={() => openSubmitDialog(contest)}
                        style={{
                          marginBottom: "10px",
                          marginTop: "20px",
                        }}
                      />
                    ) : null}
                  </center>
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
                      style={{ marginTop: "0px" }}
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
          <a
            href="https://blog.ratemyshot.co/contact"
            target="_blank"
            rel="noopener noreferrer"
          >
            Help
          </a>{" "}
          |{" "}
          <a
            href="https://blog.ratemyshot.co/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
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
