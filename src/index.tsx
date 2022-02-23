import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.scss'

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { RocketCanvas } from './game/components/canvas';
import { SocketUser } from './game/network/SocketUser';
import { loadImages } from './game/images';
import { Button, Row } from 'react-bootstrap';
import { GalaxyRootGUI } from "./game/components/root-gui"

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
//test

/*loadImages([
    'asteroid.png',
    'background1.jpg',
    'background2.jpg',
    'background3.jpg',
    'rocket.png',
    'noimage.png',
    'fire.png',
    'booom.png',
    'map_this_rocket.png'
])*/

const search = new URLSearchParams(window.location.href)
const prevGalaxy = search.get('galaxy')
console.log('Galaxy-Parameter: ' + prevGalaxy)

if (prevGalaxy) new SocketUser('ws://localhost:1234/socket', prevGalaxy)

ReactDOM.render(
    <React.StrictMode>
        <GalaxyRootGUI noGalaxySpecifyed={ prevGalaxy === undefined } />
    </React.StrictMode>,
    document.getElementById('root')
)



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 // reportWebVitals();
