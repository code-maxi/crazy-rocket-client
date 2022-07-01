import { AnimationGamePropsI, AnimationObjectI } from "../paint_declarations";
import { V, vec, Vector } from "../../../common/math";
import { VectorI } from "../../../common/declarations"

export const RIPConsts = {
    ICON_SIZE: 2.5,
    FADING_IN_DURATION: 10,
    SHOWING_DURATION: 100,
    FADING_OUT_DURATION: 30,
    START_SCALING: 0.9,
    END_SCALING: 0.3,
    PRM_FONT_SIZE: 40,
    SCNR_FONT_SIZE: 20,
    PRM_FONT_COLOR: 'lightyellow',
    SCNR_FONT_COLOR: 'grey'
}

export class RIPAnimation implements AnimationObjectI {
    private gameProps?: AnimationGamePropsI
    private time = 0
    private pos: VectorI
    private text: string
    private opacity = 0
    private scaling = RIPConsts.START_SCALING

    constructor(pos: VectorI, text: string) {
        this.pos = pos
        this.text = text
    }

    getType() { return 'RIP' }

    giveMeGameProps(gp: AnimationGamePropsI) { this.gameProps = gp }

    calc(factor: number) {
        if (this.time < RIPConsts.FADING_IN_DURATION) {
            if (this.opacity < 1)
                this.opacity += (1 / RIPConsts.FADING_IN_DURATION) * factor
            else this.opacity = 1
                
            if (this.scaling < 1)
                this.scaling += ((1 - RIPConsts.START_SCALING) / RIPConsts.FADING_IN_DURATION) * factor
            else this.scaling = 1
        }

        else if (this.time >= RIPConsts.FADING_IN_DURATION + RIPConsts.SHOWING_DURATION) {
            if (this.opacity > 0)
                this.opacity -= (1 / RIPConsts.FADING_OUT_DURATION) * factor
            else this.opacity = 0
                
            if (this.scaling > 0)
                this.scaling -= ((1 - RIPConsts.END_SCALING) / RIPConsts.FADING_OUT_DURATION) * factor
            else this.scaling = 0
        }

        else if (this.time >= RIPConsts.FADING_IN_DURATION + RIPConsts.SHOWING_DURATION + RIPConsts.FADING_OUT_DURATION) 
            this.gameProps!.killMe()

        this.time += factor
    }

    data() {
        return {
            type: this.getType(),
            pos: this.pos,
            srPos: V.sub(this.pos, V.square(RIPConsts.ICON_SIZE/2 * this.scaling)),
            srSize: V.square(RIPConsts.ICON_SIZE * this.scaling),
            id: this.gameProps!.id,
            props: {
                opacity: this.opacity,
                primaryText: 'R.I.P',
                secondaryText: this.text,
                scaling: this.scaling,
                ...RIPConsts
            }
        }
    }
}