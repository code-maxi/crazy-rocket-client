import { DrawableObjectI } from "../../common/declarations";
import { getImage } from "../images";
import { PaintableHelperFunctionI } from "./decl";

export function drawableObject(o: DrawableObjectI) {
    return {
        drawMeWithTranform(g: CanvasRenderingContext2D) {
            g.drawImage(
                getImage(o.img),
                -o.geo.width/2.0, -o.geo.height/2.0,
                o.geo.width, o.geo.height
            )
        },
        paint(
            g: CanvasRenderingContext2D, 
            drawSelf?: (g: CanvasRenderingContext2D, drawImage: () => void) => void
        ) {
            g.save()
            g.translate(o.geo.pos.x, o.geo.pos.y)
            g.rotate(o.geo.ang)

            if (drawSelf !== undefined) drawSelf(g, () => this.drawMeWithTranform(g))
            else this.drawMeWithTranform(g)

            g.restore()
        }
    }
}