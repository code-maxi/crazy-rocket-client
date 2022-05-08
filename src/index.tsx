import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.scss'

import { SocketUser } from './game/network/socket-user';
import { GalaxyRootGUI } from "./game/components/root-gui"
import { loadImages } from './game/paint/images';
import { PaintGameWorldI, PlanetPropsI } from './game/paint/paint_declarations';
import { V, vec } from './common/math';
import { worldToScreen } from './game/paint/paint_tools';
import { BaseExtensionTypeE } from './game/decl';
import { forIch } from './game/other-adds';

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
    'map_this_rocket.png',
    'game/base-cargo-extension.png',
    'game/base-human-extension.png',
    'game/base-enter-zone-red.png',
    'game/base-enter-zone-green.png',
    'game/base-enter-zone-blue.png',
    'game/base-enter-zone-yellow.png',
    'game/city.png',
    'game/venus-planet.png'
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

const planetData: PlanetPropsI = {
  radius: 10,
  name: 'Venus',
  img: 'game/venus-planet.png',
  rotation: 0,
  tableValues: [
    ['Weight', '10000t'],
    ['Around', '12E t']
  ],
  cities: forIch(5, i => ({
      tableValues: [
        ['Times', ''+i],
        ['Test', 'lalala']
      ],
      size: 0.5 + Math.random() * 1,
      name: 'City ' + i,
      relPosToPlanet: V.al(Math.random()*2*Math.PI, Math.random() * 50) // in (%,%)
  })),
}

export const debugWorld: PaintGameWorldI = {
  factor: 1,
  objects: [
    {
      type: 'BASE',
      srPos: vec(5,5),
      srSize: vec(10,10),
      pos: vec(10,10),
      props: {
        name: 'XIq',
        enterZoneRadius: 4,
        outerRingRadius: 8,
        outerRingRotation: 1.4,
        interceptionRadius: 14,
        extensions: forIch(12, i => ({
          place: 360*(i/12),
          type: i % 2 === 0 ? BaseExtensionTypeE.HUMAN_AREA : BaseExtensionTypeE.CARGO_AREA,
          stability: Math.random() * 100
        })),
        extensionWidth: 3.5,
        teamColor: 'YELLOW',
        tableValues: [
          ['Team', 'Yellow'],
          ['GOLD', '12u3'],
          ['LALA', '70u3'],
          ['GURU', '40'],
          ['MEER', '1u3']
        ]
      }
    },
    {
      type: 'PLANET',
      pos: vec(-10,-10),
      srPos: vec(-5,-5),
      srSize: vec(10,10),
      props: planetData
    }


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
  scaling: 1,
  width: 1000,
  height: 1000
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
