import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.scss'

import { SocketUser } from './game/network/socket-user';
import { GalaxyRootGUI } from "./game/components/root-gui"
import { loadImages } from './game/paint/images';
import { PaintGameWorldI } from './game/paint/paint_declarations';
import { vec } from './common/math';
import { worldToScreen } from './game/paint/paint_tools';

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

loadImages([
    'asteroid.png',
    'background1.jpg',
    'background2.jpg',
    'background3.jpg',
    'rocket.png',
    'noimage.png',
    'fire.png',
    'booom.png',
    'map_this_rocket.png'
])

console.log('Starting Client on url "' + window.location.href + '" ...')

const url = new URL(window.location.href)
export const search = new URLSearchParams(url.search)

const prevGalaxy = search.get('galaxy')
const name = search.get('name')

const autoJoinTeam = search.get('autojointeam')

export const debugGame = search.get('debug-game') === 'on'
export const debugShop = search.get('debug-shop-data') === 'on'

console.log('Galaxy-Parameter: ' + prevGalaxy)

if (prevGalaxy && !debugGame) new SocketUser('ws://localhost:1234/socket', prevGalaxy)

export const debugWorld: PaintGameWorldI = {
  objects: [
    {
      paintType: 'ASTEROID',
      pos: vec(2, 2),
      props: {
        radius: 2,
        stability: 30,
        rotation: 2.345
      },
      zIndex: 0
    },

    /*{
      paintType: 'ASTEROID',
      pos: vec(-4, -3),
      props: {
        radius: 6,
        stability: 60,
        rotation: 2.345
      },
      zIndex: 1
    }*/
  ],
  eye: vec(2, 2),
  scaling: 50
}

ReactDOM.render(
    <React.StrictMode>
        <GalaxyRootGUI 
          noGalaxySpecifyed={prevGalaxy === null}
          name={name} 
          autoJoinTeam={autoJoinTeam}
        />
    </React.StrictMode>,
    document.getElementById('root')
)



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 // reportWebVitals();
