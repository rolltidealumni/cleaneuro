import React, { useState } from 'react';
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import FlatButton from 'material-ui/FlatButton';
import Nav from "./Nav";
import linkLogo from "../static/link.svg";
import pencilLogo from "../static/pencil.svg";
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
        upvote: 0,
        downvote: 0
      });
      setOpenDialog(false);
      window.location.reload();
    } else {
      setIsValid(false);
    }
  }
 
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
