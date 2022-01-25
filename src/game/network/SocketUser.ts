import { assert } from "console"
import { ClientKeyboardI, GameDataForSendingI, JoinGalaxyI, SendFormatI, UserPropsI, UserViewI } from "../../common/declarations"
import { V } from "../../common/math"
import { canvas } from "../components/canvas"
import { keyListeners, keys } from "../keybord"
import { setGameData } from "../object-functions/game"

export let socketUser: SocketUser

export class SocketUser {
    serverUrl: string
    private connection: WebSocket
    userView?: UserViewI

    props: UserPropsI = {
        id: '0',
        name: 'UNNAMED',
        galaxy: undefined
    }

    constructor(url: string) {
        console.log('WebSocket init...')

        this.serverUrl = url
        this.connection = new WebSocket(this.serverUrl)

        console.log('WebSocket init 2...')

        this.initSocket(this.connection, false)

        keyListeners.push(() => {
            let ka: [string, boolean][] = []
            keys.forEach((v, k) => ka.push([k, v]))
            const keyboard: ClientKeyboardI = {
                keys: ka.map(k => ({ key: k[0], active: k[1] }))
            }
            socketUser.send('keyboard-data', keyboard) // DONE: Server react on keyboard data!
        })

        socketUser = this

        console.log('WebSocket init 3...')
    }

    initSocket(s: WebSocket, reconnecting: boolean) {
        s.onopen = () => {
            console.log('WebSocket opened...')

            if (reconnecting) this.connection.close()
            this.connection = s

            this.joinGalaxy('galaxy1')
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

    joinGalaxy(galaxy: string) {
        const join: JoinGalaxyI = {
            userName: 'guru',
            screenSize: V.vec(window.innerWidth, window.innerHeight),
            galaxyName: galaxy
        }
        this.send('join-galaxy', join)
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

            this.userView = data.userView

            const myProps = data.galaxy.users.find(u => u.id == this.props.id)!
            assert(myProps !== null)
            this.props = myProps

            setGameData(data)
            printOut()

            canvas.paint()

            data.messages.forEach(e => this.onMessage(e))
        }
    }

    log(s: any) {
        console.log('Client [' + this.props.name + ']: ' + s)
    }

    reconnect(s: string) { this.initSocket(new WebSocket(s), true) }

    send(h: string, v: any, quiet?: boolean) {
        if (quiet !== true || true) {
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