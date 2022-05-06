import { map } from "jquery";
import { config } from "process";
import wrap from "word-wrap";
import { VectorI } from "../../common/declarations";
import { V, vec, Vector } from "../../common/math";
import { getImage } from "./images";
import { drawRoundRectangle, paintPoint, setGradiendOrColor } from "./paint_addons";
import { PaintTransformI } from "./paint_declarations";

export type DirectionE = 'top' | 'left' | 'right' | 'bottom'

export interface PaintBackroundI {
    bColor?: string
    bColor2?: string
    borderColor?: string
    borderDash?: number[]
    borderWidth?: number
    bPadding?: VectorI,
    bRadius?: number
    tickDirection?: DirectionE
    tickSize?: number
    tickFac?: number,
    paintBorder?: boolean,
    paintBackground?: boolean
}

const PaintBackroundDefault: PaintBackroundI = {
    bColor: 'rgba(0,0,0,0.5)',
    bPadding: vec(5,8),
    tickSize: 10,
    tickFac: 0.5,
    borderWidth: 1,
    paintBorder: false,
    paintBackground: true
}

function setBackgroundStyle(gc: CanvasRenderingContext2D, opt: PaintBackroundI, pos1?: VectorI, pos2?: VectorI) {
    const options = { ...PaintBackroundDefault, ...opt }
    gc.fillStyle = setGradiendOrColor(gc, options.bColor!, options.bColor2, pos1, pos2)
    gc.strokeStyle = options.borderColor!
    if (options.borderDash) gc.setLineDash(options.borderDash)
    gc.lineWidth = options.borderWidth!
}

export interface PaintFontI {
    fColor?: string
    fSize?: number
    fFamily?: string
}

const PaintFontDefault: PaintFontI = {
    fColor: 'white',
    fSize: 16,
    fFamily: 'sans-serif'
}

export interface PaintGeoI {
    pos?: VectorI
    origin?: VectorI
    size?: VectorI
    rotation?: number
    transform?: PaintTransformI
    screenTransform?: VectorI
    ownScaling?: number
    partiallyScaling?: number
}

const PaintGeoDefault: PaintGeoI = {
    pos: vec(0,0),
    origin: vec(0.5,0.5),
    size: vec(10,10),
    screenTransform: vec(0,0)
}

// Transform

export function maxSizeString(str: string, maxSize: number) {
    return str.length > maxSize ? str.substring(0, maxSize - 3) +'...' : str
}

export function stringTimesNumber(s: string, n: number) {
    let res = ''
    for (let i = 0; i < n; i ++) res += s
    return res
}

export function sizeString(str: string, size: number) {
    const it = maxSizeString(str, size)
    return it + stringTimesNumber(' ', size - it.length)
}

export function worldToScreen(pos: VectorI, trans: PaintTransformI) {
    return V.add(V.mul(V.sub(pos, trans.eye), trans.scaling * trans.unitToPixel), V.half(trans.canvasSize))
}
export function screenToWorld(pos: VectorI, trans: PaintTransformI) {
    return V.add(V.mul(V.sub(pos, V.half(trans.canvasSize)), 1/(trans.scaling * trans.unitToPixel)), trans.eye)
}
export function pixelToUnit(value: VectorI, trans: PaintTransformI) { return V.mul(value, 1/trans.unitToPixel) }
export function unitToPixel(value: VectorI, trans: PaintTransformI) { return V.mul(value, trans.unitToPixel) }

export function scalingOfGeoObject(config: PaintGeoI) {
    return config.ownScaling ? config.ownScaling : (
        config.partiallyScaling ? 1 + (config.transform!.scaling - 1) * config.partiallyScaling : config.transform!.scaling
    )
}

