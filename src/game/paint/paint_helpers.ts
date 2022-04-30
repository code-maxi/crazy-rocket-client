import { AsteroidPropsI, GamePaintDataI, PaintTransformI } from "./paint_declarations";
import { V, vec } from "../../common/math";
import { paintImage, paintLabel, paintProcessBar, paintTable } from "./paint_tools"

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
            value: 30,
            size: vec(1.25, 0.25),
            pos: data.pos,
            transform: trans,
            fColor2: 'rgb(100,255,0)',
            fColor1: 'rgb(255,100,0)',
            borderColor: 'black',
            bColor: 'rgba(0,0,0, 0.5)'
        })

        /*paintLabel(gc, {
            transform: trans,
            pos: data.pos,
            screenTransform: vec(0, -100),
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At risus viverra adipiscing at in. Nunc sed blandit libero volutpat sed.',
            gapBetweenLines: 3,
            fColor: 'white',
            fSize: 14,
            fFamily: 'ubuntu',
            bColor: 'rgb(30,30,30)',
            bColor2: 'rgb(70,70,70)',
            paintBorder: true,
            borderWidth: 1,
            borderColor: 'rgb(128, 128, 0)',
            bRadius: 5,
            maxTextLength: 30,
            tickDirection: 'bottom'
        })*/

        paintTable(gc,  {
            heading: 'Das Meerschwein',
            valuesMap: [
                ['Bubität', 'sehr hoch'],
                ['Kampfbere', 'sehr niedrig'],
                ['max. Alter', '7'],
                ['max. Size', '5cm']
            ],
            fColor: 'white',
            fSize: 14,
            hfColor: 'white',
            fFamily: 'ubuntu',
            bColor: 'rgb(60,60,60)',
            bColor2: 'rgb(40,40,40)',
            bRadius: 5,
            bPadding: vec(8,8),
            tickDirection: 'top',
            transform: trans
        })
    }]
])