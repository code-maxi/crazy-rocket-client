import React from "react";
import { gameHelper } from "../helper-functions/game";
import { keyListen } from "../keybord";
import { MapConfig, rocketMapHelper } from "./map";
import { SocketUser } from "../network/socket-user";
import { V } from "../../common/math";
import { getImage } from "../images";

export class RocketCanvas extends React.Component<{}, {
    width: number,
    height: number
}, {}> {
    static instance: RocketCanvas
    
    private ref: HTMLCanvasElement | null = null
    private refF = (e: HTMLCanvasElement | null) => { this.ref = e }
    private start = true

    mapConfig: MapConfig = {
        width: 300,
        factor: 0.5,
        nameUnderRocket: true
    }

    constructor(props: any) {
        super(props)
        this.state = {
            width: 0,
            height: 0
        }
        RocketCanvas.instance = this
    }

    private draw(g: CanvasRenderingContext2D) {
        const canvasWidth = this.state.width
        const canvasHeight = this.state.height
        const canvasSize = V.vec(canvasWidth, canvasHeight)

        g.fillStyle = "black"
        g.fillRect(0.0, 0.0, canvasWidth, canvasHeight)

        const drawErrorImage = () => {
            const niSize = V.mul(canvasSize, 0.4)
            const niPos = V.sub(V.half(canvasSize), V.half(niSize))
            g.drawImage(
                getImage('noimage.png'), 
                niPos.x, niPos.y, 
                niSize.x, niSize.y
            )
        }

        if (SocketUser.instance) {
            const gameData = SocketUser.instance.getGameData()
            const userView = SocketUser.instance.getUserView()

            if (gameData && userView && gameData) {
                const gameObject = gameHelper(gameData)

                gameObject.paintWorld(g, userView.eye, userView.zoom, canvasSize)

                rocketMapHelper(this.mapConfig, {
                    gameData: gameData,
                    eye: userView.eye
                }).paint(g, V.vec(canvasWidth, canvasHeight))

            } else drawErrorImage()
        } else drawErrorImage()
    }

    private init() {
        keyListen()

        const setSizes = () => {
            console.log('resized')
            const p = $(document.body)

            this.setState({
                width: p.get(0).clientWidth,
                height: p.get(0).clientHeight
            })
        }

        setSizes()

        $(window).on('resize', setSizes)

        this.paint()
    }

    paint() {
        const context = this.ref!.getContext('2d')!
        this.draw(context)
    }

    componentDidMount() {
        if (this.start) this.init()
        this.start = false
    }

    render() {
        return <canvas ref={ this.refF } width={ this.state.width } height={ this.state.height }></canvas>
    }
}