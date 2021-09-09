import { currentUser } from "../../client";
import { GalaxyObjectsI, GalaxyWithoutObjectsI, GalaxyI, IDable } from "../../common/declarations";
import { canvas } from "../components/canvas";
import { getImage } from "../images";
import { asteroidHelper } from "./asteriod";
import { clientRocket, rocketHelper } from "./rocket";

export let galaxiesData: GalaxyWithoutObjectsI[]
export let galaxyData: GalaxyI

export function setGalaxyData(d: GalaxyI) { galaxyData = d }
export function setGalaxiesData(d: GalaxyWithoutObjectsI[]) { galaxiesData = d }

export function migrateObjectData<T extends IDable>(arr: T[], migratingArray: T[]) {
    return arr.map(r => {
        const replacement = migratingArray.find(o => o.id === r.id)
        return replacement ? replacement : r
    }) 
}

export function galaxyHelper(o: GalaxyI) {
    return {
        migrateData(n: GalaxyObjectsI) {
            let copy = { ...o.objects }
            copy.rockets = migrateObjectData(copy.rockets, n.rockets)
            copy.asteroids = migrateObjectData(copy.asteroids, n.asteroids)

            return copy
        },

        paintBorders(g: CanvasRenderingContext2D) {
            g.strokeStyle = 'darkred'
            g.lineWidth = 20
            g.beginPath()
            g.moveTo(0,0)
            g.lineTo(o.width, 0)
            g.lineTo(o.width, o.height)
            g.lineTo(0, o.height)
            g.closePath()
            g.stroke()
        },

        paintBackground(g: CanvasRenderingContext2D) {
            let x = -currentUser!.view!.eye.x/4.0
            let y = -currentUser!.view!.eye.y/4.0

            let w = o.width/2
            let h = o.height/2

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

            o.objects.asteroids.forEach(a => asteroidHelper(a).paint(g) )
            o.objects.rockets.forEach(r => rocketHelper(r).paint(g))
        }
    }
}