import { GamePaintDataI, PaintTransformI } from "./paint_declarations";
import { V, vec } from "../../common/math";
import { VectorI } from "../../common/declarations";
import { paintObject } from "./paint_helpers";

export function getGradient(gc: CanvasRenderingContext2D, c1: string, c2: string, pos1: VectorI, pos2: VectorI) {
    const grd = gc.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y)
    grd.addColorStop(0, c1)
    grd.addColorStop(1, c2)
    return grd
}

export function setGradiendOrColor(
    gc: CanvasRenderingContext2D,
    c1: string, 
    c2?: string, 
    pos1?: VectorI, 
    pos2?: VectorI
) {
    return c2 ? getGradient(gc, c1, c2, pos1!, pos2!) : c1
}

export function drawRoundRectangle(gc: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    gc.beginPath()
    if (r == 0) {
        gc.moveTo(x,y)
        gc.lineTo(x + w, y)
        gc.lineTo(x + w, y + h)
        gc.lineTo(x, y + h)
    }
    else {
        if (w < 2 * r) r = w / 2
        if (h < 2 * r) r = h / 2
        gc.moveTo(x+r, y)
        gc.arcTo(x+w, y,   x+w, y+h, r)
        gc.arcTo(x+w, y+h, x,   y+h, r)
        gc.arcTo(x,   y+h, x,   y,   r)
        gc.arcTo(x,   y,   x+w, y,   r)
    }
    gc.closePath()

    return gc
}

export function withTransform(
    data: GamePaintDataI, 
    gc: CanvasRenderingContext2D, 
    trans: PaintTransformI, 
    sizeP: VectorI,
    callback: (gc: CanvasRenderingContext2D, pos: VectorI, size: VectorI) => void,
    ignoreScaling?: boolean
) {
    const size = V.mul(sizeP, (ignoreScaling === true ? 1 : trans.scaling))
    const pos = trans.screenToWorld(data.pos)

    gc.save()
    gc.translate(-pos.x, -pos.y)
    if (data.rotate) gc.rotate(data.rotate)
    if (data.scale) gc.scale(data.scale, data.scale)

    data.relativeChildren
        ?.filter(child => child.paintBehindParent === true)
        .forEach(child => paintObject(child, gc, {...trans, eye: V.zero()}))

    const relativePosWithCenter = V.mul(V.mulVec(size, data.center ? data.center : vec(0.5,0.5)), -1)
    callback(gc, relativePosWithCenter, size)

    data.relativeChildren
        ?.filter(child => child.paintBehindParent !== true)
        .forEach(child => paintObject(child, gc, {...trans, eye: V.zero()}))

    gc.restore()
}

export function paintPoint(gc: CanvasRenderingContext2D, pos: VectorI, color: string, radius: number) {
    gc.fillStyle = color
    gc.beginPath()
    gc.arc(pos.x, pos.y, radius, 0, Math.PI*2)
    gc.fill()
}