import { AsteroidPropsI, BasePropsI, GameObjectPaintDataI, PaintTransformI, PlanetPropsI } from "./paint_declarations";
import { V, vec, Vector } from "../../common/math";
import { DirectionE, followingTooltipCircular, paintCircledShaddow, paintImage, paintIronBar, paintIronCircle, paintLabel, paintProcessBar, paintTable, rectRectCollision, screenToWorld, transformRect, worldToScreen } from "./paint_tools"
import { getImage } from "./images";
import { BaseExtensionTypeE } from "../decl";
import { CircledBooomAnimationPropsI } from "./animation/booom"
import { drawRoundRectangle } from "./paint_addons";

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
    ['BACKGRUOND', [{
        zIndex: -10, paintFunc: (data, gc, trans) => {
            const eye = trans.eye
            let x = -eye.x/4.0
            let y = -eye.y/4.0

            let w = data.props.width / 10
            let h = data.props.height / 10

            let xx = x
            let yy = y

            while (x < 0) x += w
            while (x >= w) x -= w
            while (y < 0) y += h
            while (y >= h) y -= h

            xx -= x
            yy -= y

            xx /= w
            yy /= h

            const wScaling = 1.5

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
                
                gc.drawImage(
                    getImage(gi())!,
                    (x + dx) * trans.wholeScaling * wScaling,
                    (y + dy) * trans.wholeScaling,
                    w * trans.wholeScaling * wScaling, h * trans.wholeScaling
                )
            }

            const xl = x > 0 && x < trans.canvasSize.x
            const yt = y > 0 && y < trans.canvasSize.y
            const xr = x+w > 0 && x+w < trans.canvasSize.x
            const yb = y+h > 0 && y+h < trans.canvasSize.y

            if (xl) di(-w, 0)
            if (yt) di(0, -h)

            if (xr) di(w, 0)
            if (yb) di(0, h)

            if (xl && yt) di(-w, -h)
            if (xr && yt) di(w, -h)
            if (xr && yb) di(w, h)
            if (xl && yb) di(-w, h)

            di(0, 0)
        }
    }]],
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

    ['PLANET', [
        {
            zIndex: -1,
            paintFunc: (data, gc, trans) => {
                const castedData = data.props as PlanetPropsI
                
                paintImage(gc, {
                    src: castedData.img,
                    size: V.square(castedData.radius*2),
                    pos: data.pos,
                    rotation: castedData.rotation,
                    transform: trans
                })

                const followingTooltip = followingTooltipCircular(data.pos, castedData.radius, trans)

                paintTable(gc, {
                    heading: 'PLANET ' + castedData.name,
                    valuesMap: castedData.tableValues,
                    tickDirection: followingTooltip.tickDirection,
                    transform: trans,
                    pos: followingTooltip.pos
                })

                const hidingByPixelRadius = [
                    150,
                    300
                ]

                castedData.cities.forEach((c,i) => {
                    const cityPos = V.add(data.pos, V.mul(c.relPosToPlanet, castedData.radius*2 / 100))
                    const srPos = V.sub(cityPos, V.square(c.size/2))
                    
                    const touches = rectRectCollision(
                        worldToScreen(srPos, trans), 
                        V.square(c.size * trans.wholeScaling), 
                        V.zero(),
                        trans.canvasSize
                    )

                    if (touches) {
                        const cityPosScreen = worldToScreen(cityPos, trans)
                        const distanceToEyeInPx = V.distance(cityPos, trans.eye) * trans.wholeScaling

                        paintCircledShaddow(gc, 'rgba(0,0,0,0.5)', cityPosScreen, 0, c.size * 1.2 * trans.wholeScaling)

                        paintImage(gc, {
                            src: 'game/city.png',
                            size: V.square(c.size),
                            pos: cityPos,
                            transform: trans
                        })

                        gc.globalAlpha = distanceToEyeInPx > hidingByPixelRadius[0] ? (distanceToEyeInPx > hidingByPixelRadius[1] ? 0 : (
                            1 - (distanceToEyeInPx - hidingByPixelRadius[0]) / (hidingByPixelRadius[1] - hidingByPixelRadius[0])
                        )) : 1

                        if (gc.globalAlpha > 0) paintTable(gc, {
                            heading: c.name,
                            valuesMap: c.tableValues,
                            tickDirection: 'top',
                            transform: trans,
                            pos: V.addY(cityPos, c.size/2),
                            screenTransform: vec(0,20),
                            origin: vec(0.5,0)
                        })

                        gc.globalAlpha = 1
                    }
                })
            }
        }
    ]],

    ['BASE', [
        {
            zIndex: -1,
            paintFunc: (data, gc, trans) => {
                const castedData = data.props as BasePropsI

                if (castedData.outerRingRadius !== null) {
                    transformRect(gc, {
                        pos: data.pos,
                        size: V.square(castedData.outerRingRadius!),
                        transform: trans,
                        rotation: 0.00,
                        origin: V.zero()
                    }, (gc, pos, size) => {
                        
                        if (castedData.interceptionRadius !== null) {
                            const r1 = castedData.outerRingRadius! * trans.wholeScaling
                            const r2 = castedData.interceptionRadius! * trans.wholeScaling
                            
                            const teamColor = castedData.teamColor.toLowerCase()

                            let color = '255,0,0'
                            if (teamColor === 'green') color = '0,255,0'
                            if (teamColor === 'blue') color = '0,50,255'
                            if (teamColor === 'yellow') color = '150,150,0'

                            paintCircledShaddow(gc, 'rgba('+color+',0.4)', pos, r1, r2)
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

                        gc.save()
                        castedData.extensions.forEach((e,i) => {
                            const last = castedData.extensions[i-1]
                            gc.rotate((last ? (e.place - last.place) : e.place) * (Math.PI / 180))

                            const extensionPos = vec(
                                -castedData.extensionWidth / 2 * trans.wholeScaling,
                                (-castedData.outerRingRadius! * 1.05) * trans.wholeScaling
                            )

                            const image = getImage(e.type === BaseExtensionTypeE.CARGO_AREA ? 'game/base-cargo-extension.png' : 'game/base-human-extension.png')

                            gc.drawImage(
                                image, 
                                extensionPos.x, extensionPos.y, 
                                castedData.extensionWidth * trans.wholeScaling,
                                castedData.extensionWidth * trans.wholeScaling
                            )

                            if (e.stability < 95) {
                                paintProcessBar(gc, {
                                    value: e.stability,
                                    size: vec(castedData.extensionWidth/3, 0.25),
                                    pos: vec(0, extensionPos.y),
                                    ownScaling: trans.scaling * trans.unitToPixel,
                                    screenTransform: vec(0,-10),
                                    fColor2: 'rgb(100,255,0)',
                                    fColor1: 'rgb(255,100,0)',
                                    borderColor: 'black',
                                    bColor: 'rgba(0,0,0, 0.5)'
                                })
                            }
                        })
                        gc.restore()
                    }, true)
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

                    gc.font = '200 '+(30 * trans.scaling)+'px ethnocentric'
                    gc.textAlign = 'center'

                    gc.textBaseline = 'bottom'
                    gc.fillStyle = 'white'
                    gc.fillText('BASE', middle.x, middle.y - 15)
                    
                    gc.font = '400 '+(50 * trans.scaling)+'px ethnocentric'
                    gc.textBaseline = 'top'
                    gc.fillStyle = 'lightyellow'
                    gc.fillText(castedData.name, middle.x, middle.y)
                })

                const eyeBaseDelta = V.sub(trans.eye, data.pos)
                const isDistanceSmall = V.length(eyeBaseDelta) < 6
                const radius = castedData.outerRingRadius && !isDistanceSmall ? (castedData.outerRingRadius*1.2) : (castedData.enterZoneRadius*1.3)
                const followingTooltip = followingTooltipCircular(data.pos, radius, trans)

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
                    tickDirection: followingTooltip.tickDirection,
                    transform: trans,
                    pos: followingTooltip.pos
                })
            }
        }
    ]],

    ['BOOOM', [
        {
            zIndex: -1,
            paintFunc: (data, gc, trans) => {
                if (data.props.type === 'circled') {
                    const castedProps = data.props as CircledBooomAnimationPropsI

                    /*
                    gc.strokeStyle = 'white'
                    gc.lineWidth = 2

                    const spos = worldToScreen(data.srPos!, trans)
                    const ssize = V.mul(data.srSize!, trans.wholeScaling)
                    drawRoundRectangle(gc, spos.x, spos.y, ssize.x, ssize.y, 0).stroke()
                    */

                    castedProps.circles.forEach(c => {
                        const cScreenPos = worldToScreen(V.add(data.pos, c.relativePos), trans)

                        gc.fillStyle = c.color
                        gc.beginPath()
                        
                        gc.arc(
                            cScreenPos.x, cScreenPos.y, 
                            c.radius * trans.wholeScaling, 
                            0, Math.PI*2
                        )
                        gc.fill()
                    })
                }
            }
        }
    ]]
])