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
    bPadding?: number
    bRadius?: number
    tickDirection?: DirectionE
    tickSize?: number
    tickFac?: number,
    paintBorder?: boolean
}

const PaintBackroundDefault: PaintBackroundI = {
    bColor: 'rgba(0,0,0,0.5)',
    bPadding: 5,
    tickSize: 10,
    tickFac: 0.5,
    borderWidth: 1,
    paintBorder: false
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
}

const PaintGeoDefault: PaintGeoI = {
    pos: vec(0,0),
    origin: vec(0.5,0.5),
    size: vec(10,10)
}

// Transform

export function worldToScreen(pos: VectorI, trans: PaintTransformI) {
    return V.add(V.mul(V.sub(pos, trans.eye), trans.scaling), V.half(trans.canvasSize))
}
export function screenToWorld(pos: VectorI, trans: PaintTransformI) {
    return V.add(V.mul(V.sub(pos, V.half(trans.canvasSize)), 1/trans.scaling), trans.eye)
}

export function transformRect(
    gc: CanvasRenderingContext2D, config: PaintGeoI, 
    callback: (gc: CanvasRenderingContext2D, pos: VectorI, size: VectorI) => void,
    ownScaling?: number,
    stillUseTransform?: boolean
) {
    const size = config.transform ? V.mul(config.size!, ownScaling ? ownScaling : config.transform.scaling) : config.size!
    let pos = config.transform ? worldToScreen(config.pos!, config.transform) : config.pos!

    const useTransform = (config?.rotation && config.rotation != 0) || stillUseTransform === true

    if (useTransform) {
        gc.save()
        gc.translate(pos.x, pos.y)
        if (config?.rotation) gc.rotate(config.rotation)
    }
    
    let relativePosWithCenter = V.mulVec(size, V.negate(vec(0.5,0.5)))
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
    borderWidth: 1
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

        if (options.borderColor) {
            setBackgroundStyle(gc, options, pos, V.addX(pos, size.x))
            drawRoundRectangle(gc, pos.x, pos.y, size.x, size.y, options.roundedCorners!)
            gc.stroke()
        }
    }, 1)
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

    gc.closePath()

    setBackgroundStyle(gc, options, pos, V.add(pos, size))

    gc.fill()

    if (options.paintBorder === true) gc.stroke()

    gc.setLineDash([])
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

export type PaintToolTypesE = 'LABEL' | 'TABLE'

export function paintLabel(gc: CanvasRenderingContext2D, opt: LabelOptionsI) {
    let options: LabelOptionsI = {
        ...LabelOptionsDefault,
        ...opt
    }

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

    const summedLineHeight = lines.length * options.fSize!
    const summedLineGap = lines.length > 1 ? (lines.length - 1) * gapBetweenLines : 0
    
    const maxHeight = summedLineHeight + summedLineGap

    options.size = vec(maxWidth + 2*options.bPadding!, maxHeight + 2*options.bPadding!)

    transformRect(gc, options, (gc, pos, size) => {
        paintBackroundArea(gc, {...options, pos: pos, size: size})

        gc.textBaseline = 'top'
        gc.textAlign = 'left'

        gc.fillStyle = options.fColor!
        gc.font = options.fFamily! + ' ' + options.fSize! + 'px'

        for (let i = 0; i < lines.length; i++) {
            gc.fillText(
                lines[i], 
                pos.x + options.bPadding!,
                pos.y + options.bPadding! + 2 + i * (options.fSize! + gapBetweenLines)
            )
        }
    }, 1)
}

// Image

