import { DrawableObjectI } from "../../common/declarations";
import { getImage } from "../images";

export function drawableObject(o: DrawableObjectI) {
    return {
        paint(
            g: CanvasRenderingContext2D, 
            drawSelf?: (g: CanvasRenderingContext2D, drawImage: () => void) => void
        ) {
            g.save()
            g.translate(o.geo.pos.x, o.geo.pos.y)
            g.rotate(o.geo.angle)

            const di = () => {
                g.drawImage(
                    getImage(o.img)!,
                    -o.geo.width/2.0, -o.geo.height/2.0,
                    o.geo.width, o.geo.height
                )
            }

            if (drawSelf !== undefined) drawSelf(g, di)
            else di()

            g.restore()
        }
    }
}