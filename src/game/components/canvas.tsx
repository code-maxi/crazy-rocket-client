import React from "react";
import { keyListen } from "../keybord";
import { MapConfig } from "./map";
import { V, vec } from "../../common/math";
import { AnimationObjectI, GameObjectPaintDataI, PaintCrazyWorldI, PaintTransformI } from "../paint/paint_declarations"
import { paintObjectsSorted } from "../paint/paint_helpers"
import { ClientMouseI, VectorI } from "../../common/declarations";
import { screenToWorld } from "../paint/paint_tools";
import { debugWorld } from "../..";
import { CrazyMouseEventComponent } from "./mouse_event_component";

export class RocketCanvas extends React.Component<{
    zIndex: number,
    onMouseChange: (clientMouse: ClientMouseI) => void,
    onViewChange?: (eye?: VectorI, scaling?: number) => void
}, {
    width: number,
    height: number
}, {}> {
    static instance: RocketCanvas
    
    private canvasRef: HTMLCanvasElement | null = null
    private refF = (e: HTMLCanvasElement | null) => { this.canvasRef = e }
    private inPaintLoop = false

    private lastEye: VectorI = vec(0,0)
    private lastMousePosition: VectorI = vec(0,0)
    private mouse: ClientMouseI = {
        pos: null,
        clientPos: null,
        bPressed: null
    }
    
    private worldData?: PaintCrazyWorldI

    private viewTransform?: PaintTransformI

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

    onData(world: PaintCrazyWorldI) {
        this.worldData = world
    }

    paint() {
        const canvas = this.canvasRef

        if (this.worldData && canvas) {
            const gc = canvas.getContext('2d')!
            const canvasSize = V.vec(this.state.width, this.state.height)

            const currentWorld = {...this.worldData}

            gc.clearRect(0,0, canvasSize.x, canvasSize.y)

            this.viewTransform = {
                eye: currentWorld.eye,
                scaling: currentWorld.scaling,
                unitToPixel: currentWorld.unitToPixel,
                canvasSize: canvasSize,
                wholeScaling: currentWorld.scaling * currentWorld.unitToPixel
            }

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
                ...currentWorld.objects
            ]

            paintObjectsSorted(objects, gc, this.viewTransform, 'world')
        }

        if (this.inPaintLoop) 
            setTimeout(() => requestAnimationFrame(() => this.paint()), 2)
    }

    componentDidMount() {
        this.init()
        this.props.onMouseChange(this.mouse)
    }

    render() {
        const w = this.state.width
        const h = this.state.height
        return <React.Fragment>
            <canvas
                ref={ this.refF } 
                width={ w } 
                height={ h }
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    zIndex: this.props.zIndex
                }} />

            <CrazyMouseEventComponent 
                onmousemove={(evt: MouseEvent) => {
                    if (this.mouse && this.viewTransform) {
                        const cPos = vec(evt.clientX, evt.clientY)

                        this.props.onMouseChange({
                            ...this.mouse,
                            clientPos: cPos,
                            pos: screenToWorld(cPos, this.viewTransform)
                        })
            
                        if (this.props.onViewChange && this.mouse.bPressed === 0) {    
                            if (this.mouse) {
                                const newEye = V.add(V.mul(V.sub( 
                                    this.lastMousePosition,
                                    vec(evt.clientX, evt.clientY)
                                ), 1/(this.viewTransform.scaling * this.viewTransform.unitToPixel)), this.lastEye)
                
                                this.props.onViewChange(
                                    newEye, undefined
                                )
                            }
                        }
                    }
                }}
                onmousedown={(evt: MouseEvent) => {
                    if (this.mouse) {
                        this.props.onMouseChange({
                            ...this.mouse,
                            bPressed: evt.button
                        })
                    }
        
                    if (this.props.onViewChange && this.mouse && this.viewTransform) {
                        this.lastMousePosition = {...vec(evt.clientX, evt.clientY)}
                        this.lastEye = {...this.viewTransform.eye}
                    }
                }}
                onmouseup={(_: MouseEvent) => {
                    if (this.mouse) {
                        this.props.onMouseChange({
                            ...this.mouse,
                            bPressed: null
                        })
                    }
                }}
                onmouseleave={(_: MouseEvent) => {
                    this.props.onMouseChange({
                        ...this.mouse,
                        pos: null,
                        clientPos: null
                    })
                }}
                onmouseenter={(evt: MouseEvent) => {
                    if (this.props.onViewChange &&this.viewTransform) {
                        const cPos = vec(evt.screenX, evt.screenY)
                        this.props.onMouseChange({
                            pos: screenToWorld(cPos, this.viewTransform),
                            clientPos: cPos,
                            bPressed: null
                        })
                    }
                }}
                onwheel={(evt: WheelEvent) => {
                    if (this.props.onViewChange && this.viewTransform) {
                        this.props.onViewChange(
                            undefined, (this.viewTransform.scaling - (evt.deltaY/1000))
                        )
                    }
                }}
            />
        </React.Fragment>
    }
}