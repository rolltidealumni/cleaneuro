import { connect } from "react-redux";
import { logoutUser } from "../actions";

function Logout () {
  const { dispatch } = this.props;
  dispatch(logoutUser());
};

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError
  };
}

export default connect(mapStateToProps)(Logout);