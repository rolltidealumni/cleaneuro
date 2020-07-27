import { myFirebase } from "../firebase/firebase";
import firebase from 'firebase/app';
import 'firebase/auth';

export const ACCOUNT_REQUEST = "ACCOUNT_REQUEST";
export const ACCOUNT_SUCCESS = "ACCOUNT_SUCCESS";
export const ACCOUNT_FAILURE = "ACCOUNT_FAILURE";
export const VERIFY_ACCOUNT_SUCCESS = "VERIFY_ACCOUNT_SUCCESS";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const VERIFY_REQUEST = "VERIFY_REQUEST";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";

const requestLogin = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const requestAccount = () => {
  return {
    type: ACCOUNT_REQUEST
  };
};

const receiveAccount = confirmationResult => {
  return {
    type: ACCOUNT_SUCCESS,
    confirmationResult
  };
};

const accountError = error => {
  return {
    type: ACCOUNT_FAILURE,
    error
  };
};

const receiveLogin = user => {
  return {
    type: LOGIN_SUCCESS,
    user
  };
};

const loginError = error => {
  return {
    type: LOGIN_FAILURE,
    error
  };
};

const requestLogout = () => {
  return {
    type: LOGOUT_REQUEST
  };
};

const receiveLogout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

const logoutError = error => {
  return {
    type: LOGOUT_FAILURE,
    error
  };
};

const verifyRequest = () => {
  return {
    type: VERIFY_REQUEST
  };
};

const verifySuccess = () => {
  return {
    type: VERIFY_SUCCESS
  };
};

export const loginUser = (email, password) => dispatch => {
  dispatch(requestLogin());
  myFirebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      if(user.emailVerification === false) {
        dispatch(loginError(true));
      } else {
        dispatch(receiveLogin(user));
      }
    })
    .catch(error => {
      dispatch(loginError(true));
      console.log(error.message);
    });
};

export const createUser = (phoneNumber, appVerifier) => dispatch => {
  dispatch(requestAccount());
  myFirebase
    .auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function (confirmationResult) {
      dispatch(receiveAccount(confirmationResult));
      window.confirmationResult = confirmationResult;
    }).catch(function (error) {
  });
};

export const verifyAccount = (user) => dispatch => {
  dispatch(requestAccount());
  user.sendEmailVerification().then(function() {
    myFirebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(receiveAccount());

    })
  }).catch(function(error) {
    dispatch(accountError(error.message));
  });
}

export const verifyLink = (user, url) => dispatch => {
  dispatch(verifyRequest());
  myFirebase.auth().signInWithEmailLink(user, url.href)
    .then(function(result) {
      dispatch(receiveLogin(user));
      dispatch(verifySuccess(user));
    })
    .catch(function(error) {
      dispatch(loginError(true));
    });
}

export const logoutUser = () => dispatch => {
  dispatch(requestLogout());
  myFirebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(receiveLogout());
    })
    .catch(error => {
      dispatch(logoutError());
    });
};

export const verifyAuth = () => dispatch => {
  dispatch(verifyRequest());
  myFirebase
    .auth()
    .onAuthStateChanged(user => {
      myFirebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
      if (user !== null) {
        dispatch(receiveLogin(user));
        dispatch(verifySuccess());
      } else {
        dispatch(verifySuccess());
      }
    });
};
export * from "./auth";
import React, { useState } from "react";
import "firebase/storage";
import jquery from 'jquery';
import FlatButton from "material-ui/FlatButton";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import loadingSpinner from "../static/loading.gif";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from '@material-ui/lab/Autocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';
import InputLabel from "@material-ui/core/InputLabel";
import DialogTitle from "@material-ui/core/DialogTitle";
import Switch from "@material-ui/core/Switch";
import locationLogo from "../static/location.svg";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import lens from "../static/lens.svg";
import exit from "../static/close.svg";
import cameraLogo from "../static/camera-two.svg";
import aperture from "../static/aperture.svg";
import category from "../static/label.svg";
import cameraList from "../static/cameras";
import apertureList from "../static/aperture";
import lensList from "../static/lenses";
import realTime from "../firebase/firebase";

