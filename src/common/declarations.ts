export interface IDable { id: string }
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
    name: string,
    level: number
}

export interface CreateGalaxySettingsI extends GalaxySettingsI {
    reason?: string    
}

export interface GalaxyI { // data sent to login client
    users: UserPropsI[]
    params: GalaxySettingsI,
    state: string
}

export interface UserViewI {
    eye: VectorI
    zoom: number
}

export interface UserPropsI extends IDable {
    name: string
    galaxy: string | null
}

export interface JoinGalaxyI {
    userName: string,
    screenSize: VectorI,
    galaxyName: string
}

export interface GalaxyAdminI {
    password: string,
    value: any
}

export interface GameSettingsI {
    level: number,
    width: number,
    height: number
}

export interface ClientGameDataI {
    galaxy: GalaxyI,
    settings: GameSettingsI,
    objects: TypeObjectI[] // has type member
}

export interface GameDataForSendingI extends ClientGameDataI {
    messages: SendFormatI[],
    fullData: Boolean,
    userView: UserViewI | null
}


export interface ClientKeyboardI {
    keys: ClientKeyI[]
}

export interface ClientKeyI {
    key: string,
    active: boolean
}

// Math


export interface VectorI {
    x: number,
    y: number
}

export interface GeoI {
    pos: VectorI
    ang: number
    width: number
    height: number
}

// Objects

export interface TypeObjectI extends IDable {
    type: String,
}

export interface GeoObjectI extends TypeObjectI {
    geo: GeoI
}

export interface DrawableObjectI extends GeoObjectI { img: string }
//export interface MovingObjectI extends DrawableObjectI { movingVector: VectorI }

export interface AsteroidI extends GeoObjectI {
    live: number,
    size: number
}

export interface RocketI extends GeoObjectI {
    userProps: UserPropsI,
    fires: RocketFireI[], // !
    view: UserViewI // !
}

export interface RocketFireI extends GeoObjectI {
    on: boolean,
    geo: GeoI,
    img: string
}