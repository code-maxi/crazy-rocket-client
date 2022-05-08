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

// Planet

export interface PlanetCityI {
    tableValues: [string, string][],
    size: number,
    name: string,
    relPosToPlanet: VectorI // in (%,%)
}

export interface PlanetConfigI {
    temperature: number, // in degrees
    atmosphere: boolean,
    gravitation: number, // in G
}

export interface PlanetPropsI {
    radius: number,
    name: string,
    img: string,
    rotation: number
    tableValues: [string, string][],
    cities: PlanetCityI[],
}

//



export interface GameObjectPaintDataI {
    type: string
    pos: VectorI
    props: any,
    srPos: VectorI | null,
    srSize: VectorI | null
}

export interface PaintGameWorldI {
    objects: GameObjectPaintDataI[], 
    eye: VectorI,
    scaling: number,
    width: number,
    height: number,
    factor: number
}

export interface AnimationObjectI {
    data: () => GameObjectPaintDataI
    calc: (factor: number) => void
    giveMeTheKnife: (knife: () => void) => void
    getType(): string
}