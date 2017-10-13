import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import './index.css';

import Gagunk from './Gagunk/Gagunk';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: 'deepOrange500'
  }
});

const App = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Gagunk />
  </MuiThemeProvider>
);

ReactDOM.render(<App/>, document.getElementById('root'));
