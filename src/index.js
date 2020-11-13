//Aqui importamos react.js e react-dom.js dos nossos node_modules (via npm/yarn)
import React from 'react';
import ReactDOM from 'react-dom';

//Aqui importamos nosso arquivo App.js
import App from './App';

//Aqui importamos o nosso arquivo CSS
import '../src/css/main.css'

//Aqui importamos nosso reportWebVitals
import reportWebVitals from './reportWebVitals';


//Aqui renderizamos para a div root em nosso index.html
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals()