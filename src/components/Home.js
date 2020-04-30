import React, { useState, useEffect } from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { database } from "../firebase/firebase";
import config from '../firebase-config';
import Posts from './Posts/Posts';
import Logout from "./Logout";

function Home () {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [instagramLink, setInstagramLink] = useState("");
  const [isValid, setIsValid] = useState(true);
  // myFirebase.initializeApp(config);

  useEffect(() => {
    // let postsRef = database.ref('posts');
    // postsRef.on("value", function(snapshot) {
    //     let index = 0;
    //     snapshot.forEach(function(child, i) {
    //         posts.push({
    //           index: index,
    //           key: child.key,
    //           instagramLink: child.val().instagramLink,
    //           upvote: child.val().upvote,
    //           downvote: child.val().downvote,
    //     });
    //     index++;
    //   });
    // });
  
    // postsRef.on('value', (snapshot) => {
    //   setPosts(posts.reverse());
    //   setLoading(false);
    // });
  });

  // const handleOpen = () => {
  //   setOpenDialog(true);
  // };

  // const navigate = () => {
  //   // window.location = "https://github.com/themorganthompson/gagunk";
  // };

  // const handleClose = () => {
  //   setOpenDialog(false);
  //   setInstagramLink("");
  // };

  // const handleChange = (e) => {
  //   // setInstagramLink(e.target.value);
  // }

  // const validate = (e) => {
  //   return instagramLink.includes('https://www.instagram.com/p/');
  // }

  // const handleSubmit = (e) => {
  //   if(validate(e)) {
  //     // let postsRef = myFirebase.database().ref('posts');

  //     // postsRef.push({
  //     //   instagramLink: instagramLink,
  //     //   upvote: 0,
  //     //   downvote: 0
  //     // });

  //     setOpenDialog(false)
  //     setInstagramLink("");
  //   } else {
  //     setIsValid(false);
  //   }
  // }

  // const actions = [
  //   <FlatButton
  //     label="Cancel"
  //     primary={true}
  //     class="cancelBtn"
  //     onClick={handleClose()}
  //   />,
  //   <FlatButton
  //     label="Submit"
  //     primary={true}
  //     class="submitBtn"
  //     onClick={handleSubmit()}
  //   />
  // ];
 
  return (
    <div>Hello!</div>);
  //   <div style={{marginTop: "16px"}}>
  //     <AppBar
  //       className="gagunkNav"
  //       title={<span>Ga-Gunk!</span>}
  //       iconElementRight={
  //         <div style={{ padding: "0"}}>
  //           <FlatButton className="gagunkbtn" label="About" onClick={navigate()}/>
  //           <FlatButton className="gagunkbtn" label="Submit Post" onClick={handleOpen()}/>
  //           <FlatButton className="gagunkbtn" label="Logout" onClick={Logout}/>
  //         </div>}
  //       iconStyleLeft={{ display: 'none' }}
  //     />
  //     <Dialog
  //       actions={actions}
  //       modal={true}
  //       open={openDialog}
  //     >
  //       <span><center>Turn ‘round</center></span>
  //       <TextField
  //         hintText="Instagram URL"
  //         fullWidth={true}
  //         onKeyPress={handleChange()}
  //         onFocus={handleChange()}
  //         onBlur={handleChange()}
  //         value={instagramLink}
  //         onChange={handleChange()}
  //       />
  //       <div style={{'color': 'red'}} hidden={isValid}>Please paste a valid Instagram link.</div>
  //     </Dialog>
  //     <Posts
  //       firebase={firebase.database()}
  //       posts={posts}
  //       loading={loading}
  //     />
  //   </div>
  // );
}

export default Home;
