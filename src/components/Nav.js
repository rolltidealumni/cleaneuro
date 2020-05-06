import React from 'react';
import AppBar from 'material-ui/AppBar';
import { useHistory } from "react-router-dom";
import info from "../static/info.svg";
import navbar from "../static/navbar.svg";
import loginIcon from "../static/login.svg";

function Nav (props) {
  let history = useHistory();

return (
  <AppBar
    className="gagunkNav"
    style={{padding: "20px !important"}}
    title={<img alt="logo" src={navbar} onClick={() => { history.push('/')}} style={{width: "40px", marginTop: "12px", cursor: "pointer"}}/>}
    iconElementRight={
      <div style={{ padding: "20px !important", verticalAlign: "middle" }}>
        <img alt="logo" className="iconNav" src={info} style={{width: "20px"}} onClick={() => props.navigate()}/>
        {props.isAuthenticated ? 
            !props.loginFlag ? <img alt="logo" className="iconNav" src={loginIcon} style={{width: "20px"}} onClick={() => props.logout()}/> : null :
            !props.loginFlag ? <img alt="logo" className="iconNav" src={loginIcon} style={{width: "20px"}} onClick={() => props.login()}/> : null}
      </div>}
    iconStyleLeft={{ display: 'none' }}
    />
  );
}

export default Nav;