import { VectorI } from "../../common/declarations"

export interface PaintTransformI {
    eye: VectorI
    scaling: number
    canvasSize: VectorI
    worldToScreen: (p: VectorI) => VectorI
    screenToWorld: (p: VectorI) => VectorI
}

export type PaintTypeE = 'IMAGE' | 'PROCESS' | 'LINE' | 'LABEL'

export interface ImagePropsD {
    src: string
    size: VectorI
}

export interface LinePropsD {
    d: VectorI
    color: string
    lineWidth: number
    dash: number[]
    color2?: string
}

export type TooltipTypeE = 'TABLE' | 'LABEL'

export interface PaintToolTipD {
    type: string
    props: any
    config: TooltipConfigD
    relPosToCenter: VectorI
}

export interface TooltipConfigD {
    bColor: string
    bPadding: number
    bRadius: number
    fColor: string
    fFamily: string
    fSize: number
}

export interface LabelPropsD {
    bColor: string
    bPadding: number
    bRadius: number
    fColor: string
    fFamily: string
    fSize: number
    text: string
    breakWordLength?: number
}

export interface ProcessPropsD {
    value: number
    size: VectorI
    roundedCorners: number
    fColor1: string
    bColor: string
    borderColor?: string
    fColor2?: string
}

export interface GamePaintDataI {
    paintType: string
    pos: VectorI
    props?: any
    center?: VectorI
    zIndex?: number
    scale?: number
    rotate?: number
    ignoreScaling?: boolean
    paintBehindParent?: boolean
    relativeChildren?: GamePaintDataI[]
}

export interface PaintGameWorld {
    objects: GamePaintDataI[], 
    eye: VectorI,
    scaling: number
}