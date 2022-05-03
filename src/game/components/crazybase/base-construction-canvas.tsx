import { FinalGameData } from "../../final-game-data"
import React, { useEffect } from "react";
import { BaseExtensionTypeE, CrazyBaseStateI, CrazyGoodE, GoodsContainerI, RocketTypeE } from "../../decl";
import { drawRoundRectangle } from "../../paint/paint_addons"
import { V, vec } from "../../../common/math";

const enterZoneRadius = 0.125 * 0.8
const outerRingRadius = 0.8/2
const extensionSize = vec(0.2, 0.1)

export type SelectedObjectT = 'cargo-area' | 'human-area' | 'outer-ring' | 'enter-zone-base'

export function BaseConstructionCanvas(props: {
    baseState: CrazyBaseStateI,
    selectedObject?: SelectedObjectT,
    size: number
}) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        console.log('Doing effect!')
        console.log(canvasRef.current)

        const gc = canvasRef.current!.getContext('2d')!

        const setStyle = (selected: boolean, primary?: boolean) => {
            gc.fillStyle = selected ? 'rgb(50,25,0)' : (primary === true ? 'rgb(0,0,0)' : 'rgb(50,50,50)')
            gc.strokeStyle = selected ? 'red' : 'white'
        }

        gc.clearRect(0,0, props.size, props.size)

        gc.save()
        gc.translate(props.size/2, props.size/2)

        if (props.baseState.isRingBuilded) {
            if (props.baseState.isInterceptionActivated) {
                gc.shadowColor = 'rgb(255,150,50)'
                gc.shadowOffsetX = 0
                gc.shadowOffsetY = 0
                gc.shadowBlur = (1 - outerRingRadius * 2) / 2 * props.size 
            }

            gc.lineWidth = 10

            gc.beginPath()
            gc.arc(0,0, outerRingRadius * props.size, 0, Math.PI * 2)

            gc.strokeStyle = 'rgb(120,120,120)'
            gc.stroke()

            console.log(gc.globalCompositeOperation)

            gc.globalCompositeOperation = 'destination-out'
            gc.arc(0, 0, outerRingRadius, 0, Math.PI*2)
            gc.fill()
            gc.globalCompositeOperation = 'source-over'

            gc.shadowColor = ''
            gc.shadowBlur = 0

            gc.lineWidth = 3
            setStyle(props.selectedObject === 'outer-ring', true)
            gc.arc(0,0, outerRingRadius * props.size, 0, Math.PI * 2)
            gc.stroke()

            gc.lineWidth = 3

            const list = props.baseState.extensions.sort(it => it.place)

            list.forEach((it, i) => {
                const last = list[i-1]
                const rotation = (it.place - (last ? last.place : 0)) * (Math.PI / 180)

                gc.rotate(rotation)
                
                const posy = -outerRingRadius * 1.05
                const pos = vec(-extensionSize.x / 2, posy)

                gc.lineWidth = 1
                if (it.type === BaseExtensionTypeE.CARGO_AREA) {
                    setStyle(props.selectedObject === 'cargo-area', true)
                    drawRoundRectangle(
                        gc, pos.x * props.size, pos.y * props.size, 
                        extensionSize.x * props.size, extensionSize.y * props.size, 
                        extensionSize.y * props.size
                    )
                }
                if (it.type === BaseExtensionTypeE.HUMAN_AREA) {
                    setStyle(props.selectedObject === 'human-area', true)

                    gc.beginPath()
                    gc.moveTo(pos.x * props.size, pos.y * props.size)
                    gc.lineTo((pos.x + extensionSize.x) * props.size, pos.y * props.size)
                    gc.lineTo(
                        (pos.x + extensionSize.x - extensionSize.x/4) * props.size, 
                        (pos.y + extensionSize.y) * props.size
                    )
                    gc.lineTo(
                        (pos.x + extensionSize.x/4) * props.size, 
                        (pos.y + extensionSize.y) * props.size
                    )
                    gc.closePath()
                }
                gc.fill()
                gc.stroke()

                gc.textAlign = 'center'
                gc.textBaseline = 'middle'
                gc.font = 'bold 14px sans-serif'
                gc.fillStyle = 'white'
                const textPos = vec(0, posy + extensionSize.y / 2)
                gc.fillText(it.name, textPos.x * props.size, textPos.y * props.size)
            })
        }

        gc.lineWidth = 2
        gc.lineCap = 'round'
        gc.setLineDash([3, 3])

        setStyle(props.selectedObject === 'enter-zone-base')
        gc.beginPath()
        gc.arc(0,0, enterZoneRadius * props.size, 0, Math.PI * 2)
        gc.fill()
        gc.stroke()

        gc.setLineDash([0, 0])

        gc.restore()
    })

    return <canvas className="mx-auto p-0" style={{width: props.size+'px', height: props.size+'px'}} width={props.size} height={props.size} ref={canvasRef} />
}