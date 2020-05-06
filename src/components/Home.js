import React, { useState } from 'react';
import { connect } from "react-redux";
import firebase from 'firebase/app';
import 'firebase/storage';
import { useHistory } from "react-router-dom";
import FlatButton from 'material-ui/FlatButton';
import Nav from "./Nav";
import pencilLogo from "../static/pencil.svg";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ImageUploader from 'react-images-upload';
import DialogTitle from '@material-ui/core/DialogTitle';
import Posts from './Posts/Posts';
import realTime from '../firebase/firebase';
import { logoutUser } from "../actions";

function Home (props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(0);
  const [hideUploader, setHideUploader] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [isValid, setIsValid] = useState(true);
  let history = useHistory();
 
  const handleOpen = () => {
    setOpenDialog(true);
  };

  const navigate = () => {
    var win = window.open("https://github.com/themorganthompson/gagunk", '_blank');
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
    history.push('/login');
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const onDrop = (picture, data) => {
    setHideUploader(true);
    var base64 = data[0].substring(data[0].indexOf(',')+1)
    let storageRef = firebase.storage().ref();
    let path = `images/${picture[0].name}`;
    let uploadTask = storageRef.child(path).putString(base64, 'base64');
    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setImageLoading(progress);
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        setImage(downloadURL);
      });
    });
}

  const handleSubmit = (e) => {
    let postsRef = realTime.ref('posts');
    if (image) {
      postsRef.push({
        imageLink: image,
        caption: caption,
        submitted: new Date().toString(),
        oneStar: 0,
        twoStars: 0,
        threeStars: 0,
        fourStars: 0,
        fiveStars: 0,
        total: 0
      });
      setOpenDialog(false);
      setSnackOpen(true);
      setHideUploader(false);
    }   
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };
 
  return (
    <div style={{marginTop: "16px", color: "#212121" }}>
      <Nav 
        loginFlag={false}
        navigate={() => navigate()} 
        handleOpen={() => handleOpen()}
        logout={() => logout()}
        login={() => login()}
        isVerifying={props.isVerifying}
        isAuthenticated={props.isAuthenticated}
      />
       <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={() => handleCloseSnack()} severity="success">
          Your photo was submitted!
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
      >
        <DialogTitle id="form-dialog-title">Post a Photo!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span style={{margin: "0px", marginTop: "0px", fontSize: "14px", color: "#212121" }}>Submit an image and accompanying caption for others to vote on.</span>
            <br/>
          </DialogContentText>
            {(imageLoading > 0 && imageLoading < 100 && !image)? (
              <div class='filewrapper'><div class='fileloader'></div></div>) :
              ( image && imageLoading === 100 ? (
                <center><img src={image} width="40%" alt="preview" /></center>
              ) : !hideUploader ? 
              <ImageUploader
                withIcon={true}
                withPreview={false}
                buttonText='Choose image'
                label="Max file size: 20mb, accepted: jpg, gif, png, jpeg"
                onChange={(picture, other) => onDrop(picture, other)}
                imgExtension={['.jpg', '.jpeg', '.png', '.gif']}
                maxFileSize={20242880}
                singleImage={true}
              /> : null )}
             <div style={{color: 'red'}} hidden={isValid}>Please paste a valid image link.</div>
            <TextField
                fullWidth={true}
                variant="outlined"
                style={{marginTop: "10px", marginBottom: "5px", color: "#212121" }}
                label={<span><img alt="security" src={pencilLogo} width="18px" style={{verticalAlign: "middle", marginRight: "5px"}}/><span style={{verticalAlign: "middle"}}>Caption</span></span>}
                onKeyPress={e => setCaption(e.target.value)}
                onFocus={e => setCaption(e.target.value)}
                onBlur={e => setCaption(e.target.value)}
                onChange={e => setCaption(e.target.value)}
            />
            <center>
            <FlatButton
                  label="Submit"
                  primary={true}
                  className="submitBtn"
                  disabled={!image || caption === ""}
                  onClick={e => handleSubmit(e)}
                  style={{marginBottom: '10px', width: "100%", marginTop: "20px"}}
            />
            <br/>
             <FlatButton
                  label="Cancel"
                  primary={true}
                  className="cancelBtn"
                  onClick={() => handleClose()}
                  style={{marginBottom: '10px', width: "100%"}}
             />
            </center>
        </DialogContent>
      </Dialog>
      <Posts firebase={realTime} {...props} />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated : state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    user: state.auth.user
  };
}

export default connect(mapStateToProps)(Home);
