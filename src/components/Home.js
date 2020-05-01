import React, { useState, useEffect } from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Posts from './Posts/Posts';
import realTime from '../firebase/firebase';
import { logoutUser } from "../actions";
import TextField from 'material-ui/TextField';

function Home (props) {
  const { dispatch } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [instagramLink, setInstagramLink] = useState("");
  const [isValid, setIsValid] = useState(true);
 
  const handleOpen = () => {
    setOpenDialog(true);
  };

  const navigate = () => {
    window.location = "https://github.com/themorganthompson/gagunk";
  };
 
  const logout = () => {
    dispatch(logoutUser());
  };

  const handleClose = () => {
    setOpenDialog(false);
    setInstagramLink("");
  };

  const handleChange = (e) => {
    console.log(e);
    // setInstagramLink(e.target.value);
  }

  const validate = (e) => {
    return instagramLink.includes('https://www.instagram.com/p/');
  }

  const handleSubmit = (e) => {
    if(validate(e)) {
      let postsRef = realTime.ref('posts');

      postsRef.push({
        instagramLink: instagramLink,
        upvote: 0,
        downvote: 0
      });

      setOpenDialog(false)
      setInstagramLink("");
    } else {
      setIsValid(false);
    }
  }

  const actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      className="cancelBtn"
      onClick={() => handleClose()}
    />,
    <FlatButton
      label="Submit"
      primary={true}
      className="submitBtn"
      onClick={() => handleSubmit()}
    />
  ];
 
  return (
    <div style={{marginTop: "16px"}}>
      <AppBar
        className="gagunkNav"
        title={<span>Ga-Gunk!</span>}
        iconElementRight={
          <div style={{ padding: "0"}}>
            <FlatButton className="gagunkbtn" label="About" onClick={() => navigate()}/>
            <FlatButton className="gagunkbtn" label="Submit Post" onClick={() => handleOpen()}/>
            <FlatButton className="gagunkbtn" label="Logout" onClick={() => logout()}/>
          </div>}
        iconStyleLeft={{ display: 'none' }}
      />
      <Dialog
        actions={actions}
        modal={true}
        open={openDialog}
      >
        <span><center>Turn ‘round</center></span>
        <TextField
          hintText="Instagram URL"
          fullWidth={true}
          onKeyPress={() => handleChange()}
          onFocus={() => handleChange()}
          onBlur={() => handleChange()}
          value={instagramLink}
          onChange={() => handleChange()}
        />
        <div style={{'color': 'red'}} hidden={isValid}>Please paste a valid Instagram link.</div>
      </Dialog>
      <Posts firebase={realTime} {...props} />
    </div>
  );
}

export default Home;
