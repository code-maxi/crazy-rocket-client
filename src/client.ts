// Here the Client-Connection

import { PrintOutlined } from "@material-ui/icons";
import { GalaxyObjectsI, GalaxyWithoutObjectsI, GalaxyI, SendFormatI, UserPropsI, UserI, RocketI } from "./common/declarations";
import { mainMap } from "./gui/components/map";
import { alertSnackbar } from "./gui/components/snackbars";
import { galaxyData, galaxyHelper, setGalaxiesData, setGalaxyData } from "./gui/helpers/galaxy";
import { loadImages } from "./gui/images";

export let props: UserPropsI = {
    id: 0,
    name: 'User ' + Math.random(),
    galaxy: 'Galaxy 1'
}

export let currentUser: UserI | undefined = undefined
export let currentRocket: RocketI | undefined = undefined

export function myUser() {
    const result = galaxyData.users.find(u => u.props.id === props.id)
    return result ? result : null
}

export let client: ClientConnection

function initConnection(s: string) {
    client = new ClientConnection(s)
}

export function init() {
    loadImages([
        'asteroid.png',
        'background1.jpg',
        'background2.jpg',
        'background3.jpg',
        'fire.png',
        'rocket.png'
    ])

    initConnection('ws://localhost:1234')
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
                    if (galaxyData) {
                        galaxyData.objects = galaxyHelper(galaxyData).migrateData(data)
                        if (data.eye) galaxyData.users = galaxyData.users.map(
                            u => u.props.id === props.id ? { ...u, view: {
                                ...u.view,
                                eye: data.eye
                            } } as UserI : u
                        )
                    }
                }
                if (parse.value.title === 'galaxy') {
                    const data = parse.value.content as GalaxyI
                    setGalaxyData(data)

                    printOut()
                    console.log('fps: ' + data.fps)
                }
                

                currentUser = galaxyData.users.find(u => u.props.id === props.id)

                currentRocket = currentUser ? galaxyData.objects.rockets.find(
                    r => r.id === currentUser!.props.id) : undefined

                if (currentUser && currentRocket) mainMap.setState({
                    state: {
                        galaxy: galaxyData,
                        eye: currentRocket.geo.pos,
                        colorMarkedRockets: [
                            [ currentUser.props.id, 'yellow', 'white' ]
                        ]
                    }
                })
            }

            if (parse.header === 'galaxies data') {
                const data = parse.value as GalaxyWithoutObjectsI[]
                setGalaxiesData(data)
            }
        }
    ]

    constructor(server: string) {
        this.server = server
        this.connection = new WebSocket(this.server, 'crazyrocket')
        this.initSocket(this.connection, false)
    }

    initSocket(s: WebSocket, reconnecting: boolean) {
        s.onopen = () => {
            if (reconnecting) this.connection.close()
            this.connection = s
            console.log('WebSocket opened...')

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