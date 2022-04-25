import React from "react";
import { keyListen } from "../keybord";
import { MapConfig, rocketMapHelper } from "./map";
import { V } from "../../common/math";
import { PaintGameWorld, PaintTransformI } from "../paint/paint_declarations"
import { paintObject } from "../paint/paint_helpers"
import { VectorI } from "../../common/declarations";
import { paintPoint } from "../paint/paint_addons";

export class RocketCanvas extends React.Component<{
    
}, {
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

    paint(world?: PaintGameWorld) {
        const gc = this.ref!.getContext('2d')!
        
        const canvasWidth = this.state.width
        const canvasHeight = this.state.height
        const canvasSize = V.vec(canvasWidth, canvasHeight)

        if (world) {
            const trans: PaintTransformI = {
                eye: world.eye,
                scaling: world.scaling,
                canvasSize: canvasSize,
                screenToWorld: (pos: VectorI) => V.mul(V.sub(pos, world.eye), world.scaling),
                worldToScreen: (pos: VectorI) => V.add(V.mul(V.sub(pos, V.half(canvasSize)), 1/world.scaling), world.eye)
            }
    
            gc.save()
            gc.translate(canvasSize.x / 2, canvasSize.y / 2)

            const sortedObjects = world.objects.sort(o => o.zIndex ? o.zIndex : 0)

            paintPoint(gc, trans.worldToScreen(V.zero()), 'red', 5)

            sortedObjects.forEach(o => paintObject(o, gc, trans))

            gc.restore()
        }

        /*g.fillStyle = "black"
        g.fillRect(0.0, 0.0, canvasWidth, canvasHeight)

        const drawErrorImage = () => {
            const niSize = V.mul(canvasSize, 0.4)
            const niPos = V.sub(V.half(canvasSize), V.half(niSize))
            g.drawImage(
                getImage('noimage.png'), 
                niPos.x, niPos.y, 
                niSize.x, niSize.y
            )
        }*/

        
    }

    componentDidMount() {
        if (this.start) this.init()
        this.start = false
    }

    render() {
        return <canvas ref={ this.refF } width={ this.state.width } height={ this.state.height }></canvas>
    }
}