import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { WebSite } from './web-site/website';
import { RocketCanvas } from './game/components/canvas';
import { SocketUser } from './game/network/SocketUser';

console.log('client is starting...')

/*
<SnackbarContainer vertical="bottom" horizontal="left" id="alert" />
<SnackbarContainer vertical="bottom" horizontal="right" id="confirm" />
<RocketCanvas />
*/

//init()

/*ReactDOM.render(
  <React.StrictMode>
    <SnackbarContainer vertical="bottom" horizontal="left" id="alert" />
    <SnackbarContainer vertical="bottom" horizontal="right" id="confirm" />
    <RocketCanvas />
    <RocketMap classes="main-map" width={300} factor={0.5} borderColor="rgba(0,0,0,0)" />
  </React.StrictMode>,
  document.getElementById('root')
)*/

/*ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WebSite />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)*/

new SocketUser('ws://localhost:1113')

ReactDOM.render(
  <React.StrictMode>
    <RocketCanvas />
  </React.StrictMode>,
  document.getElementById('root')
)



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 // reportWebVitals();