export function transformRect(
    gc: CanvasRenderingContext2D, config: PaintGeoI, 
    callback: (gc: CanvasRenderingContext2D, pos: VectorI, size: VectorI) => void,
    useTransformAlways?: boolean,
    ownScaling?: number
) {
    const scaling = ownScaling ? ownScaling :  scalingOfGeoObject(config)

    const size = config.transform ? V.mul(config.size!, scaling * config.transform!.unitToPixel) : config.size!
    let pos = config.transform ? worldToScreen(config.pos!, config.transform) : config.pos!
    if (config.screenTransform) pos = V.add(pos, V.mul(config.screenTransform, scaling))

    const useTransform = (config?.rotation && config.rotation != 0) || useTransformAlways === true

    if (useTransform) {
        gc.save()
        gc.translate(pos.x, pos.y)
        if (config?.rotation) gc.rotate(config.rotation)
    }
    
    let relativePosWithCenter = V.mulVec(size, V.negate(config.origin ? config.origin : V.vec(0.5,0.5)))
    if (useTransform === false) relativePosWithCenter = V.add(relativePosWithCenter, pos)

    /*paintPoint(gc, V.zero(), "red", 10)
    paintPoint(gc, relativePosWithCenter, "blue", 2)
    
    gc.strokeStyle = "yellow"
    gc.lineWidth = 2
    drawRoundRectangle(gc, relativePosWithCenter.x, relativePosWithCenter.y, size.x, size.y, 5)
    gc.stroke()*/

    callback(gc, relativePosWithCenter, size)

    if (useTransform) gc.restore()
}

// Image

export interface PaintImageI extends PaintGeoI {
    src?: string
}

export function paintImage(gc: CanvasRenderingContext2D, opt: PaintImageI) {
    const options: PaintImageI = {
        ...PaintGeoDefault,
        src: 'noimage.png',
        ...opt
    }
    transformRect(gc, options, (gc, pos, size) => {
        const image = getImage(options.src)
        gc.drawImage(image, pos.x, pos.y, size.x, size.y)
    })
}

// Process Bar

export interface PaintProcessI extends PaintGeoI {
    value?: number
    size?: VectorI
    roundedCorners?: number
    fColor1?: string
    fColor2?: string
    bColor?: string
    bColor2?: string
    borderColor?: string,
    borderWidth?: number
}

const PaintProcessDefault: PaintProcessI = {
    value: 50,
    size: vec(40, 20),
    roundedCorners: 5,
    fColor1: 'red',
    fColor2: 'green',
    bColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    partiallyScaling: 0.4
}

export function paintProcessBar(gc: CanvasRenderingContext2D, opt: PaintProcessI) {
    const options: PaintProcessI = {
        ...PaintProcessDefault,
        ...PaintGeoDefault,
        ...opt
    }

    transformRect(gc, options, (gc, pos, size) => {
        setBackgroundStyle(gc, options, pos, V.addX(pos, size.x))
        drawRoundRectangle(gc, pos.x, pos.y, size.x, size.y, options.roundedCorners!)
        gc.fill()
        
        setBackgroundStyle(gc, {
            bColor: options.fColor1,
            bColor2: options.fColor2
        }, pos, V.addX(pos, size.x))

        drawRoundRectangle(gc, pos.x, pos.y, size.x * (options.value!/100), size.y, options.roundedCorners!)
        gc.fill()
        gc.stroke()

        if (options.borderColor) {
            setBackgroundStyle(gc, options, pos, V.addX(pos, size.x))
            drawRoundRectangle(gc, pos.x, pos.y, size.x, size.y, options.roundedCorners!)
            gc.stroke()
        }
    })
}

// Rounded Rectangle

export interface PaintBackgroundAreaI extends PaintBackroundI {
    pos: VectorI,
    size: VectorI
}

