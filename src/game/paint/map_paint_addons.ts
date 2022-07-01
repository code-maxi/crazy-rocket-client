import { VectorI } from "../../common/declarations";

export function drawCross(gc: CanvasRenderingContext2D, pos: VectorI, size: number) {
    const halfS = size/2
    gc.lineCap = 'round'
    gc.beginPath()
    gc.moveTo(pos.x - halfS, pos.y + halfS)
    gc.lineTo(pos.x + halfS, pos.y - halfS)
    gc.moveTo(pos.x - halfS, pos.y - halfS)
    gc.lineTo(pos.x + halfS, pos.y + halfS)
    return gc
}