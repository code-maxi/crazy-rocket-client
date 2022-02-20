import React from "react";
import { gameData, gameHelper } from "../object-functions/game";
import { keyListen } from "../keybord";
import { MapConfig, rocketMapHelper } from "./map";
import { socketUser } from "../network/SocketUser";
import { V } from "../../common/math";
import { getImage } from "../images";

export let canvas: RocketCanvas

export class RocketCanvas extends React.Component<{}, {
    width: number,
    height: number
}, {}> {
    ref: HTMLCanvasElement | null = null
    refF = (e: HTMLCanvasElement | null) => { this.ref = e }
    start = true

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
        canvas = this
    }

    private draw(g: CanvasRenderingContext2D) {
        const canvasWidth = this.state.width
        const canvasHeight = this.state.height
        const canvasSize = V.vec(canvasWidth, canvasHeight)

        g.fillStyle = "black"
        g.fillRect(0.0, 0.0, canvasWidth, canvasHeight)

        if (gameData && socketUser && socketUser.userView) {
            const gameObject = gameHelper(gameData)

            g.save()

            const eye = socketUser.userView.eye

            gameObject.paintBackground(g, eye)
            
            g.translate(-eye.x + canvasWidth/2.0, -eye.y + canvasHeight/2.0)
            g.scale(socketUser.userView.zoom, socketUser.userView.zoom)

            gameObject.paintBorders(g)

            /*console.log()
            console.log(currentUser!.view!.zoom + ' | ' + currentUser!.view!.eye.x + ' | ' + currentUser!.view!.eye.y)
            console.log()*/

            gameObject.paintObjects(g)

            g.restore()

            rocketMapHelper(this.mapConfig, {
                gameData: gameData,
                eye: eye
            }).paint(g, V.vec(canvasWidth, canvasHeight))
        }
        else {
            const niSize = V.mul(canvasSize, 0.4)
            const niPos = V.sub(V.half(canvasSize), V.half(niSize))
            g.drawImage(
                getImage('noimage.png'), 
                niPos.x, niPos.y, 
                niSize.x, niSize.y
            )
        }
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