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
