import { VectorI } from "../../common/declarations"

export interface PaintTransformI {
    eye: VectorI
    scaling: number
    canvasSize: VectorI
    unitToPixel: number
}

export interface AsteroidPropsI {
    radius: number,
    stability: number,
    rotation: number
}

export interface GamePaintDataI {
    paintType: string
    pos: VectorI
    props: any
    zIndex: number
}

export interface PaintGameWorldI {
    objects: GamePaintDataI[], 
    eye: VectorI,
    scaling: number
}