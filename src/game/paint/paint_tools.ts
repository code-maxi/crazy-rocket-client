import wrap from "word-wrap";
import { VectorI } from "../../common/declarations";
import { V, vec } from "../../common/math";

export type DirectionE = 'top' | 'left' | 'right' | 'bottom'

export interface PaintBackroundI {
    bColor?: string
    borderColor?: string
    borderDash?: number[]
    borderWidth?: number
    bPadding?: number
    bRadius?: number
    tickDirection?: DirectionE
    tickSize?: number
    tickFac?: number
}

const PaintBackroundDefault: PaintBackroundI = {
    bColor: 'rgba(0,0,0,0.5)',
    bPadding: 5,
    tickSize: 10,
    tickFac: 0.5,
    borderWidth: 1
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

export interface PaintPosI {
    pos?: VectorI
    origin?: VectorI
    rotate?: number
    size?: VectorI
}

const PaintPosDefault: PaintPosI = {
    pos: vec(0,0),
    origin: vec(0.5,0.5),
    size: vec(10,10)
}

// Rounded Rectangle

export interface PaintBackroundAreaI extends PaintPosI, PaintBackroundI {}

export function paintBackroundArea(gc: CanvasRenderingContext2D, opt: PaintBackroundAreaI) {
    const options: PaintBackroundAreaI = {
        ...PaintPosDefault,
        ...PaintBackroundDefault,
        ...opt
    }

    let r = options.bRadius
    const x = options.pos.x
    const y = options.pos.y
    const w = options.size.x
    const h = options.size.y

    const paintTick = () => {
        let trianglePos: [VectorI, VectorI, VectorI] = undefined
        
        const fac = options.tickFac
        const d = options.tickDirection

        if (d == 'top') {
            const pos = V.addX(options.pos, options.size.x * fac)
            trianglePos = [
                V.addX(pos, -options.tickSize/2),
                V.addY(pos, -options.tickSize),
                V.addX(pos, options.tickSize/2)
            ]
        }
        if (d == 'left') {
            const pos = V.addY(options.pos, options.size.y * fac)
            trianglePos = [
                V.addY(pos, -options.tickSize/2),
                V.addX(pos, -options.tickSize),
                V.addY(pos, options.tickSize/2)
            ]
        }
        if (d == 'bottom') {
            const pos = V.add(options.pos, vec(options.size.x * fac, options.size.y))
            trianglePos = [
                V.addX(pos, -options.tickSize/2),
                V.addY(pos, options.tickSize),
                V.addX(pos, options.tickSize/2)
            ]
        }
        if (d == 'right') {
            const pos = V.add(options.pos, vec(options.size.x, options.size.y * fac))
            trianglePos = [
                V.addY(pos, -options.tickSize/2),
                V.addX(pos, options.tickSize),
                V.addY(pos, options.tickSize/2)
            ]
        }

        trianglePos.forEach(p => gc.lineTo(p.x, p.y))
    }

    gc.beginPath()
    if (r == 0) {
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

    gc.fillStyle = options.bColor
    
    if (options.borderDash) gc.setLineDash(options.borderDash)
    if (options.borderWidth) gc.lineWidth = options.borderWidth

    gc.fill()

    if (options.borderColor) {
        gc.strokeStyle = options.borderColor
        gc.stroke()
    }
    gc.setLineDash([])
}

// Label

export interface LabelOptionsI extends PaintFontI, PaintBackroundAreaI {
    text?: string
    maxTextLength?: number
    gapBetweenLines?: number
}

const LabelOptionsDefault: LabelOptionsI = {
    ...PaintBackroundDefault,
    ...PaintFontDefault,
    ...PaintPosDefault,
    text: 'No text specified!',
    maxTextLength: 10,
    gapBetweenLines: 5
}

export type PaintToolTypesE = 'LABEL' | 'TABLE'

export function paintLabel(gc: CanvasRenderingContext2D, opt: LabelOptionsI) {
    const options: LabelOptionsI = {
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

    const size = V.add(vec(maxWidth, maxHeight), V.square(options.bPadding!*2))
    const pos = V.add(options.pos, V.mulVec(size, V.negate(options.origin)))

    paintBackroundArea(gc, options)

    gc.textBaseline = 'top'
    gc.textAlign = 'left'

    gc.fillStyle = options.fColor
    gc.font = options.fFamily! + ' ' + options.fSize! + 'px'

    for (let i = 0; i < lines.length; i++) {
        gc.fillText(
            lines[i], 
            pos.x + options.bPadding,
            pos.y + options.bPadding + i * (options.fSize + gapBetweenLines)
        )
    }
}