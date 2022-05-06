import { AsteroidPropsI, BasePropsI, GameObjectPaintDataI, PaintTransformI } from "./paint_declarations";
import { V, vec, Vector } from "../../common/math";
import { DirectionE, paintImage, paintIronBar, paintIronCircle, paintLabel, paintProcessBar, paintTable, transformRect } from "./paint_tools"
import { getImage } from "./images";
import { BaseExtensionTypeE } from "../decl";

export interface PaintFunctionI {
    zIndex: number, 
    paintFunc: (data: GameObjectPaintDataI, gc: CanvasRenderingContext2D, trans: PaintTransformI) => void 
}


export function paintObject(data: GameObjectPaintDataI, gc: CanvasRenderingContext2D, index: number, trans: PaintTransformI) {
    const o = paintHelpers.get(data.type)
    if (o) o[index]?.paintFunc(data, gc, trans)
}

export function paintObjectsSorted(objects: GameObjectPaintDataI[], gc: CanvasRenderingContext2D, trans: PaintTransformI) {
    let listOfPaintFuncs: {zIndex: number, index: number, data: GameObjectPaintDataI}[] = []
    objects.forEach(data => {
        const fncs = paintHelpers.get(data.type)
        if (fncs) fncs.forEach((it, i) => 
            listOfPaintFuncs.push({
                zIndex: it.zIndex,
                index: i,
                data: data
            })
        )
    })
    listOfPaintFuncs.sort(f => f.zIndex)

    listOfPaintFuncs.forEach(f => {
        const fncs = paintHelpers.get(f.data.type)!
        fncs[f.index]!.paintFunc(f.data, gc, trans)
    })
}

const paintHelpers = new Map<
    string, 
    PaintFunctionI[]
>([
    ['ASTEROID', [{ zIndex: 0, paintFunc: (data, gc, trans) => {
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
    }}]],
    ['BASE', [
        {
            zIndex: -1,
            paintFunc: (data, gc, trans) => {
                const castedData = data.props as BasePropsI

                if (castedData.outerRingRadius) {
                    transformRect(gc, {
                        pos: data.pos,
                        size: V.square(castedData.outerRingRadius!),
                        transform: trans,
                        rotation: castedData.outerRingRotation!,
                        origin: V.zero()
                    }, (gc, pos, size) => {
                        if (castedData.interceptionRadius) {
                            const r1 = castedData.outerRingRadius! * trans.wholeScaling
                            const r2 = castedData.interceptionRadius! * trans.wholeScaling
                            
                            const gr = gc.createRadialGradient(
                                pos.x, pos.y, r1,
                                pos.x, pos.y, r2
                            )

                            const teamColor = castedData.teamColor.toLowerCase()

                            let color = '255,0,0'
                            if (teamColor === 'green') color = '0,255,0'
                            if (teamColor === 'blue') color = '0,50,255'
                            if (teamColor === 'yellow') color = '150,150,0'
                            
                            gr.addColorStop(0, 'rgba('+color+', 0.3)')
                            gr.addColorStop(1, 'rgba(0,0,0,0)')
                            
                            gc.strokeStyle = gr
                            gc.lineWidth = r2 - r1

                            gc.beginPath()
                            gc.arc(pos.x, pos.y, (r1+r2)/2, 0, Math.PI*2)
                            gc.stroke()
                        }

                        const rt1 = V.al(Math.PI/4 - Math.PI/2, castedData.enterZoneRadius * 0.9 * trans.scaling * trans.unitToPixel)
                        const rt2 = V.al(Math.PI/10 - Math.PI/2, castedData.outerRingRadius! * trans.scaling * trans.unitToPixel)

                        gc.lineWidth = 15 * trans.scaling

                        paintIronBar(gc, rt1, V.mirrorX(rt2))
                        paintIronBar(gc, V.mirrorX(rt1), (rt2))

                        paintIronBar(gc, V.mirrorY(rt1), V.negate(rt2))
                        paintIronBar(gc, V.negate(rt1), V.mirrorY(rt2))


                        gc.lineWidth = 24 * trans.scaling
                        
                        paintIronCircle(gc, pos, size.x)

                        castedData.extensions.forEach((e,i) => {
                            gc.save()
                            gc.rotate(e.place * (Math.PI / 180))

                            const pos = vec(
                                -castedData.extensionWidth / 2 * trans.wholeScaling,
                                (-castedData.outerRingRadius! * 1.05) * trans.wholeScaling
                            )

                            const image = getImage(e.type === BaseExtensionTypeE.CARGO_AREA ? 'game/base-cargo-extension.png' : 'game/base-human-extension.png')

                            gc.drawImage(
                                image, 
                                pos.x, pos.y, 
                                castedData.extensionWidth * trans.wholeScaling,
                                castedData.extensionWidth * trans.wholeScaling
                            )
                            gc.restore()
                        })
                    })
                }
            }
        },
        {
            zIndex: 10,
            paintFunc: (data, gc, trans) => {
                const castedData = data.props as BasePropsI

                transformRect(gc, {
                    pos: data.pos,
                    size: V.square(castedData.enterZoneRadius*2),
                    transform: trans
                }, (gc, pos, size) => {
                    gc.drawImage(getImage('game/base-enter-zone-'+(castedData.teamColor).toLowerCase()+'.png'), pos.x, pos.y, size.x, size.y)
                    const middle = V.add(pos, V.half(size))

                    gc.font = '200 '+(30 * trans.scaling)+'px sans-serif'
                    gc.textAlign = 'center'

                    gc.textBaseline = 'bottom'
                    gc.fillStyle = 'white'
                    gc.fillText('BASE', middle.x, middle.y - 20)
                    
                    gc.font = '400 '+(50 * trans.scaling)+'px sans-serif'
                    gc.textBaseline = 'top'
                    gc.fillStyle = 'lightyellow'
                    gc.fillText(castedData.name, middle.x, middle.y)
                })

                const eyeBaseDelta = V.sub(trans.eye, data.pos)
                const isDistanceTooSmall = V.length(eyeBaseDelta) < 6
                
                const radius = castedData.outerRingRadius && !isDistanceTooSmall ? (castedData.outerRingRadius*1.2) : (castedData.enterZoneRadius*1.3)
                const tableDelta = V.el(eyeBaseDelta, radius)
                const tablePos = V.add(data.pos, tableDelta)
                
                let tickDirection: DirectionE = 'top'

                if (Math.abs(tableDelta.x) > Math.abs(tableDelta.y)) tickDirection = tableDelta.x > 0 ? 'left' : 'right'
                else tickDirection = tableDelta.y > 0 ? 'top' : 'bottom'

                paintTable(gc, {
                    heading: 'BASE ' + castedData.name,
                    valuesMap: castedData.tableValues,
                    fColor: 'white',
                    fSize: 14,
                    hfColor: 'white',
                    fFamily: 'ubuntu',
                    bColor: 'rgb(60,60,60)',
                    bColor2: 'rgb(40,40,40)',
                    bRadius: 5,
                    bPadding: vec(8,8),
                    tickDirection: tickDirection,
                    transform: trans,
                    pos: tablePos
                })
            }
        }
    ]]
])