const Admin = (props) => {
  const [cameraInput, setCameraInput] = useState(props.post.camera);
  const [location, setLocation] = useState(props.post.location);
  const [lensInput, setLensInput] = useState(props.post.lens);
  const [loading, setLoading] = useState(false);
  const [apertureInput, setApertureInput] = useState(props.post.aperture);
  const [categoryInput, setCategoryInput] = useState(props.post.category);
  const image = props.post ? props.post.imageLink : "";
  const [editorspick, setEditorsPick] = useState(props.post.editorspick);

  const selectLocation = (address, placeId) => {
    // geocodeByAddress(address)
    //   .then(results => {
    //     getLatLng(results[0])
    //     setLocation(results[0].formatted_address);
    //   })
    //   .then(results => {console.log(results[0].address_components[0].long_name + ", " + results[0].address_components[2].short_name);})
    //   .catch(error => {});
  }

  const RedSwitch = withStyles({
    switchBase: {
      color: "lightgray",
      "&$checked": {
        color: "#fbc02d",
      },
      "&$checked + $track": {
        backgroundColor: "lightgray",
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const handleSubmit = (e) => {
    setLoading(true);
    realTime.ref("posts/" + props.post.key).update({
      editorspick: editorspick || false,
      location: jquery('#combo-box-demo').val() === "" ? props.post.location : jquery('#combo-box-demo').val(),
      aperture: apertureInput,
      lens: lensInput,
      camera: cameraInput,
      category: categoryInput,
    });
    props.setOpenDialog(false);
    props.setSnackOpen(true);
    setCameraInput("");
    setLensInput("");
    setApertureInput("");
    setCategoryInput("");
  };

  const handleDelete = (e) => {
    setLoading(true);
    realTime.ref("posts/" + props.post.key).remove();
    props.setOpenDialog(false);
    setCameraInput("");
    setLensInput("");
    setApertureInput("");
    setCategoryInput("");
  };


  return (
    <Dialog open={props.openDialog} id="admin-modal">
      <DialogTitle id="form-dialog-title">
        <span style={{ position: 'relative', left: '-136px', fontWeight: "bold" }}>Edit{" "}</span>
        <span
          style={{
            float: 'left',
            margin: '0px',
            fontSize: '14px',
            marginBottom: '0px',
            position: 'static',
            marginTop: '30px'
          }}
        >
          Editor's Pick
          <RedSwitch
            checked={editorspick}
            onChange={(e) => setEditorsPick(!editorspick)}
            name="checkedA"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </span>
        <img
          alt="close"
          src={exit}
          onClick={() => props.handleClose()}
          width="18px"
          style={{ 
            cursor: 'pointer',
            verticalAlign: 'middle',
            marginRight: '5px',
            position: 'absolute',
            right: '15px',
            top: '19px' }}
        />
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            backgroundImage: "url('" + image + "')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginBottom: "20px",
            marginTop: "0px",
            height: "180px",
          }}
        ></div>
        <PlacesAutocomplete
          value={location}
          style={{ width: '100%' }}
          onChange={value => setLocation(value)}
          onSelect={value => selectLocation(value)}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <FormControl variant="outlined" style={{ width: '100%', marginTop: '10px' }}>
                <Autocomplete
                  id="combo-box-demo"
                  options={suggestions}
                  getOptionLabel={(option) => option.description}
                  style={{ width: '100%' }}
                  onSelect={option => selectLocation(location)}
                  renderInput={(params) => <TextField value={location} label={
                    <span>
                      <img
                        alt="location"
                        src={locationLogo}
                        width="18px"
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />
                      <span style={{ verticalAlign: "middle" }}>{location}</span>
                    </span>
                  }
                    {...params} variant="outlined" {...getInputProps({
                      placeholder: "Location",
                      className: 'location-search-input',
                    })} />}
                />
              </FormControl>
            </div>
          )}
        </PlacesAutocomplete>
        <FormControl variant="outlined" className="half-inputs">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="camera"
                src={cameraLogo}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Camera</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={cameraInput}
            onChange={(e) => setCameraInput(e.target.value)}
            label={
              <span>
                <img
                  alt="camera"
                  src={cameraLogo}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Camera</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {cameraList.map((camera, i) => {
              return (
                <MenuItem key={i} value={camera}>
                  {camera}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="half-inputs-right">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="lens"
                src={lens}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Lens</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={lensInput}
            onChange={(e) => setLensInput(e.target.value)}
            label={
              <span>
                <img
                  alt="lens"
                  src={lens}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Lens</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {lensList.map((lens, i) => {
              return (
                <MenuItem key={i} value={lens}>
                  {lens}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="half-inputs">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="aperture"
                src={aperture}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Aperture</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={apertureInput}
            onChange={(e) => setApertureInput(e.target.value)}
            label={
              <span>
                <img
                  alt="category"
                  src={aperture}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Aperture</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {apertureList.map((aperture, i) => {
              return (
                <MenuItem key={i} value={aperture}>
                  {aperture}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="half-inputs-right">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="lens"
                src={category}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Category</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            label={
              <span>
                <img
                  alt="lens"
                  src={category}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Category</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>none</em>
            </MenuItem>
            <MenuItem value={"automotive"}>automotive</MenuItem>
            <MenuItem value={"black & white"}>black & white</MenuItem>
            <MenuItem value={"cityscape"}>cityscape</MenuItem>
            <MenuItem value={"film"}>film</MenuItem>
            <MenuItem value={"landscape"}>landscape</MenuItem>
            <MenuItem value={"nature"}>nature</MenuItem>
            <MenuItem value={"portrait"}>portrait</MenuItem>
          </Select>
        </FormControl>
        <center>
          <FlatButton
            label={
              loading ? (
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
                  "SAVE"
                )
            }
            primary={true}
            className="submitBtn"
            onClick={(e) => handleSubmit(e)}
            style={{ marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
          />
          <FlatButton
            label={
              loading ? (
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
                  "DELETE"
                )
            }
            primary={true}
            className="deleteBtn"
            onClick={(e) => handleDelete(e)}
            style={{ marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
          />
        </center>
      </DialogContent>
    </Dialog>
  );
};

export default Admin;

import React from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Home";
import Contests from "./Contests";
import Login from "./Login";
import MyPosts from "./Posts/MyPosts";
import UniquePost from "./Posts/UniquePost";

function App(props) {
  const { isAuthenticated, isVerifying, user } = props;

  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
      >
        <Home {...props} />
      </ProtectedRoute>
      <Route path="/login" render={(props) => <Login {...props} />} />
      <Route path="/activate" render={(props) => <Login {...props} />} />
      <Route path="/post/:id" render={(props) => <UniquePost isAuthenticated={isAuthenticated} user={user} {...props} />} />
      <Route path="/contests" render={(props) => <Contests {...props} />} />
      <Route path="/analytics" render={(props) => <MyPosts isAuthenticated={isAuthenticated} user={user}{...props} />} />
    </Switch>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps)(App);

import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import pencilLogo from "../static/pencil.svg";
import FlatButton from "material-ui/FlatButton";
import TextField from "@material-ui/core/TextField";
import loadingSpinner from "../static/loading.gif";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import InputLabel from "@material-ui/core/InputLabel";
import DialogContentText from "@material-ui/core/DialogContentText";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ImageUploader from "react-images-upload";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import lens from "../static/lens.svg";
import cameraLogo from "../static/camera-two.svg";
import aperture from "../static/aperture.svg";
import cameraList from "../static/cameras";
import apertureList from "../static/aperture";
import lensList from "../static/lenses";
import realTime from "../firebase/firebase";

const ContestForm = (props) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [cameraInput, setCameraInput] = useState("");
  const [lensInput, setLensInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apertureInput, setApertureInput] = useState("");
  const [imageLoading, setImageLoading] = useState(0);
  const [hideUploader, setHideUploader] = useState(false);

  const onDrop = (picture, data) => {
    setHideUploader(true);
    var base64 = data[0].substring(data[0].indexOf(",") + 1);
    let storageRef = firebase.storage().ref();
    let path = `images/${picture[0].name}`;
    let uploadTask = storageRef.child(path).putString(base64, "base64");
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageLoading(progress);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            break;
          case firebase.storage.TaskState.RUNNING:
            break;
          default:
            break;
        }
      },
      function (error) {
        // Handle unsuccessful uploads
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          setImage(downloadURL);
        });
      }
    );
  };

  const handleSubmit = (e) => {
    let postsRef = realTime.ref("contest-submissions");
    setLoading(true);
    if (image) {
      postsRef.push({
        contest: props.contest.key,
        imageLink: image,
        caption: caption,
        submitted: new Date().toString(),
        aperture: apertureInput,
        lens: lensInput,
        camera: cameraInput,
        user: props.user
      });
      props.setOpenDialog(false);
      props.setSnackOpen(true);
      setHideUploader(false);
      setLoading(false);
      setCameraInput("");
      setLensInput("");
      setApertureInput("");
      setImage(null);
    }
  };

  return (
    <Dialog open={props.openDialog}>
      <DialogTitle id="form-dialog-title">{props.contest ? props.contest.title : " "} Contest Entry</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span
            style={{
              margin: "0px",
              marginTop: "0px",
              fontSize: "14px",
              color: "#212121",
            }}
          >
            All fields are required.
          </span>
          <br />
        </DialogContentText>
        {imageLoading > 0 && imageLoading < 100 && !image ? (
          <LinearProgress variant="determinate" value={imageLoading} color="primary" />
        ) : image && imageLoading === 100 ? (
          <div
            style={{
              backgroundImage: "url('" + image + "')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginBottom: "20px",
              marginTop: "20px",
              height: "180px",
            }}
          ></div>
        ) : !hideUploader ? (
          <ImageUploader
            withIcon={true}
            withPreview={false}
            buttonText="Choose image"
            label="Max file size: 20mb, accepted: jpg, gif, png, jpeg"
            onChange={(picture, other) => onDrop(picture, other)}
            imgExtension={[".jpg", ".jpeg", ".png", ".gif"]}
            maxFileSize={20242880}
            singleImage={true}
          />
        ) : null}
        <TextField
          fullWidth={true}
          helperText={caption.length > 15 ? "Caption cannot exceed 15 characters" : null}
          variant="outlined"
          error={caption.length > 15}
          style={{ marginTop: "10px", marginBottom: "5px", color: "#212121" }}
          label={
            <span>
              <img
                alt="security"
                src={pencilLogo}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Caption</span>
            </span>
          }
          onKeyPress={(e) => setCaption(e.target.value)}
          onFocus={(e) => setCaption(e.target.value)}
          onBlur={(e) => setCaption(e.target.value)}
          onChange={(e) => setCaption(e.target.value)}
        />
        <FormControl variant="outlined" className="half-inputs">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="camera"
                src={cameraLogo}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Camera</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={cameraInput}
            onChange={(e) => setCameraInput(e.target.value)}
            label={
              <span>
                <img
                  alt="camera"
                  src={cameraLogo}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Camera</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {cameraList.map((camera, i) => {
              return (
                <MenuItem key={i} value={camera}>
                  {camera}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="half-inputs-right">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="lens"
                src={lens}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Lens</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={lensInput}
            onChange={(e) => setLensInput(e.target.value)}
            label={
              <span>
                <img
                  alt="lens"
                  src={lens}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Lens</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {lensList.map((lens, i) => {
              return (
                <MenuItem key={i} value={lens}>
                  {lens}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="full-inputs">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="aperture"
                src={aperture}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Aperture</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={apertureInput}
            onChange={(e) => setApertureInput(e.target.value)}
            label={
              <span>
                <img
                  alt="category"
                  src={aperture}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Aperture</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {apertureList.map((aperture, i) => {
              return (
                <MenuItem key={i} value={aperture}>
                  {aperture}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <center>
          <FlatButton
            label={
              loading ? (
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
                "Submit"
              )
            }
            primary={true}
            className="submitBtn"
            disabled={!image || caption === ""}
            onClick={(e) => handleSubmit(e)}
            style={{ marginBottom: "10px", width: "100%", marginTop: "20px" }}
          />
          <br />
          <FlatButton
            label="Cancel"
            primary={true}
            className="cancelBtn"
            onClick={() => props.handleClose()}
            style={{ marginBottom: "10px", width: "100%" }}
          />
        </center>
      </DialogContent>
    </Dialog>
  );
};

export default ContestForm;

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
      <div id="footerArea">
          <span id="footer">
            © Rate My Shot / All Rights Reserved /{" "}
            <a href="https://blog.ratemyshot.co/contact" target="_blank" rel="noopener noreferrer" >
              Help
            </a>{" "}
            /{" "}
            <a href="https://blog.ratemyshot.co/privacy" target="_blank" rel="noopener noreferrer" >
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

import React, { useState } from "react";
// import firebase from "firebase/app";
import "firebase/storage";
// import jquery from 'jquery';
import FlatButton from "material-ui/FlatButton";
import loadingSpinner from "../static/loading.gif";
import Dialog from "@material-ui/core/Dialog";
import review from "../static/star-fill.svg";
import StarRatings from "react-star-ratings";
import cameraLogo from "../static/camera-two.svg";
// import heartEmpty from "../static/heart-empty.svg";
// import heartFill from "../static/heart-fill.svg";
import aperture from "../static/aperture.svg";
// import Chip from '@material-ui/core/Chip';
import category from "../static/label.svg";
import lens from "../static/lens.svg";
import exit from "../static/close.svg";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import realTime from "../firebase/firebase";

const Critique = (props) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  // const [chipsTouched, setChipsTouched] = useState([]);
  // let chips = [
  //   {key: 0, label: "Lighting"},
  //   {key: 1, label:"Color"},
  //   {key: 2, label:"Composition"},
  //   {key: 3, label:"Emotion"},
  //   {key: 4, label:"Focus"},
  //   {key: 5, label:"Concept"},
  //   {key: 6, label:"Crop"},
  //   {key: 7, label:"Perspective"}
  // ];

  // const selectChip = (chip) => {
  //   chipsTouched.push({key: chip.key, label: chip.label});
  //   setChipsTouched(chipsTouched);
  // }

  // const deSelectChip = (chip) => {
  //   setChipsTouched((chipsTouched) => chipsTouched.filter((x) => x.key !== chip.key));
  // }

  // const handleSubmit = (e) => {
  //   let postsRef = realTime.ref("posts");
  //   setLoading(true);
  //   postsRef.push({
  //     location: jquery('#combo-box-demo').val(),
  //     submitted: new Date().toString(),
  //     oneStar: 0,
  //     twoStars: 0,
  //     threeStars: 0,
  //     fourStars: 0,
  //     fiveStars: 0,
  //     total: 0,
  //   });
  // };

  const changeRating = (newRating, name) => {
    setRating(newRating);
  };

  // const isSelected = (chip) => {
  //   const selected = chipsTouched.filter((x) => x.key === chip.key).length > 0; 
  //   if (selected) deSelectChip(chip);
  //   else selectChip(chip);
  // };

  // const chipFocus = (chip) => {
  //    return chipsTouched.filter((x) => x.key === chip.key).length > 0; 
  // }

  const updateRating = () => {
    let postRef = realTime.ref("posts/" + props.post.key);
    let critiqueRef = realTime.ref("post-critiques");
    setLoading(true);
    if (rating === 1) {
      postRef.update({
        oneStar: props.post.oneStar + 1,
        total: props.post.total + 1,
      });
    } else if (rating === 2) {
      postRef.update({
        twoStars: props.post.twoStars + 1,
        total: props.post.total + 1,
      });
    } else if (rating === 3) {
      postRef.update({
        threeStars: props.post.threeStars + 1,
        total: props.post.total + 1,
      });
    } else if (rating === 4) {
      postRef.update({
        fourStars: props.post.fourStars + 1,
        total: props.post.total + 1,
      });
    } else if (rating === 5) {
      postRef.update({
        fiveStars: props.post.fiveStars + 1,
        total: props.post.total + 1,
      });
    }
    critiqueRef.push({
      Composition: 0,
      Concept: 0,
      Crop: 0,
      Emotion: 0,
      Focus: 0,
      Lighting: 0,
      Perspective: 0,
      Rating: rating,
      post: props.post.key,
      uid: props.user.uid,
      submitted: new Date().toString(),
    });
    setLoading(false);
    props.handleClose();
  };

  return (
    <Dialog open={props.openDialog} id="admin-modal" style={{ width: '100%' }}>
      <DialogTitle id="form-dialog-title">{props.user.uid !== props.post.author ? "Critique" : "Analytics"}
        <img
          alt="close"
          src={exit}
          onClick={() => props.handleClose()}
          width="18px"
          style={{
            cursor: 'pointer',
            verticalAlign: 'middle',
            marginRight: '5px',
            position: 'absolute',
            right: '15px',
            top: '19px'
          }}
        />
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            backgroundImage: "url('" + props.post.imageLink + "')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginBottom: "20px",
            marginTop: "0px",
            height: "200px",
            borderRadius: "4px",
            width: '100%'
          }}
        ></div>
        <div>
          <span>{props.post.location}</span>
          <span
            style={{
              paddingLeft: '40px',
              borderRadius: '4px',
              marginBottom: '20px',
              paddingTop: '0px !important',
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
            {props.post.camera}
            <img
              alt="aperture"
              src={aperture}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '15px' }}
            />{" "}
            {props.post.aperture}
            <img
              alt="lens"
              src={lens}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '15px' }}
            />{" "}
            {props.post.lens}
            <img
              alt="category"
              src={category}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '15px' }}
            />{" "}
            {props.post.category}
          </span>
        </div>
        {props.user.uid !== props.post.author ?
          <center><StarRatings
            rating={rating}
            starRatedColor="#212121"
            starDimension="25px"
            starHoverColor="#212121"
            changeRating={(rating) => changeRating(rating)}
            numberOfStars={5}
            name="rating"
          />
          </center> :
          <span>
            <ul className="stats">
              <li>
                <img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                />{" "}{props.post.oneStar}
              </li>
              <li>
                <img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                /><img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                />{" "}{props.post.twoStars}
              </li>
              <li>
                <img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                /><img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                /><img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                />{" "}{props.post.threeStars}
              </li>
              <li>
                <img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                /><img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                /><img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                /><img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                />{" "}{props.post.fourStars}
              </li>
              <li>
                <img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                /><img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                /><img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                /><img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                />{" "}<img
                  alt="star"
                  src={review}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "3px" }}
                />{props.post.fiveStars}
              </li>
            </ul>
          </span>}
        {/* <div style={{marginTop: '20px'}}>
            {chips.map(chipy => {
              return (
                <Chip
                  onClick={() => isSelected(chipy)}
                  mode="outlined"
                  key={chipy.key}
                  label={
                    !chipFocus(chipy) ?
                      <span style={{
                        color: chipFocus(chipy) ? '#FBC02D !important' : 'black !important',
                        fontWeight: chipFocus(chipy) ? '500 !important' : 'normal !important'
                      }}>
                        {chipy.label}
                        <img
                          alt="heart"
                          src={heartEmpty}
                          width="18px"
                          style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '18px', width: '15px' }}
                        />
                      </span> :
                      <span style={{
                        color: chipFocus(chipy) > 0 ? '#FBC02D !important' : 'black !important',
                        fontWeight: chipFocus(chipy) > 0 ? '500 !important' : 'normal !important'
                      }}>
                        {chipy.label}
                        <img
                          alt="heart"
                          src={heartFill}
                          width="18px"
                          style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '18px', width: '15px' }}
                        />
                      </span>
                  }
                  style={{
                    margin: "5px",
                    height: "35px",
                    backgroundColor: 'white',
                    borderColor: chipFocus(chipy) ? '#FBC02D' : 'rgb(186, 186, 186)', 
                    borderWidth: "1px",
                    borderStyle: "solid"
                  }}
                />
              )
            })}
          </div> */}
        {props.user.uid !== props.post.author ?
          <center>
            <FlatButton
              label={
                loading ? (
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
                    "Submit"
                  )
              }
              primary={true}
              className="submitBtn"
              onClick={() => updateRating()}
              style={{ marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
            />
          </center> : null}
      </DialogContent>
    </Dialog >
  );
};

export default Critique;

import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import jquery from 'jquery';
import FlatButton from "material-ui/FlatButton";
import TextField from "@material-ui/core/TextField";
import loadingSpinner from "../static/loading.gif";
import Dialog from "@material-ui/core/Dialog";
import exit from "../static/close.svg";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from "@material-ui/core/InputLabel";
import DialogContentText from "@material-ui/core/DialogContentText";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import ImageUploader from "react-images-upload";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import lens from "../static/lens.svg";
import locationLogo from "../static/location.svg";
import cameraLogo from "../static/camera-two.svg";
import aperture from "../static/aperture.svg";
import category from "../static/label.svg";
import cameraList from "../static/cameras";
import apertureList from "../static/aperture";
import lensList from "../static/lenses";
import realTime from "../firebase/firebase";

const Form = (props) => {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [cameraInput, setCameraInput] = useState("");
  const [lensInput, setLensInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apertureInput, setApertureInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [imageLoading, setImageLoading] = useState(0);
  const [hideUploader, setHideUploader] = useState(false);

  const selectLocation = (address, placeId) => {
    geocodeByAddress(address)
      .then(results => {
        getLatLng(results[0])
        setLocation(results[0].address_components[0].long_name + ", " + results[0].address_components[2].short_name);
      })
      .then(latLng => {})
      .catch(error => {});
  }

  const onDrop = (picture, data) => {
    setHideUploader(true);
    var base64 = data[0].substring(data[0].indexOf(",") + 1);
    let storageRef = firebase.storage().ref();
    let path = `images/${picture[0].name}`;
    let uploadTask = storageRef.child(path).putString(base64, "base64");
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageLoading(progress);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            break;
          case firebase.storage.TaskState.RUNNING:
            break;
          default:
            break;
        }
      },
      function (error) {
        // Handle unsuccessful uploads
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          setImage(downloadURL);
        });
      }
    );
  };

  const handleSubmit = (e) => {
    let postsRef = realTime.ref("posts");
    setLoading(true);
    if (image) {
      postsRef.push({
        imageLink: image,
        location: jquery('#combo-box-demo').val(),
        submitted: new Date().toString(),
        aperture: apertureInput,
        lens: lensInput,
        camera: cameraInput,
        author: props.user,
        category: categoryInput,
        editorspick: false,
        oneStar: 0,
        twoStars: 0,
        threeStars: 0,
        fourStars: 0,
        fiveStars: 0,
        total: 0,
      });
      props.setOpenDialog(false);
      props.setSnackOpen(true);
      setHideUploader(false);
      setLoading(false);
      setCameraInput("");
      setLensInput("");
      setApertureInput("");
      setCategoryInput("");
      setImage(null);
    }
  };

  return (
    <Dialog open={props.openDialog} id="admin-modal" style={{ width: '100%' }}>
      <DialogTitle id="form-dialog-title">Post{" "}
        <img
          alt="close"
          src={exit}
          onClick={() => props.handleClose()}
          width="18px"
          style={{
            cursor: 'pointer',
            verticalAlign: 'middle',
            marginRight: '5px',
            position: 'absolute',
            right: '15px',
            top: '19px'
          }}
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span
            style={{
              margin: "0px",
              marginTop: "0px",
              fontSize: "14px",
              color: "#212121",
            }}
          >
            All fields are required.
          </span>
          <br />
        </DialogContentText>
        {imageLoading > 0 && imageLoading < 100 && !image ? (
          <LinearProgress variant="determinate" value={imageLoading} color="primary" />
        ) : image && imageLoading === 100 ? (
          <div
            style={{
              backgroundImage: "url('" + image + "')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginBottom: "20px",
              marginTop: "20px",
              height: "180px",
            }}
          ></div>
        ) : !hideUploader ? (
          <ImageUploader
            withIcon={true}
            withPreview={false}
            buttonText="Choose image"
            label="Max file size: 20mb, accepted: jpg, gif, png, jpeg"
            onChange={(picture, other) => onDrop(picture, other)}
            imgExtension={[".jpg", ".jpeg", ".png", ".gif"]}
            maxFileSize={20242880}
            singleImage={true}
          />
        ) : null}
        <PlacesAutocomplete
          value={location}
          style={{ width: '100%' }}
          onChange={value => setLocation(value)}
          onSelect={value => selectLocation(value)}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <FormControl variant="outlined" style={{ width: '100%', marginTop: '10px' }}>
                <Autocomplete
                  id="combo-box-demo"
                  options={suggestions}
                  getOptionLabel={(option) => option.description}
                  style={{ width: '100%' }}
                  onSelect={option => selectLocation(location)}
                  renderInput={(params) => <TextField value={location} label={
                    <span>
                      <img
                        alt="location"
                        src={locationLogo}
                        width="18px"
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />
                      <span style={{ verticalAlign: "middle" }}>Location</span>
                    </span>
                  }
                    {...params} variant="outlined" {...getInputProps({
                      placeholder: "Location",
                      className: 'location-search-input',
                    })} />}
                />
              </FormControl>
            </div>
          )}
        </PlacesAutocomplete>
        <FormControl variant="outlined" className="half-inputs">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="camera"
                src={cameraLogo}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Camera</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={cameraInput}
            onChange={(e) => setCameraInput(e.target.value)}
            label={
              <span>
                <img
                  alt="camera"
                  src={cameraLogo}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Camera</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {cameraList.map((camera, i) => {
              return (
                <MenuItem key={i} value={camera}>
                  {camera}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="half-inputs-right">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="lens"
                src={lens}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Lens</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={lensInput}
            onChange={(e) => setLensInput(e.target.value)}
            label={
              <span>
                <img
                  alt="lens"
                  src={lens}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Lens</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {lensList.map((lens, i) => {
              return (
                <MenuItem key={i} value={lens}>
                  {lens}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="half-inputs">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="aperture"
                src={aperture}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Aperture</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={apertureInput}
            onChange={(e) => setApertureInput(e.target.value)}
            label={
              <span>
                <img
                  alt="category"
                  src={aperture}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Aperture</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {apertureList.map((aperture, i) => {
              return (
                <MenuItem key={i} value={aperture}>
                  {aperture}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="half-inputs-right">
          <InputLabel id="demo-simple-select-outlined-label">
            <span>
              <img
                alt="lens"
                src={category}
                width="18px"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              <span style={{ verticalAlign: "middle" }}>Category</span>
            </span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            label={
              <span>
                <img
                  alt="lens"
                  src={category}
                  width="18px"
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                <span style={{ verticalAlign: "middle" }}>Category</span>
              </span>
            }
          >
            <MenuItem value="">
              <em>none</em>
            </MenuItem>
            <MenuItem value={"automotive"}>automotive</MenuItem>
            <MenuItem value={"black & white"}>black & white</MenuItem>
            <MenuItem value={"cityscape"}>cityscape</MenuItem>
            <MenuItem value={"film"}>film</MenuItem>
            <MenuItem value={"landscape"}>landscape</MenuItem>
            <MenuItem value={"nature"}>nature</MenuItem>
            <MenuItem value={"portrait"}>portrait</MenuItem>
          </Select>
        </FormControl>
        <center>
          <FlatButton
            label={
              loading ? (
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
                  "Submit"
                )
            }
            primary={true}
            className="submitBtn"
            disabled={!image || location === ""}
            onClick={(e) => handleSubmit(e)}
            style={{ marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
          />
        </center>
      </DialogContent>
    </Dialog >
  );
};

export default Form;

import React, { useState } from "react";
import { connect } from "react-redux";
import "firebase/storage";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import admin from "../static/admin";
import Nav from "./Nav";
import Admin from "./Admin";
import Form from "./Form";
import Critique from "./Critique";
import Slide from '@material-ui/core/Slide';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import camera from "../static/camera.svg";
import Posts from "./Posts/Posts";
import realTime from "../firebase/firebase";
import { logoutUser } from "../actions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Home(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openCritique, setOpenCritique] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [critiquePost, setCritiquePost] = useState(null);
  const [adminFlag, setAdminFlag] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [userID, setUserID] = useState(false);
  let history = useHistory();
  const isAdmin = props.user
    ? admin.filter((a) => props.user.phoneNumber === a)
    : false;
  if (
    props.user &&
    isAdmin[0] === props.user.phoneNumber &&
    !adminFlag &&
    props.user.phoneNumber !== undefined
  ) {
    setUserID(props.user.uid);
    setAdminFlag(true);
  }

  if (!isAdmin && !userID) {
    setUserID(props.user.uid);
  }

  const handleOpen = () => {
    if (!props.isAuthenticated) {
      history.push("/login");
    } else {
      setOpenDialog(true);
    }
  };

  const handleOpenCritique = (post) => {
    !openCritique && setCritiquePost(post);
    openCritique && setCritiquePost(null);
    setOpenCritique(!openCritique);
  }

  const navigate = () => {
    var win = window.open("http://blog.ratemyshot.co/", "_blank");
    win.focus();
  };

  const logout = () => {
    const { dispatch } = props;
    dispatch(logoutUser());
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const login = () => {
    history.push("/login");
  };

  const handleClose = () => {
    setOpenDialog(false);
    setUpdateOpen(false);
    setSnackOpen(false);
    setShowEditModal(false);
  };

  const openZoomModal = (image) => {
    setZoomImage(image);
    setShowZoomModal(true);
  };

  const openEditModal = (post) => {
    setEditPost(post);
    setShowEditModal(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <div style={{ marginTop: "16px", color: "#212121" }}>
      {!props.loginFlag ? (
        <Tooltip title="Post">
          <div onClick={() => handleOpen()} id="cameraBtn">
            <img
              alt="logo"
              className="iconNav"
              style={{ width: "20px" }}
              src={camera}
            />
          </div>
        </Tooltip>
      ) : null}
      <Nav
        loginFlag={false}
        handleOpen={() => handleOpen()}
        logout={() => logout()}
        login={() => login()}
        isVerifying={props.isVerifying}
        isAuthenticated={props.isAuthenticated}
      />
      <Snackbar
        id="snack"
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => handleClose()}
      >
        <Alert onClose={() => handleCloseSnack()} severity="success">
          Your photo was submitted!
        </Alert>
      </Snackbar>
      <Snackbar
        id="snack"
        open={updateOpen}
        autoHideDuration={6000}
        onClose={() => handleClose()}
      >
        <Alert onClose={() => handleCloseSnack()} severity="success">
          Post updated!
        </Alert>
      </Snackbar>
      <Dialog
        maxWidth="lg"
        keepMounted
        TransitionComponent={Transition}
        onBackdropClick={() => setShowZoomModal(false)}
        open={showZoomModal}
        id="zoomModal"
        fullWidth={true}
      >
        <img
          alt="zoomimage"
          src={zoomImage}
          width="100%"
          height="auto"
          onClick={() => setShowZoomModal(false)}
        />
      </Dialog>
      {showEditModal ? (
        <Admin
          openDialog={showEditModal}
          post={editPost}
          setOpenDialog={(value) => setShowEditModal(value)}
          setSnackOpen={(value) => setUpdateOpen(value)}
          handleClose={() => handleClose()}
          isVerifying={props.isVerifying}
        />
      ) : null}
      {openCritique ? (
        <Critique
          openDialog={openCritique}
          post={critiquePost}
          setOpenDialog={() => setOpenCritique()}
          handleClose={() => setOpenCritique()}
          {...props}
        />
      ) : null}
      <Form
        openDialog={openDialog}
        setOpenDialog={(value) => setOpenDialog(value)}
        setSnackOpen={(value) => setSnackOpen(value)}
        handleClose={() => handleClose()}
        user={userID}
        isVerifying={props.isVerifying}
      />
      <Posts
        firebase={realTime}
        openCritique={(post) => handleOpenCritique(post)}
        showZoomModal={(image) => openZoomModal(image)}
        showEditModal={(post) => openEditModal(post)}
        adminFlag={adminFlag}
        {...props}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps)(Home);

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { myFirebase } from "../firebase/firebase";
import validator from "validator";
import { makeStyles } from "@material-ui/core/styles";
import arrow from "../static/arrow.svg";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";
import exit from "../static/close.svg";
import CardActions from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ReactCodeInput from 'react-verification-code-input';
import loadingSpinner from "../static/loading.gif";

const CssTextField = makeStyles((theme) => ({
  root: {
    "& input:valid:hover + fieldset": {
      borderColor: "#FBC02D",
      borderWidth: 2,
    },
    "& input:valid:focus + fieldset": {
      borderColor: "#FBC02D",
      padding: "4px !important", // override inline-style
    },
    "&input:-internal-autofill-selected": {
      backgroundColor: "lightcoral !important",
    },
  },
  focused: {},
}));

function Login(props) {
  let history = useHistory();
  const classes = CssTextField();
  let { isAuthenticated } = props;
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [verifyCodeFlag, setVerifyCodeFlag] = useState(props.verifyCode);
  const [verificationCode, setVerificationCode] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState({});
  const [appVerifier, setAppVerifier] = useState(null);

  const handleSubmit = () => {
    if (verifyCodeFlag) {
      setLoading(true);
      const credential = firebase.auth.PhoneAuthProvider.credential(
        confirmationResult,
        verificationCode
      );
      myFirebase
        .auth()
        .signInWithCredential(credential)
        .then(function (result) {
          setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          setApiError(error.code);
        });
    } else {
      setLoading(true);
      setError(false);
      if (validator.isMobilePhone(phone)) {
        myFirebase
          .auth()
          .signInWithPhoneNumber(phone, appVerifier)
          .then(function (confirmationResult) {
            setVerifyCodeFlag(true);
            setLoading(false);
            setError(false);
            setConfirmationResult(confirmationResult.verificationId);
          })
          .catch(function (error) {
            setLoading(false);
            setApiError(error.code);
          });
      }
    }
  };

  const validatePhone = (phone) => {
    setPhone(phone);
    if (validator.isMobilePhone(phone) && !phone.includes("+") === false) {
      setError(false);
      setApiError(null);
    } else {
      setError(true);
    }
  };

  const validateCode = (code) => {
    setVerificationCode(code);
    if (verifyCodeFlag === true) {
      if (code == null) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "submit-account",
        {
          size: "invisible",
          callback: function (response) {
            handleSubmit();
          },
        }
      );
      setAppVerifier(window.recaptchaVerifier);
    };
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [phone, verifyCodeFlag]);

  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    return (
      <div>
        <div id="login-cover-image" />
        <img
          alt="close"
          src={exit}
          onClick={() => history.push("/")}
          width="18px"
          style={{
            cursor: 'pointer',
            verticalAlign: 'middle',
            marginRight: '5px',
            position: 'absolute',
            right: '15px',
            top: '19px'
          }}
        />
        <div
          id="login-right"
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "16px",
            width: "40%",
            float: "right",
            fontFamily: "Nunito",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" style={{ padding: "20px" }}>
            <div className="wrapper" style={{ cursor: "pointer" }} onClick={() => history.push("/")}></div>
          </Typography>
          <div id="blurb">
            Artive is <br />
            <span> a judgement-free,{" "}</span><br />
            <span style={{ color: "#FBC02D", fontWeight: "500" }}>
              anonymous{" "}
            </span><br />
            photography sharing platform<br />
            <span>that gives you a{" "}</span>
            <span style={{ color: "#FBC02D", fontWeight: "500" }}>
              no-bullshit{" "}
            </span><br />
            <span>creative space</span><br />
            <span>to become a <span style={{ color: "#FBC02D", fontWeight: "500" }}>better artist</span>.</span>
          </div>
          {!verifyCodeFlag ?
            <TextField
              InputProps={{ classes, disableUnderline: true }}
              style={{
                margin: "5px",
                width: "50%",
                marginBottom: "10px",
                marginTop: "21px",
              }}
              id="phone"
              placeholder={"Mobile Phone"}
              onChange={(e) => validatePhone(e.target.value)}
              error={error || apiError !== null}
              helperText={
                error
                  ? "Invalid phone number. Must begin with + and country code"
                  : apiError
                    ? apiError
                    : null
              }
              type="tel"
              disabled={verifyCodeFlag}
              variant="outlined"
            /> :
            <ReactCodeInput
              style={{
                margin: "5px",
                width: "50%",
                marginBottom: "10px",
                marginTop: "21px",
                backgroundColor: !verifyCodeFlag ? "lightgray" : undefined,
              }}
              id="code"
              onComplete={(e) => validateCode(e)}
            />}
          <CardActions
            className="loginButtonContainer"
            style={{ backgroundColor: "white" }}
          >
            <FlatButton
              className={
                !error && phone !== null
                  ? "gagunkbtn-submit"
                  : "gagunkbtn-submit-disabled"
              }
              id="submit-account"
              disabled={error || phone == null || loading}
              label={
                loading ? (
                  <img
                    width="35px"
                    style={{
                      verticalAlign: "middle",
                      paddingBottom: "4px",
                    }}
                    src={loadingSpinner}
                    alt="loading"
                  />
                ) : (
                    <img src={arrow} fill={"grey"} height={20} alt="arrow" />
                  )
              }
              onClick={() => handleSubmit()}
            />
          </CardActions>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    isAuthenticated: state.auth.isAuthenticated,
    verifyCodeFlag: state.auth.verifyCode,
    confirmationResult: state.auth.confirmationResult,
  };
}

export default connect(mapStateToProps)(Login);

import { connect } from "react-redux";
import { logoutUser } from "../actions";

function Logout() {
  const { dispatch } = this.props;
  dispatch(logoutUser());
};

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError
  };
}

export default connect(mapStateToProps)(Logout);
import React, { useState, useEffect } from "react";
import $ from "jquery";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import cameraWhite from "../static/camera.svg";
import help from "../static/help.svg"
import home from "../static/home.svg";
import analytics from "../static/analytics.png";
import { useLocation } from 'react-router-dom'

// import BottomNavigation from "@material-ui/core/BottomNavigation";
// import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import navbar from "../static/logo.svg";

function Nav(props) {
  let history = useHistory();
  let location = useLocation();
  const [value, setValue] = useState(0);
  const goToHelp = () => {
    var win = window.open(
      "https://join.slack.com/t/ratemyshot/shared_invite/zt-edfbwbw4-Wncezi48LIFbph8NDzHKuA",
      "_blank"
    );
    if (win) win.focus();
  };

  useEffect(() => {
    if (history.location.pathname === "/login") {
      $("#loginBottom").click();
      setValue(3);
    }
  }, [value, history.location.pathname]);

  return (
    <span>
      <AppBar
        className="gagunkNav"
        style={{ padding: "20px !important" }}
        title={
          <img
            alt="logo"
            src={navbar}
            onClick={() => {
              history.push("/");
            }}
            style={{ width: "80px", marginTop: "18px", cursor: "pointer" }}
          />
        }
        iconElementRight={
          <div
            className="desktop-nav-icons"
            style={{ padding: "20px !important", verticalAlign: "middle" }}
          >
            <Tooltip title="Home" >
              <img
                alt="home"
                className="iconNav"
                src={home}
                style={{
                  width: "20px",
                  borderBottom: location.pathname === '/' ? '2px solid white' : 'none'
                }}
                onClick={() => history.push('/')}
              />
            </Tooltip>
            <span id="nav-post">
              <Tooltip title="Post" >
                <img
                  alt="camera"
                  className="iconNav"
                  src={cameraWhite}
                  onClick={() => props.handleOpen()}
                />
              </Tooltip>
            </span>
            {props.isAuthenticated ? (
              !props.loginFlag ? (
                <>
                  <Tooltip title="Analytics">
                    <img
                      alt="my photos"
                      className="iconNav"
                      src={analytics}
                      style={{
                        width: "20px",
                        borderBottom: location.pathname === '/analytics' ? '2px solid white' : 'none'
                      }}
                      onClick={() => history.push('/analytics')}
                    />
                  </Tooltip>
                  <Tooltip title="Help">
                    <img
                      alt="help"
                      className="iconNav"
                      src={help}
                      style={{ width: "20px" }}
                      onClick={() => goToHelp()}
                    />
                  </Tooltip>
                  <FlatButton
                    label={"LOGOUT"}
                    primary={true}
                    className="logoutBtn"
                    onClick={() => props.logout()}
                    style={{ marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
                  />
                </>
              ) : null
            ) : !props.loginFlag ? (
              <>
                <Tooltip title="Help">
                  <img
                    alt="help"
                    className="iconNav"
                    src={help}
                    style={{ width: "20px" }}
                    onClick={() => goToHelp()}
                  />
                </Tooltip>
                <FlatButton
                  label={"LOGIN"}
                  primary={true}
                  className="logoutBtn"
                  onClick={() => props.login()}
                  style={{ marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
                />
              </>
            ) : null}
          </div>
        }
        iconStyleLeft={{ display: "none" }}
      />
    </span>
  );
}

export default Nav;

import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({
  component: Component,
  isAuthenticated,
  isVerifying,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isVerifying ? (
        <div />
      ) : isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);
export default ProtectedRoute;
export default {
  apiKey: "AIzaSyAmVWAPTXaccP_j52dVJwzEyjHO-XTUoxI",
  authDomain: "gagunk-app.firebaseapp.com",
  databaseURL: "https://gagunk-app.firebaseio.com",
  projectId: "gagunk-app",
  storageBucket: "gagunk-app.appspot.com",
  messagingSenderId: "214279252823",
  appId: "1:214279252823:web:d97b07d9c4d3684878ec12",
  measurementId: "G-C9CM4WXRJ7"
};

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database"
import firebaseConfig from "./firebase-config";

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = myFirebase.firestore();
const realTime = myFirebase.database();
export const db = baseDb;
export default realTime;
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  ACCOUNT_REQUEST,
  ACCOUNT_SUCCESS,
  ACCOUNT_FAILURE,
  VERIFY_ACCOUNT_SUCCESS
} from "../actions/";

export default (
  state = {
    isLoggingIn: false,
    isLoggingOut: false,
    isVerifying: false,
    loginError: false,
    logoutError: false,
    isAuthenticated: false,
    accountError: false,
    user: {},
    confirmationResult: {}
  },
  action
) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
        loginError: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: true,
        user: action.user
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        loginError: true
      };
    case ACCOUNT_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        accountError: true
      };
    case ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        accountError: false,
        verifyCode: true,
        confirmationResult: action.confirmationResult
      };
    case ACCOUNT_REQUEST:
      return {
        ...state,
        isVerifying: true,
        verifyCode: false,
        isLoggingIn: true,
        verifyingError: false,
        accountError: false,
        loginError: false,
      };
    case VERIFY_ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: true,
        accountError: false
      };
    case LOGOUT_REQUEST:
      return {
        ...state,
        isLoggingOut: true,
        logoutError: false
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggingOut: false,
        isAuthenticated: false,
        user: {}
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        isLoggingOut: false,
        logoutError: true
      };
    case VERIFY_REQUEST:
      return {
        ...state,
        isVerifying: true,
        isLoggingIn: true,
        verifyingError: false,
        accountError: false,
        loginError: false,
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        isVerifying: false,
        isLoggingIn: false,
        verifyingError: false,
        loginError: false
      };
    default:
      return state;
  }
};
import { combineReducers } from "redux";
import auth from "./auth";
export default combineReducers({ auth });

export default [
  "+12562008640",
  "+19416853049",
  "+16505551234"
]

export default [
  "ƒ/1",
  "ƒ/1.1",
  "ƒ/1.2",
  "ƒ/1.4",
  "ƒ/1.6",
  "ƒ/1.8",
  "ƒ/2",
  "ƒ/2.2",
  "ƒ/2.5",
  "ƒ/2.8",
  "ƒ/3.2",
  "ƒ/3.5",
  "ƒ/4",
  "ƒ/4.5",
  "ƒ/5",
  "ƒ/5.6",
  "ƒ/6.3",
  "ƒ/7.1",
  "ƒ/8",
  "ƒ/9",
  "ƒ/10",
  "ƒ/11",
  "ƒ/13",
  "ƒ/14",
  "ƒ/16",
  "ƒ/18",
  "ƒ/20",
  "ƒ/22",
  "ƒ/25",
  "ƒ/29",
  "ƒ/32",
  "ƒ/36"
]

export default [
  "Apple",
  "Canon",
  "DJI",
  "Fujifilm",
  "GoPro",
  "Google",
  "HMD Global",
  "HUAWEI",
  "Hasselblad",
  "LGE",
  "Leica",
  "Mamiya",
  "Minolta",
  "Moment",
  "Nikon",
  "OOWA",
  "OnePlus",
  "Parrot",
  "Pentax",
  "Samsung",
  "Sigma",
  "Sony",
  "Tamron",
  "Yuneec",
  "Zeiss"
];

export default [
  "8mm",
  "16mm",
  "18mm",
  "20mm",
  "24mm",
  "28mm",
  "35mm",
  "50mm",
  "55mm",
  "70mm",
  "85mm",
  "100mm",
  "135mm",
  "200mm",
  "210mm"
];
