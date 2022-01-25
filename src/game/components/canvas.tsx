import React from "react";
import { currentUser } from "../client";
import { gameData, gameHelper } from "../object-functions/galaxy";
import { keyListen } from "../keybord";

export let canvas: RocketCanvas

export class RocketCanvas extends React.Component<{}, {
    width: number,
    height: number
}, {}> {
    ref: HTMLCanvasElement | null = null
    refF = (e: HTMLCanvasElement | null) => { this.ref = e }
    start = true

    constructor(props: any) {
        super(props)
        canvas = this
        this.state = {
            width: 0,
            height: 0
        }
    }

    private draw(g: CanvasRenderingContext2D) {
        if (currentUser && currentUser.view) {
            g.save()

            g.fillStyle = "black"
            g.fillRect(0.0, 0.0, this.state.width, this.state.height)

            gameHelper(gameData).paintBackground(g)
            
            g.translate(-currentUser!.view!.eye.x + this.state.width/2.0, -currentUser!.view!.eye.y + this.state.height/2.0)
            g.scale(currentUser!.view!.zoom, currentUser!.view!.zoom)

            gameHelper(gameData).paintBorders(g)

            /*console.log()
            console.log(currentUser!.view!.zoom + ' | ' + currentUser!.view!.eye.x + ' | ' + currentUser!.view!.eye.y)
            console.log()*/

            gameHelper(gameData).paintObjects(g)

            g.restore()
        }
        else console.log('Can\'t access user data or user data\' view!')
    }

    private init() {
        keyListen()

        const context = this.ref!.getContext('2d')!

        const render = () => {
            this.draw(context)
            requestAnimationFrame(render)
        }

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
        render()
    }

    componentDidMount() {
        if (this.start) this.init()
        this.start = false
    }

    render() {
        return <canvas ref={ this.refF } width={ this.state.width } height={ this.state.height }></canvas>
    }
}