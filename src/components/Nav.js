import React from "react";
import AppBar from "material-ui/AppBar";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import info from "../static/info.svg";
import navbar from "../static/logo.svg";
import loginIcon from "../static/account.svg";

function Nav(props) {
  let history = useHistory();

  return (
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
          style={{ width: "30px", marginTop: "16px", cursor: "pointer" }}
        />
      }
      iconElementRight={
        <div style={{ padding: "20px !important", verticalAlign: "middle" }}>
          <Tooltip title="Info">
            <img
              alt="logo"
              className="iconNav"
              src={info}
              style={{ width: "20px" }}
              onClick={() => props.navigate()}
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
  );
}

export default Nav;
