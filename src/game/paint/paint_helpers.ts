import { AsteroidPropsI, GamePaintDataI, PaintTransformI } from "./paint_declarations";
import { V, vec } from "../../common/math";
import { paintImage, paintLabel, paintProcessBar } from "./paint_tools"

export function paintObject(data: GamePaintDataI, gc: CanvasRenderingContext2D, trans: PaintTransformI) {
    paintHelpers.get(data.paintType)?.(data, gc, trans)
}

const paintHelpers = new Map<string, (data: GamePaintDataI, gc: CanvasRenderingContext2D, trans: PaintTransformI) => void>([
    ['ASTEROID', (data, gc, trans) => {
        const castedData = data.props as AsteroidPropsI

        /*paintImage(gc, {
            src: 'red-shaddow-point.png',
            size: V.square(castedData.radius),
            pos: data.pos,
            transform: trans
        })*/

        paintImage(gc, {
            src: 'asteroid.png',
            size: V.square(castedData.radius),
            pos: data.pos,
            transform: trans,
            rotation: castedData.rotation
        })

        paintProcessBar(gc, {
            value: 70,
            size: vec(70, 20),
            pos: data.pos,
            transform: trans,
            fColor2: 'rgb(100,255,0)',
            fColor1: 'rgb(255,100,0)',
            borderColor: 'black',
            bColor: 'rgba(0,0,0, 0.5)'
        })

        paintLabel(gc, {
            transform: trans,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At risus viverra adipiscing at in. Nunc sed blandit libero volutpat sed.',
            gapBetweenLines: 3,
            fColor: 'black',
            fSize: 16,
            fFamily: 'sans-serif',
            bColor: 'white',
            bColor2: 'grey',
            bRadius: 5,
            tickDirection: 'left'
        })
    }]
])