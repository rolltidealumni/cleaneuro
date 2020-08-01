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
import TextField from '@material-ui/core/TextField';

const Critique = (props) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
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
      comment: comment,
      uid: props.user.uid,
      submitted: new Date().toString(),
    });
    setLoading(false);
    props.handleClose();
  };

  return (
    <Dialog open={props.openDialog} id="admin-modal" style={{ width: '100%' }}>
      <DialogTitle id="form-dialog-title">{props.user.uid !== props.post.author ? "Critique" : "Stats"}
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
          <>
            <StarRatings
              rating={rating}
              starRatedColor="#212121"
              starDimension="25px"
              starHoverColor="#212121"
              changeRating={(rating) => changeRating(rating)}
              numberOfStars={5}
              name="rating"
            />
            <br/>
            <TextField
              style={{
                marginTop: '15px',
                width: '100%'
              }}
              label="Comment"
              multiline
              rowsMax={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value)
              }}
              maxLength={140}  
              aria-label="maximum height"
              placeholder="Enter a helpful critique"
            />
          </> :
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
              disabled={rating === 0 || comment.length === 0 ? true : false}
              style={{ 
                marginBottom: "10px", 
                width: "100%", 
                marginTop: "20px", 
                color: 'rgb(30,30,30)',
                backgroundColor: rating === 0 || comment.length === 0 ? 'lightgray' : '#FBC02D'
              }}
            />
          </center> : null}
      </DialogContent>
    </Dialog >
  );
};

export default Critique;
