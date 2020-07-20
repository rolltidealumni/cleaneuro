import React, { useState } from "react";
import "firebase/storage";
import jquery from 'jquery';
import FlatButton from "material-ui/FlatButton";
import loadingSpinner from "../static/loading.gif";
import Dialog from "@material-ui/core/Dialog";
import StarRatings from "react-star-ratings";
import cameraLogo from "../static/camera-two.svg";
import heartEmpty from "../static/heart-empty.svg";
import heartFill from "../static/heart-fill.svg";
import aperture from "../static/aperture.svg";
import Chip from '@material-ui/core/Chip';
import category from "../static/label.svg";
import lens from "../static/lens.svg";
import exit from "../static/close.svg";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import realTime from "../firebase/firebase";

const Critique = (props) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  let chips = [
    "Lighting",
    "Color",
    "Composition",
    "Emotion",
    "Focus",
    "Concept",
    "Crop",
    "Perspective"];
  const [chipsTouched, setChipsTouched] = useState([]);

  const selectChip = (chip) => {
    chipsTouched.push(chip);
    setChipsTouched(chipsTouched);
  }

  const deSelectChip = (chip) => {
    setChipsTouched(chipsTouched.filter(e => e !== chip));
  }

  const handleSubmit = (e) => {
    let postsRef = realTime.ref("posts");
    setLoading(true);
    postsRef.push({
      location: jquery('#combo-box-demo').val(),
      submitted: new Date().toString(),
      oneStar: 0,
      twoStars: 0,
      threeStars: 0,
      fourStars: 0,
      fiveStars: 0,
      total: 0,
    });
  };

  const changeRating = (newRating, name) => {
      setRating(newRating);
  };

  const updateRating = (post, key) => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <Dialog open={props.openDialog} id="admin-modal" style={{ width: '100%' }}>
      <DialogTitle id="form-dialog-title">Critique{" "}
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
        <center>
          <StarRatings
            rating={rating}
            starRatedColor="#212121"
            starDimension="25px"
            starHoverColor="#212121"
            changeRating={(rating) => changeRating(rating)}
            numberOfStars={5}
            name="rating"
          />
          <div style={{marginTop: '20px'}}>
            {chips.map(chipy => {
              return (
                <Chip
                  mode="outlined"
                  key={chipy}
                  label={
                    chipsTouched.filter(c => c === chipy).length === 0 ?
                      <span
                        style={{
                          color: chipsTouched.filter(c => c === chipy).length > 0 ? '#FBC02D' : 'black',
                          fontWeight: chipsTouched.filter(c => c === chipy).length > 0 ? '500' : 'normal',
                         
                        }}>
                        {chipy}
                        <img
                          alt="heart"
                          src={heartEmpty}
                          width="18px"
                          style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '18px', width: '15px' }}
                        /></span> :
                      <span>
                        {chipy}
                        <img
                          alt="heart"
                          src={heartFill}
                          width="18px"
                          style={{ verticalAlign: "middle", marginRight: "3px", marginLeft: '18px', width: '15px' }}
                        /></span>
                  }
                  style={{
                    margin: "5px",
                    height: "35px",
                    backgroundColor: 'white',
                    borderColor: chipsTouched.filter(c => c === chipy).length > 0 ? '#FBC02D' : 'rgb(186, 186, 186)', 
                    borderWidth: "1px",
                    borderStyle: "solid"
                  }}
                  onClick={() => {
                    chipsTouched.filter(c => c === chipy).length > 0 ? deSelectChip(chipy) : selectChip(chipy)
                  }}
                />
              )
            })}
          </div>
        </center>
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
            onClick={(e) => handleSubmit(e)}
            style={{ marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
          />
        </center>
      </DialogContent>
    </Dialog >
  );
};

export default Critique;
