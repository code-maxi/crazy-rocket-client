import { VectorI } from "../../common/declarations"
import { BaseExtensionTypeE } from "../decl"

export interface PaintTransformI {
    eye: VectorI
    scaling: number
    wholeScaling: number
    canvasSize: VectorI
    unitToPixel: number
}

export interface AsteroidPropsI {
    radius: number,
    stability: number,
    rotation: number
}

export interface BasePropsExtensionI {
    place: number, // in degrees: (0 - 360)
    type: BaseExtensionTypeE,
    stability: number // in %: (0 - 100)
}

export interface BasePropsI {
    name: string,
    enterZoneRadius: number,
    outerRingRadius: number | null,
    outerRingRotation: number | null,
    interceptionRadius: number | null,
    extensions: BasePropsExtensionI[],
    extensionWidth: number,
    tableValues: [string, string][],
    teamColor: string
}

export interface GameObjectPaintDataI {
    type: string
    pos: VectorI
    props: any
}

export interface PaintGameWorldI {
    objects: GameObjectPaintDataI[], 
    eye: VectorI,
    scaling: number
}