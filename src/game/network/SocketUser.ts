import { ClientKeyboardI, GalaxyAdminI, GameDataForSendingI, JoinGalaxyI, SendFormatI, UserPropsI, UserViewI } from "../../common/declarations"
import { V } from "../../common/math"
import { canvas } from "../components/canvas"
import { keyListeners, keys } from "../keybord"
import { setGameData } from "../object-functions/game"

export let socketUser: SocketUser

export class SocketUser {
    serverUrl: string
    private connection?: WebSocket
    userView?: UserViewI
    connected = false

    props: UserPropsI = {
        id: '0',
        name: 'UNNAMED',
        galaxy: undefined
    }

    constructor(url: string) {
        keyListeners.push(() => {
            let ka: [string, boolean][] = []
            keys.forEach((v, k) => ka.push([k, v]))
            const keyboard: ClientKeyboardI = {
                keys: ka.map(k => ({ key: k[0], active: k[1] }))
            }
            this.send('keyboard-data', keyboard) // DONE: Server react on keyboard data!
        })

        this.serverUrl = url
        this.connect(url)

        socketUser = this

        console.log('UserSocket created.')
    }


    private connect(url: string) {
        console.log('WebSocket initializing on url "' + url + '"...')

        this.connected = false

        this.serverUrl = url

        console.log('debug 1')
        this.connection = new WebSocket(this.serverUrl)
        console.log('debug 2')

        this.initSocket(this.connection!, false)
        console.log('debug 3')
    }

    private initSocket(s: WebSocket, reconnecting: boolean) {
        s.onopen = () => {
            console.log('WebSocket initialized and opened 0.')

            this.connected = true

            if (reconnecting) this.connection!.close()
            this.connection = s

            console.log('WebSocket initialized and opened 1.')

            this.joinGalaxy('galaxy1')
        }
        s.onerror = (e) => {
            console.error('Websocket Error: ' + e.target)
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
                alert('successfully joined!')

                const password:  GalaxyAdminI = { password: 'wrong!' }
                this.send('start-game', password)
            }
            else {
                // printing error
                alert(parse.value.errorType + ': ' + parse.value.message)
            }
        }
        if (parse.header === 'start-game-result') {
            if (parse.value.successfully) {
                alert('successfully game started!')
            }
            else {
                // printing error
                alert(parse.value.errorType + ': ' + parse.value.message)
            }
        }

        if (parse.header === 'game-data') { // DONE: Server send data!
            const data = parse.value as GameDataForSendingI

            this.userView = data.userView

            const myProps = data.galaxy.users.find(u => u.id == this.props.id)!
            if (myProps !== null) this.props = myProps

            setGameData(data)
            printOut()

            canvas.paint()

            data.messages.forEach(e => this.onMessage(e))
        }
    }

    log(s: any) {
        console.log('Client [' + this.props.name + ']: ' + s)
    }

    send(h: string, v: any, quiet?: boolean) {
        if (quiet !== true || true) {
            this.log('sends following data...')
            console.log({
                header: h,
                value: v
            })
            console.log()
        }

        if (this.connected && this.connection) this.connection!.send(JSON.stringify({
            header: h,
            value: v
        }))
        else alert('Error: Unable to send because there\'s no connection!')
    }
}