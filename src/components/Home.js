import React, { useState } from 'react';
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import FlatButton from 'material-ui/FlatButton';
import Nav from "./Nav";
import Dialog from 'material-ui/Dialog';
import Posts from './Posts/Posts';
import realTime from '../firebase/firebase';
import { logoutUser } from "../actions";
import TextField from 'material-ui/TextField';

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

  const actions = [
    <FlatButton
      label="Submit"
      primary={true}
      className="submitBtn"
      disabled={!isValid || caption === ""}
      onClick={e => handleSubmit(e)}
    />,
    <FlatButton
      label="Cancel"
      primary={true}
      className="cancelBtn"
      onClick={() => handleClose()}
    />
  ];
 
  return (
    <div style={{marginTop: "16px"}}>
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
        actions={actions}
        modal={true}
        open={openDialog}
      >
        <span><center>Submit an image and accompanying caption for others to vote on below</center></span>
        <p></p>
        <TextField
          hintText="Image URL"
          fullWidth={true}
          onKeyPress={e => setImageLink(e.target.value)}
          onFocus={e =>  setImageLink(e.target.value)}
          onBlur={e =>  setImageLink(e.target.value)}
          onChange={e =>  setImageLink(e.target.value)}
        />
        <div style={{'color': 'red'}} hidden={isValid}>Please paste a valid image link.</div>
        <TextField
          hintText="Caption"
          fullWidth={true}
          onKeyPress={e => setCaption(e.target.value)}
          onFocus={e => setCaption(e.target.value)}
          onBlur={e => setCaption(e.target.value)}
          onChange={e => setCaption(e.target.value)}
        />
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
