import React from 'react';
import ReactDOM from 'react-dom';
import { RocketCanvas } from './gui/components/canvas';
import './css/style.css'
import { SnackbarContainer } from './gui/components/snackbars';
import { init } from './client';
import { RocketMap } from './gui/components/map';

console.log('client is starting...')

/*
<SnackbarContainer vertical="bottom" horizontal="left" id="alert" />
<SnackbarContainer vertical="bottom" horizontal="right" id="confirm" />
<RocketCanvas />
*/

init()

/*ReactDOM.render(
  <React.StrictMode>
    <SnackbarContainer vertical="bottom" horizontal="left" id="alert" />
    <SnackbarContainer vertical="bottom" horizontal="right" id="confirm" />
    <RocketCanvas />
    <RocketMap classes="main-map" width={300} factor={0.5} borderColor="rgba(0,0,0,0)" />
  </React.StrictMode>,
  document.getElementById('root')
);*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 // reportWebVitals();
