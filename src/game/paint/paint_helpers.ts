import { GamePaintDataI, ImagePropsD, LabelPropsD, LinePropsD, PaintTransformI, ProcessPropsD } from "./paint_declarations";
import { V, vec } from "../../common/math";
import { getImage } from "./images";
import { drawRoundRectangle, setGradiendOrColor, withTransform } from "./paint_addons";
import wrap from 'word-wrap'

export function paintObject(data: GamePaintDataI, gc: CanvasRenderingContext2D, trans: PaintTransformI) {
    const func = paintHelpers.get(data.paintType)
    if (func) func(data, gc, trans) 
    else paintObject(data, gc, trans)
}

const paintHelpers = new Map<string, (data: GamePaintDataI, gc: CanvasRenderingContext2D, trans: PaintTransformI) => void>([
    ['IMAGE', (data, gc, trans) => {
        const dataProps = data.props as ImagePropsD

        withTransform(data, gc, trans, dataProps.size, (gc, pos, size) => {
            const img = getImage(dataProps.src)
            gc.drawImage(img, pos.x, pos.y)
        })
    }],

    ['PROCESS', (data, gc, trans) => {
        const dataProps = data.props as ProcessPropsD
        
        withTransform(data, gc, trans, dataProps.size, (gc, pos, size) => {
            gc.fillStyle = dataProps.bColor

            drawRoundRectangle(gc, pos.x, pos.y, size.x, size.y, dataProps.roundedCorners)
            gc.fill()
            
            drawRoundRectangle(gc, pos.x, pos.y, size.x * (dataProps.value/100), size.y, dataProps.roundedCorners)
            gc.fillStyle = setGradiendOrColor(gc, dataProps.fColor1, dataProps.fColor2, pos, vec(size.x, 0))
            gc.fill()

            if (dataProps.borderColor) {
                gc.strokeStyle = dataProps.borderColor
                drawRoundRectangle(gc, pos.x, pos.y, size.x, size.y, dataProps.roundedCorners)
                gc.stroke()
            }

        }, data.ignoreScaling)
    }],

    ['LINE', (data, gc, trans) => {
        const dataProps = data.props as LinePropsD

        const pos1 = trans.worldToScreen(data.pos)
        const pos2 = trans.worldToScreen(V.add(data.pos, dataProps.d))

        gc.strokeStyle = setGradiendOrColor(gc, dataProps.color, dataProps.color2, pos1, pos2)
        gc.lineWidth = dataProps.lineWidth
        if (dataProps.dash.length > 0) gc.setLineDash(dataProps.dash)
        gc.lineCap = 'round'

        gc.beginPath()
        gc.moveTo(pos1.x, pos1.y)
        gc.lineTo(pos2.x, pos2.y)
        gc.stroke()
    }],

    ['LABEL', (data, gc, trans) => {
        const dataProps = data.props as LinePropsD
        
        const pos1 = trans.worldToScreen(data.pos)
        const pos2 = trans.worldToScreen(V.add(data.pos, dataProps.d))

        gc.strokeStyle = setGradiendOrColor(gc, dataProps.color, dataProps.color2, pos1, pos2)
        gc.lineWidth = dataProps.lineWidth
        if (dataProps.dash.length > 0) gc.setLineDash(dataProps.dash)
        gc.lineCap = 'round'

        gc.beginPath()
        gc.moveTo(pos1.x, pos1.y)
        gc.lineTo(pos2.x, pos2.y)
        gc.stroke()
    }],

    ['LABEL', (data, gc, trans) => {
        const dataProps = data.props as LabelPropsD

        const givenText = dataProps.breakWordLength ? wrap(dataProps.text, {
            width: dataProps.breakWordLength
        }) : dataProps.text

        const lines = givenText.split('\n')
        const gapBetweenLines = 5

        gc.font = dataProps.fFamily + ' ' + dataProps.fSize + 'px ' + dataProps.fColor

        let maxWidth = 0
        lines.forEach(l => {
            const lLength = gc.measureText(l).width
            if (lLength > maxWidth) maxWidth = lLength
        })

        const summedLineHeight = lines.length * dataProps.fSize
        const summedLineGap = lines.length > 1 ? (lines.length - 1) * gapBetweenLines : 0
        
        const maxHeight = summedLineHeight + summedLineGap

        const size = V.add(vec(maxWidth, maxHeight), V.square(dataProps.bPadding*2))

        withTransform(data, gc, trans, size, (gc, pos, size) => {
            gc.fillStyle = dataProps.bColor
            drawRoundRectangle(gc, pos.x, pos.y, size.x, size.y, dataProps.bRadius).fill()

            gc.textBaseline = 'top'
            gc.textAlign = 'left'
            gc.fillStyle = dataProps.fColor

            for (let i = 0; i < lines.length; i++) {
                gc.fillText(
                    lines[i], pos.x + dataProps.bPadding,
                    pos.y + dataProps.bPadding + i * (dataProps.fSize + gapBetweenLines)
                )
            }
        }, true)
    }],

    ['TYPE_NOT_KNOWN', (data, gc, trans) => {
        paintObject({
            ...data,
            paintType: 'IMAGE',
            props: {
                src: 'noimage.png',
                size: vec(200, 200)
            },
            relativeChildren: [
                {
                    paintType: 'LABEL',
                    pos: V.zero(),
                    props: {
                        bColor: 'rgba(0,0,0,0.5)',
                        bPadding: 5,
                        bRadius: 5,
                        fColor: 'white',
                        fFamily: 'sans-serif',
                        fSize: 14,
                        text: 'The type ' + data.paintType + '\nisnot defined yet.'
                    }
                }
            ]
        }, gc, trans)
    }]
])