export function paintBackroundArea(gc: CanvasRenderingContext2D, opt: PaintBackgroundAreaI) {
    const options: PaintBackgroundAreaI = {
        ...PaintBackroundDefault,
        ...opt
    }

    if (options.paintBackground === true) {
        let r = options.bRadius!

        const pos = options.pos!
        const size = options.size!

        const x = pos.x
        const y = pos.y
        const w = size.x
        const h = size.y
        const tickSize = options.tickSize!

        const paintTick = () => {
            let trianglePos: [VectorI, VectorI, VectorI] | null = null
            
            const fac = options.tickFac!
            const d = options.tickDirection

            if (d == 'top') {
                const p = V.addX(pos, size.x * fac)
                trianglePos = [
                    V.addX(p, -tickSize/2),
                    V.addY(p, -tickSize),
                    V.addX(p, tickSize/2)
                ]
            }
            else if (d == 'left') {
                const p = V.addY(pos, size.y * fac)
                trianglePos = [
                    V.addY(p, -tickSize/2),
                    V.addX(p, -tickSize),
                    V.addY(p, tickSize/2)
                ]
            }
            else if (d == 'bottom') {
                const p = V.add(pos, vec(size.x * fac, size.y))
                trianglePos = [
                    V.addX(p, -tickSize/2),
                    V.addY(p, tickSize),
                    V.addX(p, tickSize/2)
                ]
            }
            else if (d == 'right') {
                const p = V.add(pos, vec(size.x, size.y * fac))
                trianglePos = [
                    V.addY(p, -tickSize/2),
                    V.addX(p, tickSize),
                    V.addY(p, tickSize/2)
                ]
            }

            trianglePos!.forEach(p => gc.lineTo(p.x, p.y))
        }

        gc.beginPath()

        if (r === 0) {
            gc.moveTo(x,y)
            if (options.tickDirection === 'top') paintTick()
            gc.lineTo(x + w, y)
            if (options.tickDirection === 'right') paintTick()
            gc.lineTo(x + w, y + h)
            if (options.tickDirection === 'bottom') paintTick()
            gc.lineTo(x, y + h)
            if (options.tickDirection === 'left') paintTick()
        }

        else {
            if (w < 2 * r) r = w / 2
            if (h < 2 * r) r = h / 2
            gc.moveTo(x+r, y)
            if (options.tickDirection === 'top') paintTick()
            gc.arcTo(x+w, y,   x+w, y+h, r)
            if (options.tickDirection === 'right') paintTick()
            gc.arcTo(x+w, y+h, x,   y+h, r)
            if (options.tickDirection === 'bottom') paintTick()
            gc.arcTo(x,   y+h, x,   y,   r)
            if (options.tickDirection === 'left') paintTick()
            gc.arcTo(x,   y,   x+w, y,   r)
        }

        setBackgroundStyle(gc, options, pos, V.add(pos, size))

        gc.fill()

        if (options.paintBorder === true) gc.stroke()

        gc.setLineDash([])
    }
}

// Label

export interface LabelOptionsI extends PaintFontI, PaintBackroundI, PaintGeoI {
    text?: string
    maxTextLength?: number
    gapBetweenLines?: number
}

const LabelOptionsDefault: LabelOptionsI = {
    ...PaintBackroundDefault,
    ...PaintFontDefault,
    ...PaintGeoDefault,
    text: 'No text specified!',
    maxTextLength: 10,
    gapBetweenLines: 5
}

export function paintLabel(gc: CanvasRenderingContext2D, opt: LabelOptionsI) {
    let options: LabelOptionsI = {
        ...LabelOptionsDefault,
        ...opt
    }

    const fontSize = (options.fSize!)

    options.gapBetweenLines = options.gapBetweenLines!

    gc.font = fontSize + 'px ' + options.fFamily!

    const givenText = options.maxTextLength ? wrap(options.text!, {
        width: options.maxTextLength!
    }) : options.text!

    const lines = givenText.split('\n')
    const gapBetweenLines = 5

    let maxWidth = 0

    lines.forEach((l: string) => {
        const lLength = gc.measureText(l).width
        if (lLength > maxWidth) maxWidth = lLength
    })

    const summedLineHeight = lines.length * fontSize
    
    const maxHeight = summedLineHeight + ((lines.length - 1) * gapBetweenLines)

    options.size = pixelToUnit(vec(maxWidth + 2*options.bPadding!.x, maxHeight + 2*options.bPadding!.y), options.transform!)

    transformRect(gc, options, (gc, pos, size) => {
        paintBackroundArea(gc, {...options, pos: pos, size: size})

        gc.textBaseline = 'top'
        gc.textAlign = 'left'

        gc.fillStyle = options.fColor!

        for (let i = 0; i < lines.length; i++) {
            gc.fillText(
                lines[i], 
                pos.x + options.bPadding!.x,
                pos.y + options.bPadding!.y + i * (options.fSize! + gapBetweenLines)
            )
        }
    }, undefined, 1)
}

// Table

export interface TableOptionsI extends PaintFontI, PaintBackroundI, PaintGeoI {
    heading?: string,
    valuesMap?: [string, string][],
    hfColor?: string,
    gapBetweenLines?: number,
    vGap?: number,
    hGap?: number,
    vfColor?: string
}

