import React, { useState, useEffect } from "react";
import $ from "jquery";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import cameraWhite from "../static/camera.svg";
import help from "../static/help.svg"
import home from "../static/home.svg";
import analytics from "../static/analytics.png";
import { useLocation } from 'react-router-dom'

// import BottomNavigation from "@material-ui/core/BottomNavigation";
// import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import navbar from "../static/logo.svg";

function Nav(props) {
  let history = useHistory();
  let location = useLocation();
  const [value, setValue] = useState(0);
  const goToHelp = () => {
    var win = window.open(
      "https://join.slack.com/t/ratemyshot/shared_invite/zt-edfbwbw4-Wncezi48LIFbph8NDzHKuA",
      "_blank"
    );
    if (win) win.focus();
  };

  useEffect(() => {
    if (history.location.pathname === "/login") {
      $("#loginBottom").click();
      setValue(3);
    }
  }, [value, history.location.pathname]);

  return (
    <span>
      <AppBar
        className="gagunkNav"
        style={{ padding: "20px !important" }}
        title={
          <img
            alt="logo"
            src={navbar}
            onClick={() => {
              history.push("/");
            }}
            style={{ width: "80px", marginTop: "18px", cursor: "pointer" }}
          />
        }
        iconElementRight={
          <div
            className="desktop-nav-icons"
            style={{ padding: "20px !important", verticalAlign: "middle" }}
          >
            <Tooltip title="Home" >
              <img
                alt="home"
                className="iconNav"
                src={home}
                style={{
                  width: "20px",
                  borderBottom: location.pathname === '/' ? '2px solid white' : 'none'
                }}
                onClick={() => history.push('/')}
              />
            </Tooltip>
            <span id="nav-post">
              <Tooltip title="Post" >
                <img
                  alt="camera"
                  className="iconNav"
                  src={cameraWhite}
                  onClick={() => props.handleOpen()}
                />
              </Tooltip>
            </span>
            {props.isAuthenticated ? (
              !props.loginFlag ? (
                <>
                  <Tooltip title="My Photos">
                    <img
                      alt="my photos"
                      className="iconNav"
                      src={analytics}
                      style={{
                        width: "20px",
                        borderBottom: location.pathname === '/analytics' ? '2px solid white' : 'none'
                      }}
                      onClick={() => history.push('/analytics')}
                    />
                  </Tooltip>
                  <Tooltip title="Help">
                    <img
                      alt="help"
                      className="iconNav"
                      src={help}
                      style={{ width: "20px" }}
                      onClick={() => goToHelp()}
                    />
                  </Tooltip>
                  <FlatButton
                    label={"LOGOUT"}
                    primary={true}
                    className="logoutBtn"
                    onClick={() => props.logout()}
                    style={{ marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
                  />
                </>
              ) : null
            ) : !props.loginFlag ? (
              <>
                <Tooltip title="Help">
                  <img
                    alt="help"
                    className="iconNav"
                    src={help}
                    style={{ width: "20px" }}
                    onClick={() => goToHelp()}
                  />
                </Tooltip>
                <FlatButton
                  label={"LOGIN"}
                  primary={true}
                  className="logoutBtn"
                  onClick={() => props.login()}
                  style={{ marginBottom: "10px", width: "100%", marginTop: "20px", color: 'rgb(30,30,30)' }}
                />
              </>
            ) : null}
          </div>
        }
        iconStyleLeft={{ display: "none" }}
      />
    </span>
  );
}

export default Nav;
