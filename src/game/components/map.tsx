import { ClientGameDataI, VectorI } from "../../common/declarations";
import { V } from "../../common/math";
import { gameHelper } from "../object-functions/game";

export interface MapConfig {
    width: number,
    factor: number, // how much of the whole world is shown
    showedThings?: [ 'rocket'  | 'asteroid', boolean ],
    nameUnderRocket?: boolean,
    backgroundColor?: string,
    borderColor?: string,
    position?: VectorI
}

export interface MapState {
    gameData: ClientGameDataI,
    eye: VectorI,
    colorMarkedRockets?: [ string, string, string ][]
}

/*export let mainMap: RocketMap

export class RocketMap extends React.Component<MapConfig, MapState> {
    private height = 0
    private canvasRef: HTMLCanvasElement | null = null

    constructor(p: any) {
        super(p)
        this.state = {}
        mainMap = this
    }
    render() {
        const g = this.state.state?.galaxy
        if (g) this.height = this.props.width / g.width * g.height
        return <canvas
            width={ this.props.width }
            height={ this.height }
            ref={ (e: HTMLCanvasElement | null) => this.canvasRef = e } 
            className={ this.props.classes } />
    }
    componentDidUpdate() {
        const s = this.state.state
        if (this.canvasRef && s) {
            const gc = this.canvasRef!.getContext('2d')!

            gc.clearRect(0, 0, this.props.width, this.height)

            gc.fillStyle = this.props.backgroundColor ? this.props.backgroundColor : 'rgba(0,0,0,0.4)'
            gc.fillRect(0, 0, this.props.width, this.height)
            gc.lineWidth = 1
            gc.strokeStyle = this.props.borderColor ? this.props.borderColor : 'white'
            gc.strokeRect(0, 0, this.props.width, this.height)

            gc.save()

            const f = (this.props.width / this.props.factor) / s.galaxy.width
            const wholeMapSize = [ f * s.galaxy.width, f * s.galaxy.height ]

            const np = (op: VectorI) => V.mul(op, f)
            const paintTo = (pos: VectorI, a: number, p: (g: CanvasRenderingContext2D) => void) => {
                gc.save()

                gc.translate(np(pos).x, np(pos).y)
                if (a !== 0) gc.rotate(a)
                p(gc)

                gc.restore()
            }

            const mapp = 30

            const tx = (s.eye.x / s.galaxy.width)  * (wholeMapSize[0] - this.props.width + mapp*2) - mapp
            const ty = (s.eye.y / s.galaxy.height) * (wholeMapSize[1] - this.height      + mapp*2) - mapp

            if (this.props.factor !== 1) gc.translate(-tx, -ty)

            gc.lineWidth = 2
            gc.strokeStyle = 'darkred'
            gc.beginPath()
            gc.moveTo(0, 0)
            gc.lineTo(f * s.galaxy.width, 0)
            gc.lineTo(f * s.galaxy.width, f * s.galaxy.height)
            gc.lineTo(0, f * s.galaxy.height)
            gc.closePath()
            gc.stroke()

            if (!this.props.showedThings || this.props.showedThings?.includes('rocket')) {
                const rh = 4
                const rw = 3

                s.galaxy.objects.rockets.forEach(r => {
                    paintTo(r.geo.pos, r.geo.angle, g => {
                        const colormark = s.colorMarkedRockets?.find(cm => cm[0] === r.id)
                        g.fillStyle = colormark ? colormark[1] : 'red'
                        g.strokeStyle = colormark ? colormark[2] : 'red'
                        g.lineWidth = 1

                        g.beginPath()
                        g.moveTo(rh, 0)
                        g.lineTo(-rh, rw)
                        g.lineTo(-rh, -rw)
                        g.closePath()

                        g.fill()
                        g.stroke()
                    })
                })
            }

            if (!this.props.showedThings || this.props.showedThings?.includes('rocket')) {
                s.galaxy.objects.asteroids.forEach(a => {
                    paintTo(a.geo.pos, 0, g => {
                        const r = a.size * 3
                        g.fillStyle = 'rgba(255,255,255, 0.3)'
                        g.beginPath()
                        g.arc(a.geo.pos.x - r, a.geo.pos.y - r, r, 0, Math.PI*2)
                        g.fill()
                    })
                })
            }

            gc.restore()
        }
    }
}*/

export function rocketMapHelper(config: MapConfig, state: MapState) {
    return {
        paint(gc: CanvasRenderingContext2D, canvasSize: VectorI) {
            const s = state
            if (s) {
                gc.save()

                const gameW = s.gameData.settings.width
                const gameH = s.gameData.settings.height

                const configHeight = config.width / gameW * gameH

                const t = V.mulVec(canvasSize, config.position ? config.position : V.zero())
                gc.translate(t.x, t.y)

                gc.fillStyle = config.backgroundColor ? config.backgroundColor : 'rgba(0,0,0,0.4)'
                
                gc.rect(0, 0, config.width, configHeight)
                gc.fill()
                
                gc.lineWidth = 1
                gc.strokeStyle = config.borderColor ? config.borderColor : 'white'

                gc.rect(0, 0, config.width, configHeight)
                gc.stroke()

                gc.save()

                gc.rect(0, 0, config.width, configHeight)
                gc.clip()

                gc.save()

                const f = (config.width / config.factor) / gameW
                const wholeMapSize = [ f * gameW, f * gameH ]

                const np = (op: VectorI) => V.mul(op, f)
                const paintTo = (pos: VectorI, a: number, p: (g: CanvasRenderingContext2D) => void) => {
                    gc.save()

                    gc.translate(np(pos).x, np(pos).y)
                    if (a !== 0) gc.rotate(a)
                    p(gc)

                    gc.restore()
                }

                const mapp = 30

                const tx = (s.eye.x / gameW)  * (wholeMapSize[0] - config.width + mapp*2) - mapp
                const ty = (s.eye.y / gameH) * (wholeMapSize[1] - configHeight      + mapp*2) - mapp

                if (config.factor !== 1) gc.translate(-tx, -ty)

                gc.lineWidth = 2
                gc.strokeStyle = 'darkred'
                gc.beginPath()
                gc.moveTo(0, 0)
                gc.lineTo(f * gameW, 0)
                gc.lineTo(f * gameW, f * gameH)
                gc.lineTo(0, f * gameH)
                gc.closePath()
                gc.stroke()

                gameHelper(s.gameData).forEachObjects(
                    r => {
                        if (!config.showedThings || config.showedThings?.includes('rocket')) {
                            const rh = 4
                            const rw = 3

                            paintTo(r.geo.pos, r.geo.ang, g => {
                                const colormark = s.colorMarkedRockets?.find(cm => cm[0] === r.id)
                                g.fillStyle = colormark ? colormark[1] : 'red'
                                g.strokeStyle = colormark ? colormark[2] : 'red'
                                g.lineWidth = 1
        
                                g.beginPath()
                                g.moveTo(rh, 0)
                                g.lineTo(-rh, rw)
                                g.lineTo(-rh, -rw)
                                g.closePath()
        
                                g.fill()
                                g.stroke()
                            })
                        }
                    },
                    a => {
                        if (!config.showedThings || config.showedThings?.includes('asteroid')) {
                            paintTo(a.geo.pos, 0, g => {
                                const r = a.size * 3
                                g.fillStyle = 'rgba(255,255,255, 0.3)'
                                g.beginPath()
                                g.arc(a.geo.pos.x - r, a.geo.pos.y - r, r, 0, Math.PI*2)
                                g.fill()
                            })
                        }
                    }
                )

                gc.restore()

                gc.restore()

                gc.restore()
            }
        }
    }
}