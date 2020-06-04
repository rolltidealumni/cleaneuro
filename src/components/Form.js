import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import jquery from 'jquery';
import pencilLogo from "../static/pencil.svg";
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
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
