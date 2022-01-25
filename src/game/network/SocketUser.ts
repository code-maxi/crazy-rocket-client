import { GalaxyI, GameDataForSendingI, SendFormatI, UserPropsI } from "../../common/declarations"
import { setGameData } from "../object-functions/galaxy"

export class SocketUser {
    server: string
    private connection: WebSocket

    props: UserPropsI = {
        id: 0,
        name: 'UNNAMED',
        galaxy: undefined
    }

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

            if (parse !== undefined && parse !== null) {
                this.onMessage(parse)
            }
        }
    }

    onMessage(parse: SendFormatI) {
        const printOut = () => {
            this.log('recieving following data...')
            console.log(parse)
            console.log()
        }

        if (parse.header === 'join-galaxy-result') { // one's joined a game
            // Response Result
            if (parse.value.successfully) {

            }
            else {
                // printing error
                console.log(parse.value.errorType + ': ' + parse.value.message)
            }
        }
        if (parse.header === 'start-game-result') {
            if (parse.value.successfully) {

            }
            else {
                // printing error
                console.log(parse.value.errorType + ': ' + parse.value.message)
            }
        }

        if (parse.header === 'game-data') { // DONE: Server send data!
            const data = parse.value as GameDataForSendingI

            setGameData(data)
            printOut()

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

            data.messages.forEach(e => this.onMessage(e))
        }

        if (parse.header === 'galaxies data') {
            const data = parse.value as GalaxyWithoutObjectsI[]
            setGalaxiesData(data)
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