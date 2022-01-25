import { currentUser } from "../client";
import { IDable, GameDataForSendingI, ClientGameDataI, TypeObjectI, AsteroidI, RocketI, GalaxyI } from "../../common/declarations";
import { canvas } from "../components/canvas";
import { getImage } from "../images";
import { asteroidHelper } from "./asteriod";
import { clientRocket, rocketHelper } from "./rocket";
import { migrateObjectData } from "../../common/adds";

export let galaxiesData: GalaxyI[]
export function setGalaxiesData(d: GalaxyI[]) { galaxiesData = d }

export let gameData: ClientGameDataI

export function setGameData(d: GameDataForSendingI) {
    gameData = {
        settings: d.settings,
        objects: !d.fullData ? gameHelper(gameData).migrateData(d.objects) : gameData.objects,
        galaxy: d.galaxy
    }
}

export function gameHelper(sis: ClientGameDataI) {
    return {
        migrateData(n: TypeObjectI[]) {
            let copy = { ...sis.objects }
            copy = migrateObjectData(copy, n)
            return copy
        },

        paintBorders(g: CanvasRenderingContext2D) {
            g.strokeStyle = 'darkred'
            g.lineWidth = 20
            g.beginPath()
            g.moveTo(0,0)
            g.lineTo(sis.settings.width, 0)
            g.lineTo(sis.settings.width, sis.settings.height)
            g.lineTo(0, sis.settings.height)
            g.closePath()
            g.stroke()
        },

        paintBackground(g: CanvasRenderingContext2D) {
            let x = -currentUser!.view!.eye.x/4.0
            let y = -currentUser!.view!.eye.y/4.0

            let w = sis.settings.width/2
            let h = sis.settings.height/2

            let xx = x
            let yy = y

            while (x < 0) x += w
            while (x >= w) x -= w
            while (y < 0) y += h
            while (y >= h) y -= h

            xx -= x
            yy -= y

            x -= w
            y -= h

            xx /= w
            yy /= h

            const di = (dx: number, dy: number) => {
                const a = Math.abs(Math.trunc(Math.trunc(yy) + dy/h) % 2)
                const b = Math.abs(Math.trunc(Math.trunc(xx) + dx/w) % 3)
                const gi = () => {
                    let bi: string | null = null
                    if (a === 0) {
                        if (b === 0) bi = "background3.jpg"
                        if (b === 1) bi = "background2.jpg"
                        if (b === 2) bi = "background1.jpg"
                    } else if (a === 1) {
                        if (b === 0) bi = "background1.jpg"
                        if (b === 1) bi = "background2.jpg"
                        if (b === 2) bi = "background3.jpg"
                    }
                    if (bi === null) console.error('Error in galaxyHelper -> paint... ' + a + '  ' + b)
                    return bi!
                }
                
                g.drawImage(
                    getImage(gi())!,
                    x + dx,
                    y + dy,
                    w, h
                )
            }

            const xl = x > 0 && x < canvas.state.width
            const yt = y > 0 && y < canvas.state.height
            const xr = x+w > 0 && x+w < canvas.state.width
            const yb = y+h > 0 && y+h < canvas.state.height

            if (xl) di(-w, 0)
            if (yt) di(0, -h)

            if (xr) di(w, 0)
            if (yb) di(0, h)

            if (xl && yt) di(-w, -h)
            if (xr && yt) di(w, -h)
            if (xr && yb) di(w, h)
            if (xl && yb) di(-w, h)

            di(0, 0)
        },

        paintObjects(g: CanvasRenderingContext2D) {
            clientRocket.sendTouchingObjects()

            sis.objects.forEach(o => {
                try {
                    if (o.type == 'asteroid') asteroidHelper(o as AsteroidI).paint(g)
                    if (o.type == 'rocket') rocketHelper(o as RocketI).paint(g)
                }
                catch {
                    alert('Object ' + JSON.stringify(o) + 'can not be casted.')
                }
            })
        }
    }
}