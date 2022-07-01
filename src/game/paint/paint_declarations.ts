import { VectorI } from "../../common/declarations"
import { BaseExtensionTypeE } from "../decl"

export interface PaintTransformI {
    eye: VectorI
    scaling: number
    wholeScaling: number
    canvasSize: VectorI
    unitToPixel: number
}

export interface PaintFunctionI {
    zIndex: number, 
    paintFunc: (data: GameObjectPaintDataI, gc: CanvasRenderingContext2D, trans: PaintTransformI) => void 
}

export interface CrazyBasePropsExtensionI {
    place: number, // in degrees: (0 - 360)
    type: BaseExtensionTypeE,
    stability: number // in %: (0 - 100)
}

export interface CrazyBasePropsI {
    name: string,
    enterZoneRadius: number,
    outerRingRadius: number | null,
    outerRingRotation: number | null,
    interceptionRadius: number | null,
    extensions: CrazyBasePropsExtensionI[],
    extensionWidth: number,
    tableValues: [string, string][],
    teamColor: string
}

// Planet

export interface CrazyPlanetCityI {
    tableValues: [string, string][],
    size: number,
    name: string,
    relPosToPlanet: VectorI // in (%,%)
}

export interface CrazyPlanetPropsI {
    radius: number,
    name: string,
    img: string,
    rotation: number
    tableValues: [string, string][],
    cities: CrazyPlanetCityI[],
}

//

export interface GameObjectPaintDataI {
    type: string
    pos: VectorI
    props: any
    id: string
    srPos: VectorI | null
    srSize: VectorI | null
}

export interface GameMapConfigI {
    viewExpanse: VectorI
}

export interface PaintCrazyWorldI {
    objects: GameObjectPaintDataI[], 
    mapConfig: GameMapConfigI,
    unitToPixel: number,
    eye: VectorI,
    scaling: number,
    width: number,
    height: number,
    factor: number
}

export interface AnimationGamePropsI {
    id: string,
    killMe: () => void
}

export interface AnimationObjectI {
    data: () => GameObjectPaintDataI
    calc: (factor: number) => void
    giveMeGameProps: (gameProps: AnimationGamePropsI) => void
    getType(): string
}