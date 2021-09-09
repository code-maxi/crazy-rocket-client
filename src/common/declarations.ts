import { rocketTypes } from "./rocketTypes";

export interface IDable { id: number }
export interface DatableI<T> {
    data(): T
}
export interface DataCalcI<T> extends DatableI<T> {
    calc(s: number): void
}

export interface SendFormatI {
    header: string
    value?: any
}

// Galaxy and User

export interface GalaxySettingsI {
    name: string
    password: string
    passwordJoin?: boolean
    level: number
}

export interface CreateGalaxySettingsI extends GalaxySettingsI {
    reason?: string    
}

export interface GalaxyObjectsI {
    asteroids: AsteroidI[]
    rockets: RocketI[]
}

export interface GalaxyTouchingObjectsI {
    asteroids: AsteroidI[]
}

export interface GalaxyWithoutObjectsI { // data sent to login client
    users: UserI[]
    galaxyParams: GalaxySettingsI
    width: number
    height: number
    fps: number | null
}

export interface GalaxyI extends GalaxyWithoutObjectsI {
    objects: GalaxyObjectsI
}

export interface UserViewI {
    eye: VectorI
    zoom: number
}

export interface UserPropsI extends IDable {
    name: string
    galaxy: string | null
}

export interface UserI {
    props: UserPropsI
    view: UserViewI | null
    keyboard: [string, boolean][]
}

// Math


export interface VectorI {
    x: number,
    y: number
}

export interface GeoI {
    pos: VectorI
    angle: number
    width: number
    height: number
}

export interface GeoImplI {
    geo: GeoI
}

// Objects


export interface DrawableObjectI extends GeoImplI, IDable { img: string }
export interface MovingObjectI extends DrawableObjectI { movingVector: VectorI }

export interface AsteroidI extends MovingObjectI {
    live: number,
    size: number
}

export interface RocketI extends MovingObjectI {
    rocketTypeId: rocketTypes
}

export interface RocketTypeI {
    id: rocketTypes
    fires: RocketFireSettingsI[]
    acceleratingSpeed: number
    turningSpeed: number
    standardZoom: number
    img: string
    width: number
    height: number
}

export interface RocketFireI extends GeoImplI {
    on: boolean
    settings: RocketFireSettingsI
}

export interface RocketFireSettingsI {
    dx: number
    dy: number
    fireSpeed: number

    startWidth: number
    plusWidth: number

    startHeight: number
    plusHeight: number

    img: string
}