import React from "react";
import { keyListen } from "../keybord";
import { MapConfig, rocketMapHelper } from "./map";
import { V, vec } from "../../common/math";
import { AnimationObjectI, GameObjectPaintDataI, PaintGameWorldI, PaintTransformI } from "../paint/paint_declarations"
import { paintObject, paintObjectsSorted } from "../paint/world/paint_helpers"
import { ClientMouseI, VectorI } from "../../common/declarations";
import { drawRoundRectangle, paintPoint } from "../paint/world/paint_addons";
import { screenToWorld, worldToScreen } from "../paint/world/paint_tools";
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

    private clientAnimations: AnimationObjectI[] = []
    private clientAnimationCounter = 0

    private transform: PaintTransformI = {
        eye: V.zero(),
        scaling: 1.0,
        unitToPixel: 50.0,
        canvasSize: V.zero(),
        wholeScaling: 0
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

    addAnimation(ani: AnimationObjectI) {
        this.clientAnimations.push(ani)
        ani.giveMeGameProps({
            killMe: () => {
                const index = this.clientAnimations.indexOf(ani, 0)
                this.clientAnimations.splice(index, 1)
            },
            id: 'animation_' + ani.getType() + '_' + this.clientAnimationCounter
        })
        this.clientAnimationCounter ++
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
                    if (this.mouse) {
                        const newEye = V.add(V.mul(V.sub( 
                            this.lastMousePosition,
                            vec(evt.clientX, evt.clientY)
                        ), 1/(this.transform.scaling * this.transform.unitToPixel)), this.lastEye)
        
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
        }

        this.canvasRef!.onmouseleave = (evt: MouseEvent) => {
            this.mouse = null
        }

        this.canvasRef!.onmouseenter = (evt: MouseEvent) => {
            this.mouse = {
                pos: screenToWorld(vec(evt.screenX, evt.screenY), this.transform),
                bPressed: null
            }
        }

        this.canvasRef!.onwheel = (evt: WheelEvent) => {
            this.transform = {
                ...this.transform,
                scaling: (this.transform.scaling - (evt.deltaY/1000))
            }
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
        this.startPaintLoop()
    }

    stopPaintLoop() { this.inPaintLoop = false }
    startPaintLoop() { this.inPaintLoop = true; this.paint() }

    paint() {
        const canvas = this.canvasRef

        if (this.worldData && canvas) {
            const gc = canvas.getContext('2d')!
            const canvasSize = V.vec(this.state.width, this.state.height)

            const currentWorld = {...this.worldData}

            gc.clearRect(0,0, canvasSize.x, canvasSize.y)

            this.transform = {
                ...this.transform,
                canvasSize: canvasSize,
                wholeScaling: this.transform.scaling * this.transform.unitToPixel
            }

            this.clientAnimations.forEach(ani => ani.calc(currentWorld.factor))

            const objects: GameObjectPaintDataI[] = [
                {
                    type: 'BACKGRUOND',
                    id: 'background',
                    pos: V.zero(),
                    srPos: null,
                    srSize: null,
                    props: {
                        width: currentWorld.width,
                        height: currentWorld.height
                    }
                },
                ...this.clientAnimations.map(ani => ani.data()),
                ...currentWorld.objects
            ]

            paintObjectsSorted(objects, gc, this.transform)
        }

        if (this.inPaintLoop) setTimeout(() => requestAnimationFrame(() => this.paint()), 2)
    }

    componentDidMount() {
        this.init()
    }

    render() {
        const w = this.state.width
        const h = this.state.height
        return <canvas
            ref={ this.refF } 
            width={ w } 
            height={ h }
            id='crazy-canvas'></canvas>
    }
}