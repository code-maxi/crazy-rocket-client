import React from "react";
import { keyListen } from "../keybord";
import { MapConfig, rocketMapHelper } from "./map";
import { V, vec } from "../../common/math";
import { PaintGameWorldI, PaintTransformI } from "../paint/paint_declarations"
import { paintObject } from "../paint/paint_helpers"
import { ClientMouseI, VectorI } from "../../common/declarations";
import { paintPoint } from "../paint/paint_addons";
import { screenToWorld, worldToScreen } from "../paint/paint_tools";
import { getImage } from "../paint/images";
import { debugWorld } from "../..";

export class RocketCanvas extends React.Component<{}, {
    width: number,
    height: number
}, {}> {
    static instance: RocketCanvas
    
    private canvasRef: HTMLCanvasElement | null = null
    private refF = (e: HTMLCanvasElement | null) => { this.canvasRef = e }
    private inPaintLoop = false
    
    private worldData?: PaintGameWorldI

    private transform: PaintTransformI = {
        eye: V.zero(),
        scaling: 1.0,
        unitToPixel: 50.0,
        canvasSize: V.zero()
    }

    private lastEye: VectorI = vec(0,0)
    private lastMousePosition: VectorI = vec(0,0)
    private mouse: ClientMouseI | null = null

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
        console.log("CANVAS INITIALIZED")
    }

    private init() {
        keyListen()

        this.canvasRef!.onmousemove = (evt: MouseEvent) => {
            if (this.mouse) {
                this.mouse = {
                    ...this.mouse,
                    pos: screenToWorld(vec(evt.clientX, evt.clientY), this.transform)
                }
    
                if (this.mouse.bPressed === 0) {
                    console.log('B1 pressed and moved.')
    
                    if (this.mouse) {
                        const newEye = V.add(V.mul(V.sub( 
                            this.lastMousePosition,
                            vec(evt.clientX, evt.clientY)
                        ), 1/(this.transform.scaling * this.transform.unitToPixel)), this.lastEye)

                        console.log('Eye changed...')
                        console.log()
        
                        this.transform = {
                            ...this.transform,
                            eye: newEye
                        }
                    }
                }
            }
        }

        this.canvasRef!.onmousedown = (evt: MouseEvent) => {
            if (this.mouse) {
                this.mouse = {
                    ...this.mouse,
                    bPressed: evt.button
                }
            }

            console.log('Mouse clicked...')
            console.log(this.mouse)
            console.log()

            if (this.mouse) {
                this.lastMousePosition = {...vec(evt.clientX, evt.clientY)}
                this.lastEye = {...this.transform.eye}
            }
        }

        this.canvasRef!.onmouseup = (evt: MouseEvent) => {
            if (this.mouse) {
                this.mouse = {
                    ...this.mouse,
                    bPressed: null
                }
            }

            console.log('Mouse released...')
            console.log(this.mouse)
            console.log()
        }

        this.canvasRef!.onmouseleave = (evt: MouseEvent) => {
            this.mouse = null

            console.log('Mouse left screen...')
            console.log(this.mouse)
            console.log()
        }

        this.canvasRef!.onmouseenter = (evt: MouseEvent) => {
            this.mouse = {
                pos: screenToWorld(vec(evt.screenX, evt.screenY), this.transform),
                bPressed: null
            }

            console.log('Mouse left screen...')
            console.log(this.mouse)
            console.log()
        }

        this.canvasRef!.onwheel = (evt: WheelEvent) => {
            this.transform = {
                ...this.transform,
                scaling: (this.transform.scaling - (evt.deltaY/1000))
            }

            console.log('Mouse left screen...')
            console.log(this.transform, evt.y)
            console.log()
        }

        const setSizes = () => {
            const p = $(document.body).get(0)

            const width = p.clientWidth
            const height = p.clientHeight

            this.setState({
                width: width,
                height: height
            })
        }

        $(window).on('resize', setSizes)
        $('#root').addClass('no-overflow')

        setSizes()

        this.worldData = debugWorld
        //this.startPaintLoop()
    }

    stopPaintLoop() { this.inPaintLoop = false }
    startPaintLoop() { this.inPaintLoop = true; this.paint() }

    paint() {
        const canvas = this.canvasRef
        if (this.worldData && canvas) {
            const gc = canvas.getContext('2d')!
            const canvasSize = V.vec(this.state.width, this.state.height)

            const currentWorld = {...this.worldData}

            gc.fillStyle = 'black'
            gc.fillRect(0,0, canvasSize.x, canvasSize.y)

            this.transform = {
                ...this.transform,
                canvasSize: canvasSize
            }

            const sortedObjects = currentWorld.objects.sort(o => o.zIndex ? o.zIndex : 0)

            sortedObjects.forEach(o => paintObject(o, gc, this.transform))

            if (this.mouse) paintPoint(gc, worldToScreen(this.mouse.pos, this.transform), 'red', 5)
        }


        if (this.inPaintLoop) requestAnimationFrame(() => this.paint())

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
        this.init()
    }

    render() {
        console.log('render: ' + this.state.width + ' ' + this.state.height)
        const w = this.state.width
        const h = this.state.height
        return <canvas
            ref={ this.refF } 
            width={ w } 
            height={ h }
            id='crazy-canvas'></canvas>
    }
}