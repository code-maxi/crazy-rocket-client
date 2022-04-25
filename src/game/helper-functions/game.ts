import { ClientGameDataI, TypeObjectI, AsteroidI, RocketI, VectorI } from "../../common/declarations";
import { getImage } from "../paint/images";
import { asteroidHelper } from "./asteriod";
import { rocketHelper } from "./rocket";

export function gameHelper(sis: ClientGameDataI) {
    return {
        migrateData(n: TypeObjectI[]) {
            return [ ...sis.objects ].map(o => {
                const replacement = n.find(np => np.id === o.id)
                return replacement ? replacement : o
            })
        },

        paintBorders(g: CanvasRenderingContext2D) {
            g.strokeStyle = 'darkred'
            g.lineWidth = 20
            g.beginPath()
            g.moveTo(0,0)
            g.lineTo(sis.props.width, 0)
            g.lineTo(sis.props.width, sis.props.height)
            g.lineTo(0, sis.props.height)
            g.closePath()
            g.stroke()
        },

        paintBackground(g: CanvasRenderingContext2D, eye: VectorI, canvasSize: VectorI) {
            let x = -eye.x/4.0
            let y = -eye.y/4.0

            let w = sis.props.width/2
            let h = sis.props.height/2

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

            const xl = x > 0 && x < canvasSize.x
            const yt = y > 0 && y < canvasSize.y
            const xr = x+w > 0 && x+w < canvasSize.x
            const yb = y+h > 0 && y+h < canvasSize.y

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
            this.forEachObjects(
                r => rocketHelper(r).paint(g),
                a => asteroidHelper(a).paint(g)
            )
        },

        paintWorld(
            g: CanvasRenderingContext2D, 
            eye: VectorI, 
            zoom: number,
            canvasSize: VectorI
        ) {
            g.save()

            this.paintBackground(g, eye, canvasSize)
            
            g.translate(-eye.x + canvasSize.x/2.0, -eye.y + canvasSize.y/2.0)
            g.scale(zoom, zoom)

            this.paintBorders(g)

            this.paintObjects(g)

            g.restore()
        },

        forEachObjects(
            rocketsF: (r: RocketI) => void,
            asteriodF: (a: AsteroidI) => void
        ) {
            sis.objects.forEach(o => {
                try {
                    if (o.type == 'asteroid') asteriodF(o as AsteroidI)
                    if (o.type == 'rocket') rocketsF(o as RocketI)
                }
                catch {
                    alert('Object ' + JSON.stringify(o) + 'can not be casted.')
                }
            })
        }
    }
}