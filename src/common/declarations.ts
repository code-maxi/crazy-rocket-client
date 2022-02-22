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

export type GalaxyStateT = 'frozen' | 'queue' |  'running'

export interface GalaxySettingsI {
    name: string,
    level: number
}

export interface GalaxyConfigI {
    asteroidSpeed: number,
    asteroidAmount: number
}

export interface GalaxyPropsI {
    name: string,
    state: GalaxyStateT
}

export interface GalaxyI { // data sent to login client
    users: UserPropsI[]
    params: GalaxySettingsI
    state: GalaxyStateT
}

export interface Galaxy2I { // data sent to login client
    props: GalaxyPropsI,
    config: GalaxyConfigI,
    teams: TeamI[],
    users: UserPropsI[]
}

export interface CreateGalaxySettingsI extends GalaxySettingsI {
    reason?: string    
}

// teams

export type TeamColorT = 'red' | 'green' | 'blue' | 'yellow'

export interface TeamPropsI {
    galaxyName: string,
    name: string,
    color: TeamColorT,
    maxUserSize: number
}

export interface TeamI {
    props: TeamPropsI,
    userIds: string[]
}

// user view

export interface UserViewI {
    eye: VectorI
    zoom: number
}

export interface UserPropsI extends IDable {
    name: string
    galaxy: string | null,
    teamName?: string
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
    objects: TypeObjectI[] // has type member,
}

export interface GameDataForSendingI extends ClientGameDataI {
    messages: SendFormatI[],
    fullData: Boolean,
    userView: UserViewI | null,
    yourUserProps: UserPropsI
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
    type: String
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
    style: RocketStyleI,
    view: UserViewI // !
}

export interface RocketStyleI {
    img: string,
    fires: RocketFireI[]
}

export interface RocketFireI extends GeoObjectI {
    on: boolean,
    geo: GeoI,
    img: string
}

export interface ResponseResult {
    successfully: Boolean
    data: any | null
    message: string | null
    errorType: string | null
}

export interface GameStartI {
    listeningKeys: string[]
}

export interface ClientMouseI {
    pos: VectorI,
    pressed: Boolean
}

export interface ClientRequestI {
    userProps: UserPropsI,
    keyboard: ClientKeyboardI | null,
    mouse: ClientMouseI | null,
    messages: SendFormatI[] | null
}

export type RocketTeamColorT = "blue" | "red" | "green" | "yellow"

export interface RocketTeamI {
    galaxy: string,
    users: UserPropsI,
    name: string,
    color: RocketTeamColorT
}