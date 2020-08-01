import React, { useState, useEffect } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import jQuery from "jquery";
import AppBar from "material-ui/AppBar";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import Drawer from '@material-ui/core/Drawer';
import cameraWhite from "../static/camera.svg";
import twitter from "../static/twitter.svg";
import favorite from "../static/favorite.svg";
import facebook from "../static/facebook.svg";
import help from "../static/help.svg";
import menu from "../static/menu.svg";
import login from "../static/login.svg";
import home from "../static/home.svg";
import analytics from "../static/analytics.png"
import navbar from "../static/logo.svg";

function Nav(props) {
  let history = useHistory();
  const [value, setValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const goToHelp = () => {
    var win = window.open(
      "https://join.slack.com/t/ratemyshot/shared_invite/zt-edfbwbw4-Wncezi48LIFbph8NDzHKuA",
      "_blank"
    );
    if (win) win.focus();
  };

  useEffect(() => {
    if (history.location.pathname === "/login") {
      jQuery("#loginBottom").click();
      setValue(3);
    }
  }, [value, history.location.pathname]);

  const footer = () => (
    <div id="footerArea">
      <span id="footer"> ©2020 artive, LLC {" "} | {" "}
        <a 
          alt="twitter"
          href="https://twitter.com/artiveco"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            alt="twitter" 
            src={twitter}
            width="10px"
            style={{
              cursor: 'pointer',
              verticalAlign: "middle",
              marginLeft: "0px",
            }}
          />
        </a>
        <a 
          alt="twitter"
          href="https://facebook.com/artive.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            alt="facebook" 
            src={facebook}
            width="10px"
            style={{
              cursor: 'pointer',
              verticalAlign: "middle",
              marginLeft: "3px",
            }}
          />
        </a>
        <a 
          alt="twitter"
          href="https://github.com/themorganthompson"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            alt="github" 
            src={favorite}
            width="10px"
            style={{
              cursor: 'pointer',
              verticalAlign: "middle",
              marginLeft: "3px",
            }}
          />
        </a>
      </span>
    </div>
  );

  const list = () => (
    <div
      role="presentation"
      onClick={() => setDrawerOpen(!drawerOpen)}
      onKeyDown={() => setDrawerOpen(!drawerOpen)}
    >
      <List>
        <ListItem button key={'home'} onClick={() => {
          setDrawerOpen(false);
          history.push('/');
        }}
        >
          <ListItemIcon>
            <img
              alt="home"
              className="iconNav"
              src={home}
              style={{
                width: "20px"
              }}
            />
          </ListItemIcon>
          <ListItemText primary={'Home'} />
        </ListItem>
        {history.location.pathname === "/" ?
          <ListItem id="nav-post" button key={'Post'} onClick={() => {
            setDrawerOpen(false);
            props.handleOpen();
          }}
          >
            <ListItemIcon>
              <img
                alt="camera"
                style={{
                  width: "20px"
                }}
                className="iconNav"
                src={cameraWhite}
              />
            </ListItemIcon>
            <ListItemText primary={'Post'} />
          </ListItem> : null}
        {props.isAuthenticated ? (
          !props.loginFlag ? (
            <>
              <ListItem button key={'Stats-menu'} onClick={() => {
                setDrawerOpen(false);
                history.push('/stats')
              }}
              >
                <ListItemIcon>
                  <img
                    alt="stats-menu"
                    style={{
                      width: "20px"
                    }}
                    className="iconNav"
                    src={analytics}
                  />
                </ListItemIcon>
                <ListItemText primary={'Stats'} />
              </ListItem>
              <ListItem button key={'Stats-2'} onClick={() => {
                setDrawerOpen(false);
                goToHelp();
              }}
              >
                <ListItemIcon>
                  <img
                    alt="help"
                    className="iconNav"
                    src={help}
                    style={{ width: "20px" }}
                  />
                </ListItemIcon>
                <ListItemText primary={'Help'} />
              </ListItem>
              <ListItem button key={'Stats'} onClick={() => {
                setDrawerOpen(false);
                props.logout()
              }}
              >
                <ListItemIcon>
                  <img
                    alt="login"
                    className="iconNav"
                    src={login}
                    style={{ width: "20px" }}
                  />
                </ListItemIcon>
                <ListItemText primary={'Logout'} />
              </ListItem>
            </>
          ) : null) : !props.loginFlag ? (
            <ListItem button key={'Stats'} onClick={() => {
              setDrawerOpen(false);
              props.login()
            }}
            >
              <ListItemIcon>
                <img
                  alt="login"
                  className="iconNav"
                  src={login}
                  style={{ width: "20px" }}
                />
              </ListItemIcon>
              <ListItemText primary={'Login'} />
            </ListItem>) : null}
      </List>
    </div>
  );

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
        iconElementRight={<div
          className="desktop-nav-icons"
          style={{ padding: "20px !important", verticalAlign: "middle" }}
        >
          <span id="menu">
            <Tooltip title="Menu" >
              <img
                alt="menu"
                className="iconNav"
                src={menu}
                onClick={() => setDrawerOpen(true)}
              />
            </Tooltip>
          </span>
        </div>}
        iconStyleLeft={{ display: "none" }}
      />
      <Drawer
        onBackdropClick={() => setDrawerOpen(false)}
        anchor={'right'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        style={{ width: '200px', zIndex: 9999999999 }}
      >
        {list()}
        {footer()}
      </Drawer>
    </span >
  );
}

export default Nav;
