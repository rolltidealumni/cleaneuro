import React, { useState, useEffect } from "react";
import $ from "jquery";
import AppBar from "material-ui/AppBar";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import cameraWhite from "../static/camera-white.svg";
import homeLogo from "../static/home.svg";
import info from "../static/info.svg";
import help from "../static/help.svg";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import navbar from "../static/logo.svg";
import loginIconBlack from "../static/account.svg";
import loginIcon from "../static/account-white.svg";

function Nav(props) {
  let history = useHistory();
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
            <Tooltip title="Help">
              <img
                alt="help"
                className="iconNav"
                src={help}
                style={{ width: "20px" }}
                onClick={() => goToHelp()}
              />
            </Tooltip>
            {props.isAuthenticated ? (
              !props.loginFlag ? (
                <Tooltip title="Logout">
                  <img
                    alt="logo"
                    className="iconNav"
                    src={loginIconBlack}
                    onClick={() => props.logout()}
                  />
                </Tooltip>
              ) : null
            ) : !props.loginFlag ? (
              <Tooltip title="Login">
                <img
                  alt="logo"
                  className="iconNav"
                  src={loginIconBlack}
                  style={{ width: "20px" }}
                  onClick={() => props.login()}
                />
              </Tooltip>
            ) : null}
          </div>
        }
        iconStyleLeft={{ display: "none" }}
      />
    </span>
  );
}

export default Nav;
