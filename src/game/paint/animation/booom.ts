import { V, vec } from "../../../common/math";
import { VectorI } from "../../../common/declarations"
import {AnimationGamePropsI, AnimationObjectI} from "../paint_declarations"

export interface CircledBooomChildPropsI {
    radius: number
    color: string
    relativePos: VectorI
    paintMe: boolean
}

interface CircledBooomChildConfigI {
    maxRadius: number
    maxDistance: number
    eVector: VectorI
    creatingPos: VectorI
    revealTime: number
    color: string
    startOpacity: number
    hideTime: number
    killTime: number
}


export interface CircledBooomAnimationPropsI {
    circles: CircledBooomChildPropsI[],
    type: string
}

export interface CircledBoomConfigI {
    pos: VectorI,
    depth: number,
    radius: number,
    duration: number,
    velocity?: VectorI,
    radiusFac?: number,
    prmColorIndex: number,
    colors: string[],
    revealRadiusFac?: number
}

export class CircledBooomAnimation implements AnimationObjectI {
    private pos: VectorI
    private circles: CircledBoomChild[] = []
    private config: CircledBoomConfigI
    private time = 0
    private gameProps?: AnimationGamePropsI
    private mainChild: CircledBoomChild

    constructor(config: CircledBoomConfigI) {
        this.pos = config.pos
        this.config = config
        
        const sd = this.config.duration * 0.9

        this.mainChild = new CircledBoomChild(
            {
                maxRadius: this.config.radius,
                maxDistance: 0,
                eVector: V.zero(),
                creatingPos: V.zero(),
                revealTime: 0,
                hideTime: this.config.duration * 0.4,
                killTime: this.config.duration * 0.9,
                startOpacity: 0.2,
                color: this.config.colors[this.config.prmColorIndex]
            },
            () => {}
        )

        for (let i = 0; i < config.depth; i ++) {
            const ev = V.al(Math.random()*2*Math.PI, 1)
            this.circles.push(new CircledBoomChild(
                {
                    maxRadius: (Math.random() * config.radius/5 + config.radius/15) * (config.radiusFac ? config.radiusFac : 1),
                    maxDistance: Math.random() * (9*config.radius/10) + config.radius/10,
                    eVector: ev,
                    creatingPos: V.mul(ev, (Math.random() + Math.random())/2 * this.config.radius / 6 * (config.revealRadiusFac ? config.revealRadiusFac : 1)),
                    revealTime: (Math.random() * 0.4) * sd,
                    hideTime: (Math.random() * 0.3 + 0.4) * sd,
                    killTime: (Math.random() * 0.25 + 0.75) * sd,
                    startOpacity: Math.random() * 0.3 + 0.1,
                    color: this.config.colors[Math.trunc(Math.random() * this.config.colors.length)]
                },
                (it: CircledBoomChild) => {
                    const index = this.circles.indexOf(it, 0)
                    this.circles.splice(index, 1)
                }
            ))
        }
    }

    getType() { return 'BOOOM' }

    giveMeGameProps(gp: AnimationGamePropsI) {
        this.gameProps = gp
    }

    calc(factor: number) {
        this.pos = V.add(this.pos, this.config.velocity ? this.config.velocity : V.zero())

        this.mainChild.calc(factor, this.time)
        this.circles.forEach(c => c.calc(factor, this.time))

        if (this.time >= this.config.duration) this.gameProps!.killMe()
        this.time += factor
    }

    data() {
        return {
            type: this.getType(),
            pos: this.pos,
            srPos: V.sub(this.pos, V.square(this.config.radius)),
            srSize: V.square(this.config.radius*2),
            id: this.gameProps!.id,
            props: {
                type: 'circled',
                circles: this.circles.map(c => c.data()),
                mainChild: this.mainChild.data()
            }
        }
    }
}

class CircledBoomChild {
    private currentRevealTime = 0
    private currentPos: VectorI
    private currentRadius = 0
    private currentOpacity = 0
    private config: CircledBooomChildConfigI
    private killMe: (me: CircledBoomChild) => void
    private startPosLength: number

    constructor(config: CircledBooomChildConfigI, killMe: (me: CircledBoomChild) => void) {
        this.killMe = killMe
        this.config = config
        this.startPosLength = V.length(config.creatingPos)
        this.currentPos = config.creatingPos
        this.config = config
        this.currentOpacity = config.startOpacity
    }

    calc(factor: number, time: number) {
        if (time >= this.config.revealTime) {
            const ts = (this.config.killTime - this.config.revealTime)

            this.currentPos = V.add(
                this.currentPos, 
                V.mul(this.config.eVector, (this.config.maxDistance - this.startPosLength) / ts * factor)
            )
            
            this.currentRadius += this.config.maxRadius / ts * factor

            if (time >= this.config.hideTime) {
                this.currentOpacity -= (this.config.startOpacity) / (this.config.killTime - this.config.hideTime) * factor

                if (this.currentOpacity <= 0) {
                    this.currentOpacity = 0
                    this.killMe(this)
                }
            }
        }
    }

    data(): CircledBooomChildPropsI {
        return {
            relativePos: this.currentPos,
            radius: this.currentRadius,
            color: 'rgba('+this.config.color+','+this.currentOpacity+')',
            paintMe: this.currentRevealTime >= this.config.revealTime
        }
    }
}