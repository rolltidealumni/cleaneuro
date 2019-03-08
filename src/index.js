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
    <div id="footerArea">
      <center>
        <div id="footer">Made with <span role="img" aria-label="heart">❤️ </span> by <a href="https://www.twitter.com/photobymo/" rel="noopener noreferrer" target="_blank">Morgan Thompson</a></div>
      </center>
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(<App/>, document.getElementById('root'));
