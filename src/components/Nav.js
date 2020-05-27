import React, { useState, useEffect } from "react";
import $ from "jquery";
import AppBar from "material-ui/AppBar";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import camera from "../static/camera.svg";
import homeLogo from "../static/home.svg";
import info from "../static/info.svg";
import help from "../static/help.svg";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import navbar from "../static/logo.svg";
import loginIcon from "../static/account.svg";

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
            <Tooltip title="Info">
              <img
                alt="logo"
                className="iconNav"
                src={info}
                style={{ width: "20px" }}
                onClick={() => props.navigate()}
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

            {props.isAuthenticated ? (
              !props.loginFlag ? (
                <Tooltip title="Logout">
                  <img
                    alt="logo"
                    className="iconNav"
                    src={loginIcon}
                    onClick={() => props.logout()}
                  />
                </Tooltip>
              ) : null
            ) : !props.loginFlag ? (
              <Tooltip title="Login">
                <img
                  alt="logo"
                  className="iconNav"
                  src={loginIcon}
                  style={{ width: "20px" }}
                  onClick={() => props.login()}
                />
              </Tooltip>
            ) : null}
          </div>
        }
        iconStyleLeft={{ display: "none" }}
      />
      <BottomNavigation
        value={value}
        className="bottom-nav"
        onChange={(event, newValue) => {
          setValue(newValue);
          switch (newValue) {
            case 0:
              history.push("/");
              break;
            case 1:
              props.navigate();
              break;
            case 2:
              props.handleOpen();
              break;
            case 3:
              if (!props.loginFlag && props.isAuthenticated) {
                props.logout();
                history.push("/");
                break;
              } else if (!props.loginFlag) {
                props.login();
                break;
              }
              break;
            case 4:
              goToHelp();
              break;
            case 5:
              history.push("/contests");
              break;
            default: 
            break;
          }
        }}
        showLabels={false}
      >
        <BottomNavigationAction
          label={"•"}
          id="homeBottom"
          value={0}
          icon={<img alt="icon0" src={homeLogo} style={{ width: "20px" }} />}
        />
        {props.isAuthenticated ? (
          <BottomNavigationAction
            label={"•"}
            value={2}
            id="cameraBottom"
            icon={<img alt="icon2" src={camera} style={{ width: "20px" }} />}
          />
        ) : null}
        <BottomNavigationAction
          label={"•"}
          value={3}
          id="loginBottom"
          icon={<img alt="icon3" src={loginIcon} style={{ width: "20px" }} />}
        />
      </BottomNavigation>
    </span>
  );
}

export default Nav;
