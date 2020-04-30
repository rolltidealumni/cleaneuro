import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import configureStore from "./configureStore";
import './index.css';

import MyApp from './components/App';

const store = configureStore();

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: 'deepOrange500'
  }
});

const App = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <Router>
        <MyApp />
      </Router>
    </Provider>
  </MuiThemeProvider>
);

ReactDOM.render(<App/>, document.getElementById('root'));
