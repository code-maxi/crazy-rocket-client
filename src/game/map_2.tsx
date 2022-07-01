import React, { useEffect } from "react"
import { VectorI } from "../common/declarations";
import { V, vec } from "../common/math";
import { PaintCrazyWorldI, PaintTransformI } from "./paint/paint_declarations";
import { paintObjectsSorted } from "./paint/paint_helpers";

export function CrazyMap(props: {
    world: PaintCrazyWorldI,
    width: number
}) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [canvasSize, setCanvasSize] = React.useState(V.zero())

    useEffect(() => {
        setCanvasSize(vec(props.width, props.width*0.5))

        console.log('Map updating...')
        const gc = canvasRef!.current.getContext('2d')

        const transform: PaintTransformI = {
            scaling: props.world.scaling,
            eye: props.world.eye,
            unitToPixel: 10,
            wholeScaling: props.world.scaling * 10,
            canvasSize: canvasSize
        }

        paintObjectsSorted(props.world.objects, gc, transform, 'map')
    })

    return <canvas ref={canvasRef} width={canvasSize.x} height={canvasSize.y} />
}