const TableOptionsDefault: TableOptionsI = {
    ...PaintBackroundDefault,
    ...PaintFontDefault,
    ...PaintGeoDefault,
    heading: 'No heading specified!',
    valuesMap: [],
    hfColor: 'yellow',
    hGap: 10,
    vGap: 5,
    vfColor: 'lightyellow'
}

export function paintTable(gc: CanvasRenderingContext2D, opt: TableOptionsI) {
    const options = {
        ...TableOptionsDefault,
        ...opt
    }

    const hfSize = options.fSize! * 1.1
    const hvGap = options.vGap! * 1.5

    const hFont = 'bold ' + hfSize + 'px ' + options.fFamily!
    const tFont = 'normal ' + options.fSize! + 'px ' + options.fFamily!

    gc.font = hFont
    const hWidth = gc.measureText(options.heading!).width

    gc.font = tFont

    let longestKey = 0
    let longestValue = 0

    options.valuesMap!.forEach(pair => {
        const kLength = gc.measureText(pair[0]).width
        const vLength = gc.measureText(pair[1]).width

        if (kLength > longestKey) longestKey = kLength
        if (vLength > longestValue) longestValue = vLength
    })

    const mapWidth = longestKey + options.hGap! + longestValue
    const maxWidth = 2*options.bPadding!.x + (mapWidth > hWidth ? mapWidth : hWidth)
    const maxHeight = 2*options.bPadding!.y + hfSize + options.valuesMap!.length * (options.fSize! + options.vGap!) + (hvGap - options.vGap!)

    transformRect(gc, {
        ...options,
        size: pixelToUnit(vec(maxWidth, maxHeight), options.transform!)
    }, (gc, pos, size) => {
        paintBackroundArea(gc, {...options, pos: pos, size: size})

        gc.textBaseline = 'top'
        gc.textAlign = 'left'

        gc.fillStyle = options.hfColor!
        gc.font = hFont

        gc.fillText(
            options.heading!, 
            options.bPadding!.x + pos.x,
            options.bPadding!.y + pos.y
        )

        gc.fillStyle = options.vfColor!
        gc.font = tFont

        const mapPos = vec(
            options.bPadding!.x + pos.x,
            options.bPadding!.y + hfSize + hvGap + pos.y
        )

        for (let i = 0; i < options.valuesMap!.length; i ++) {
            const yPos = mapPos.y + i * (options.vGap! + options.fSize!)
            
            gc.fillStyle = options.fColor!
            gc.fillText(
                options.valuesMap![i][0], 
                mapPos.x,
                yPos
            )

            gc.fillStyle = options.vfColor!
            gc.fillText(
                options.valuesMap![i][1], 
                mapPos.x + longestKey + options.hGap!,
                yPos
            )
        }
    }, undefined, 1)
}

export const ironColors = [
    'rgb(50,50,50)',
    'rgb(150,150,150)'
]

export function paintIronBar(gc: CanvasRenderingContext2D, p1: VectorI, p2: VectorI) {
    const delta = V.sub(p2, p1)

    const nv = V.normalRight(V.mul(V.e(delta), gc.lineWidth/2))

    const gr = gc.createLinearGradient(
        p1.x - nv.x, p1.y - nv.y,
        p1.x + nv.x, p1.y + nv.y
    )

    gr.addColorStop(0,ironColors[0])
    gr.addColorStop(0.5,ironColors[1])
    gr.addColorStop(1,ironColors[0])

    gc.strokeStyle = gr
    
    gc.beginPath()
    gc.moveTo(p1.x, p1.y)
    gc.lineTo(p2.x, p2.y)
    gc.stroke()
}

export function paintIronCircle(gc: CanvasRenderingContext2D, p: VectorI, radius: number) {
    const gr = gc.createRadialGradient(
        p.x, p.x, radius - gc.lineWidth/2,
        p.x, p.y, radius + gc.lineWidth/2
    )

    gr.addColorStop(0,ironColors[0])
    gr.addColorStop(0.5,ironColors[1])
    gr.addColorStop(1,ironColors[0])

    gc.strokeStyle = gr
    
    gc.beginPath()
    gc.arc(p.x, p.y, radius, 0, Math.PI*2)
    gc.closePath()
    gc.stroke()
}

// Image

