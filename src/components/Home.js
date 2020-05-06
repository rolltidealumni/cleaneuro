import React, { useState } from 'react';
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import FlatButton from 'material-ui/FlatButton';
import Nav from "./Nav";
import linkLogo from "../static/link.svg";
import pencilLogo from "../static/pencil.svg";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Posts from './Posts/Posts';
import realTime from '../firebase/firebase';
import { logoutUser } from "../actions";

function Home (props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [imageLink, setImageLink] = useState("");
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

  const validate = (e) => {
    return imageLink.includes('.png') || imageLink.includes('.jpg') ||  imageLink.includes('.jpeg');
  }

  const handleSubmit = (e) => {
    if(validate(imageLink)) {
      let postsRef = realTime.ref('posts');
     
      postsRef.push({
        imageLink: imageLink,
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
    } else {
      setIsValid(false);
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
        modal={true}
        open={openDialog}
      >
        <DialogTitle id="form-dialog-title">Post a Photo!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span style={{margin: "0px", marginTop: "0px", fontSize: "14px", color: "#212121" }}>Submit an image and accompanying caption for others to vote on.</span>
            <br/>
            <TextField
              hintText="Image URL"
              fullWidth={true}
              variant="outlined"
              style={{marginTop: "20px", marginBottom: "10px", color: "#212121" }}
              label={<span><img alt="security" src={linkLogo} width="18px" style={{verticalAlign: "middle", marginRight: "5px"}}/><span style={{verticalAlign: "middle"}}>Image URL</span></span>}
              onKeyPress={e => setImageLink(e.target.value)}
              onFocus={e =>  setImageLink(e.target.value)}
              onBlur={e =>  setImageLink(e.target.value)}
              onChange={e =>  setImageLink(e.target.value)}
            />
             <div style={{color: 'red'}} hidden={isValid}>Please paste a valid image link.</div>
            <TextField
                hintText="Caption"
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
                  disabled={!isValid || caption === ""}
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
          </DialogContentText>
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
