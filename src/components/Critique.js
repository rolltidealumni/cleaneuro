import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import jquery from 'jquery';
import Typography from '@material-ui/core/Typography';
import FlatButton from "material-ui/FlatButton";
import loadingSpinner from "../static/loading.gif";
import Dialog from "@material-ui/core/Dialog";
import exit from "../static/close.svg";
import DialogContent from "@material-ui/core/DialogContent";
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import realTime from "../firebase/firebase";

const Critique = (props) => {
  const [loading, setLoading] = useState(false);

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
            marginTop: "20px",
            height: "180px",
          }}
        ></div>
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
