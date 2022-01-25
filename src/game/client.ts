// Here the Client-Connection

import { GalaxyI, GalaxyI, SendFormatI, UserPropsI, UserI, RocketI } from "../common/declarations";
import { mainMap } from "./components/map";
import { alertSnackbar } from "./components/snackbars";
import { gameData, gameHelper, setGalaxiesData, setGameData } from "./object-functions/galaxy";

export let props: UserPropsI = {
    id: 0,
    name: 'User ' + Math.random(),
    galaxy: 'Galaxy 1'
}

export let currentUser: UserI | undefined = undefined
export let currentRocket: RocketI | undefined = undefined

export function myUser() {
    const result = gameData.users.find(u => u.props.id === props.id)
    return result ? result : null
}

export let client: ClientConnection

function initConnection(s: string) {
    client = new ClientConnection(s)
}

export function init() {
    /*loadImages([
        'asteroid.png',
        'background1.jpg',
        'background2.jpg',
        'background3.jpg',
        'fire.png',
        'rocket.png'
    ])*/

    initConnection('ws://localhost:1237')
}

export function playing() { return props.id !== 0 }

class ClientConnection {
    server: string
    private connection: WebSocket

    onmessage: ((m: SendFormatI, printOut: () => void) => void)[] = [
        (parse, printOut) => {    
            if (parse.header === 'galaxy successfully created') {
                if (parse.value === 'joining it'){
                    this.send('join galaxy', {
                        user: props,
                        screenWidth: document.body.clientWidth,
                        screenHeight: document.body.clientHeight
                    })
                }
            }

            if (parse.header === 'succesfully joined') { // one's joined a game
                props.id = parse.value.id
            }
            if (parse.header === 'joining failed') {
                alertSnackbar().alert('error', 'Joining Failed')
            }
            if (parse.header === 'creating galaxy failed') {
                alertSnackbar().alert('error', 'Creating Failed')
                this.send('join galaxy', {
                    user: props,
                    screenWidth: document.body.clientWidth,
                    screenHeight: document.body.clientHeight
                })
            }

            if (parse.header === 'game data') { // DONE: Server send data!
                if (parse.value.title === 'only important') {
                    const data = parse.value.content
                    if (gameData) {
                        gameData.objects = gameHelper(gameData).migrateData(data)
                        if (data.eye) gameData.users = gameData.users.map(
                            u => u.props.id === props.id ? { ...u, view: {
                                ...u.view,
                                eye: data.eye
                            } } as UserI : u
                        )
                    }
                }
                if (parse.value.title === 'galaxy') {
                    const data = parse.value.content as GalaxyI
                    setGameData(data)

                    printOut()
                    console.log('fps: ' + data.fps)
                }
                

                currentUser = gameData.users.find(u => u.props.id === props.id)

                currentRocket = currentUser ? gameData.objects.rockets.find(
                    r => r.id === currentUser!.props.id) : undefined

                if (currentUser && currentRocket) mainMap.setState({
                    state: {
                        galaxy: gameData,
                        eye: currentRocket.geo.pos,
                        colorMarkedRockets: [
                            [ currentUser.props.id, 'yellow', 'white' ]
                        ]
                    }
                })
            }

            if (parse.header === 'galaxies data') {
                const data = parse.value as GalaxyI[]
                setGalaxiesData(data)
            }
        }
    ]

    constructor(server: string) {
        console.log('WebSocket init...')
        this.server = server
        this.connection = new WebSocket(this.server)
        console.log('WebSocket init 2...')
        this.initSocket(this.connection, false)
        console.log('WebSocket init 3...')
    }

    initSocket(s: WebSocket, reconnecting: boolean) {
        s.onopen = () => {
            console.log('WebSocket opened...')

            if (reconnecting) this.connection.close()
            this.connection = s

            this.send('create new galaxy', {
                galaxy: {
                    name: props.galaxy,
                    password: 'abcdefg'
                },
                reason: 'joining it'
            })
        }
        s.onerror = (e) => {
            console.error('Websocket Error: ' + e)
        }
        s.onmessage = (m) => {
            console.log("recieving unknown data: " + m)
            const parse = JSON.parse(m.data)

            this.onmessage.forEach(f => {
                if (parse !== undefined && parse !== null) f(parse, () => {
                    this.log('recieving following data...')
                    console.log(parse)
                    console.log()
                })
            }) 
        }
    }

    log(s: any) {
        console.log('Client [' + props.name + ']: ' + s)
    }

    reconnect(s: string) { this.initSocket(new WebSocket(s), true) }

    send(h: string, v: any, quiet?: boolean) {
        if (quiet !== true) {
            this.log('sends following data...')
            console.log({
                header: h,
                value: v
            })
            console.log()
        }

        if (this.connection.send) this.connection.send(JSON.stringify({
            header: h,
            value: v
        }))
    }
}