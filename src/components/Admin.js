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
