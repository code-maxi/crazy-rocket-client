import { AsteroidI } from "../../common/declarations";
import { drawableObject } from "./drawableObject";

export function asteroidHelper(a: AsteroidI) {
    return {
        paint(g: CanvasRenderingContext2D) {
            drawableObject(a).paint(g, (gc, drawImage) => {
                drawImage()

                if (a.live < 1.0) {
                    gc.save()
                    gc.translate(a.geo.pos.x - a.geo.width / 2.0, a.geo.pos.y - a.geo.height / 2.0)
    
                    gc.fillStyle = "rgb(170,170,170)"
                    gc.strokeStyle = "black"
                    gc.lineWidth = 1.0
                    gc.fillRect(0.0, 0.0, a.geo.width, a.geo.height)
    
                    gc.fillStyle = "rgb(${255.0 * (1 - live)},${255.0 * live},0)"
                    gc.fillRect(0.0, 0.0, a.geo.width * a.live, a.geo.height)
    
                    gc.strokeRect(0.0, 0.0, a.geo.width, a.geo.height)
                    gc.strokeRect(0.0, 0.0, a.geo.width * a.live, a.geo.height)
    
                    gc.restore()
                }
            })
        }
    }
}