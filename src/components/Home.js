import React, { useState } from "react";
import { connect } from "react-redux";
import "firebase/storage";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import admin from "../static/admin";
import Nav from "./Nav";
import Admin from "./Admin";
import Form from "./Form";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import camera from "../static/camera.svg";
import Posts from "./Posts/Posts";
import realTime from "../firebase/firebase";
import { logoutUser } from "../actions";

function Home(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [adminFlag, setAdminFlag] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  let history = useHistory();
  const isAdmin = props.user
    ? admin.filter((a) => props.user.phoneNumber === a)
    : false;
  if (
    props.user &&
    isAdmin[0] === props.user.phoneNumber &&
    !adminFlag &&
    props.user.phoneNumber !== undefined
  ) {
    setAdminFlag(true);
  }

  const handleOpen = () => {
    if (!props.isAuthenticated) {
      history.push("/login");
    } else {
      setOpenDialog(true);
    }
  };

  const navigate = () => {
    var win = window.open("http://blog.ratemyshot.co/", "_blank");
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
    history.push("/login");
  };

  const handleClose = () => {
    setOpenDialog(false);
    setUpdateOpen(false);
    setSnackOpen(false);
    setShowEditModal(false);
  };

  const openZoomModal = (image) => {
    setZoomImage(image);
    setShowZoomModal(true);
  };

  const openEditModal = (post) => {
    setEditPost(post);
    setShowEditModal(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <div style={{ marginTop: "16px", color: "#212121" }}>
      {!props.loginFlag ? (
        <Tooltip title="Post a Photo">
          <div onClick={() => handleOpen()} id="cameraBtn">
            <img
              alt="logo"
              className="iconNav"
              style={{ width: "20px" }}
              src={camera}
            />
          </div>
        </Tooltip>
      ) : null}
      <Nav
        loginFlag={false}
        navigate={() => navigate()}
        handleOpen={() => handleOpen()}
        logout={() => logout()}
        login={() => login()}
        isVerifying={props.isVerifying}
        isAuthenticated={props.isAuthenticated}
      />
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => handleClose()}
      >
        <Alert onClose={() => handleCloseSnack()} severity="success">
          Your photo was submitted!
        </Alert>
      </Snackbar>
      <Snackbar
        open={updateOpen}
        autoHideDuration={6000}
        onClose={() => handleClose()}
      >
        <Alert onClose={() => handleCloseSnack()} severity="success">
          Post updated!
        </Alert>
      </Snackbar>
      <Dialog
        maxWidth="lg"
        onBackdropClick={() => setShowZoomModal(false)}
        open={showZoomModal}
        id="zoomModal"
        fullWidth={true}
      >
        <img
          alt="zoomimage"
          src={zoomImage}
          width="100%"
          height="auto"
          onClick={() => setShowZoomModal(false)}
        />
      </Dialog>
      {showEditModal ? (
        <Admin
          openDialog={showEditModal}
          post={editPost}
          setOpenDialog={(value) => setShowEditModal(value)}
          setSnackOpen={(value) => setUpdateOpen(value)}
          handleClose={() => handleClose()}
          isVerifying={props.isVerifying}
        />
      ) : null}
      <Form
        openDialog={openDialog}
        setOpenDialog={(value) => setOpenDialog(value)}
        setSnackOpen={(value) => setSnackOpen(value)}
        handleClose={() => handleClose()}
        isVerifying={props.isVerifying}
      />
      <Posts
        firebase={realTime}
        showZoomModal={(image) => openZoomModal(image)}
        showEditModal={(post) => openEditModal(post)}
        adminFlag={adminFlag}
        {...props}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps)(Home);
