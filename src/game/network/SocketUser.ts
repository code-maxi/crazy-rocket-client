import { ClientRequestI, ClientKeyboardI, ClientMouseI, GalaxyAdminI, GameDataForSendingI, GameStartI, JoinGalaxyI, SendFormatI, UserPropsI, UserViewI, GalaxyI, Galaxy2I, GalaxyPrevI, ClientGameDataI } from "../../common/declarations"
import { V } from "../../common/math"
import { RocketCanvas } from "../components/canvas"
import { GalaxyLogin } from "../components/galaxy-login"
import { keyListeners, keys, keysArray } from "../keybord"
import { gameHelper } from "../object-functions/game"

export let socketUser: SocketUser
export function getConnection() { return socketUser }

export class SocketUser {
    static instance: SocketUser

    private serverUrl: string
    private connection?: WebSocket
    private connected = false

    private prevGalaxy?: Galaxy2I
    private prevGalaxyName?: string

    private keyBoard: ClientKeyboardI | null = null
    private mouse: ClientMouseI | null = null
    
    private userView: UserViewI | null = null
    private gameData: ClientGameDataI | null = null

    props: UserPropsI = {
        id: '0',
        name: 'UNNAMED',
        galaxy: null
    }

    getUserView() { return this.userView }
    getGameData() { return this.gameData }

    constructor(url: string, prevGalaxyName: string)  {
        this.prevGalaxyName = prevGalaxyName

        keyListeners.push(() => {
            this.keyBoard = { keys: keysArray() }
        })

        this.serverUrl = url
        this.connect(url)

        socketUser = this
        SocketUser.instance = this

        console.log('UserSocket created.')
    }

    private connect(url: string) {
        this.connected = false
        this.serverUrl = url
        this.connection = new WebSocket(this.serverUrl)
        this.initSocket(this.connection!, false)
    }

    private initSocket(s: WebSocket, reconnecting: boolean) {
        s.onopen = () => {
            this.connected = true

            if (reconnecting) this.connection!.close()
            this.connection = s
            
            if (this.prevGalaxyName) this.setPreviewGalaxy(this.prevGalaxyName)
        }
        s.onerror = (e) => {
            console.error('Websocket Error: ' + e.target)
        }
        s.onmessage = (m) => {
            const parse = JSON.parse(m.data)

            if (parse !== undefined && parse !== null) {
                this.onMessage(parse)
            }
        }
    }

    private onMessage(parse: SendFormatI, fromGameData?: boolean) {
        const printOut = () => {
            console.log('Client [' + this.props.name + ']: recieves data "' + parse.header + '"')
            console.log(parse.value)
            console.log()
        }

        if (parse.header === 'join-galaxy-result') { // one's joined a game
            GalaxyLogin.instance.setErrorResult(parse.value)
            /*if (parse.value.successfully) {
                const password:  GalaxyAdminI = { password: 'jonasp', value: null }
                this.send('start-game', password)
            }
            else {
                alert(parse.value.errorType + ': ' + parse.value.message)
            }*/
        }
        if (parse.header === 'start-game-result') {
            GalaxyLogin.instance.setErrorResult(parse.value)
            /*if (parse.value.successfully) {
                //alert('successfully game started!')
                const gs = parse.value.data as GameStartI
                gs.listeningKeys.forEach(l => keys.set(l, false))
                this.log(gs.listeningKeys)

                setTimeout(() => {
                    this.requestData()
                }, 10)
            }
            else {
                alert(parse.value.errorType + ': ' + parse.value.message)
            }*/
        }

        if (parse.header === 'prev-galaxy-data') {
            const data = parse.value as GalaxyPrevI
            
            this.prevGalaxy = data.galaxy
            this.prevGalaxyName = data.galaxy.props.name
            this.props = data.myUser

            GalaxyLogin.instance.setGalaxyPrev(data)
        }

        if (parse.header === 'game-data') this.recieveGameData(parse.value)
    }

    setPreviewGalaxy(galaxy: string) { this.send('prev-galaxy', { galaxyName: galaxy }) }

    joinGalaxy(teamName: string) {
        if (this.prevGalaxyName) {
            const join: JoinGalaxyI = {
                userName: 'jonas',
                screenSize: V.vec(window.innerWidth, window.innerHeight),
                galaxyName: this.prevGalaxyName,
                teamName: teamName
            }
            this.send('join-galaxy', join)
        }
    }

    joinGame() {
        this.send('join-game', undefined)
    }

    private setGameData(d: GameDataForSendingI) {
        const objects = this.gameData && !d.fullData ? gameHelper(this.gameData).migrateData(d.objects) : d.objects
        this.gameData = {
            settings: d.settings,
            objects: objects,
            galaxy: d.galaxy
        }
    }

    private requestGameData() {
        const request: ClientRequestI = {
            userProps: this.props,
            keyboard: this.keyBoard,
            mouse: null,
            messages: null
        }
        this.send('client-data-request', request)
        this.keyBoard = null
    }

    private recieveGameData(d: any) {
        const data = d as GameDataForSendingI
            
        this.props = data.yourUserProps
        this.userView = data.userView
        this.setGameData(data)

        data.messages.forEach(e => this.onMessage(e, true))

        RocketCanvas.instance.paint()

        this.requestGameData()
    }

    log(s: any) {
        console.log('Client [' + this.props.name + ']: ' + s)
    }

    send(h: string, v: any, quiet?: boolean) {
        /*if (quiet !== true || true) {
            this.log('sends following data...')
            console.log({
                header: h,
                value: v
            })
            console.log()
        }*/

        if (this.connected && this.connection) this.connection!.send(JSON.stringify({
            header: h,
            value: v
        }))
        else alert('Error: Unable to send because there\'s no connection!')
    }
}