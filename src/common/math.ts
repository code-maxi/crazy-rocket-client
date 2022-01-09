import { DatableI, GeoI, VectorI } from "./declarations"

export class Vector implements VectorI, DatableI<VectorI> {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    nRight() { return new Vector(this.y, -this.x) }

    l() { return Math.sqrt(this.x*this.x + this.y*this.y) }
    a() { return Math.atan2(this.y, this.x) }
    e() { return this.div(this.l()) }

    mul(s: number)   { return new Vector(this.x * s, this.y * s) }
    div(s: number)   { return new Vector(this.x / s, this.y / s) }
    plus(v: Vector)  { return new Vector(this.x + v.x, this.y + v.y) }
    minus(v: Vector) { return new Vector(this.x - v.x, this.y - v.y) }
    
    negate() { return this.mul(-1) }
    mulSkalar(v: Vector) { return this.x * v.x + this.y * v.y }
    vectorProduct(v: Vector) { return this.x * v.y - this.y * v.x }
    between(v: Vector) { return Math.acos(this.mulSkalar(v) / (this.l() * v.l())) }

    data(): VectorI { return { x: this.x, y: this.y } }

    static difference(a: Vector, b: Vector) { return new Vector(b.x - a.x, b.y - a.y) }
    static fromData(v: VectorI) { return new Vector(v.x, v.y) }
    static fromAL(a: number, l: number) { return new Vector(Math.cos(a) * l, Math.sin(a) * l) }
}

export class Geo implements GeoI {
    pos: Vector
    angle: number
    width: number
    height: number

    constructor(g?: GeoI) {
        if (g !== undefined) {
            this.pos = Vector.fromData(g.pos)
            this.angle = g.angle
            this.width = g.width
            this.height = g.height
        } else {
            this.pos = new Vector(0,0)
            this.angle = 0
            this.width = 0
            this.height = 0
        }
    }

    top()    { return this.pos.y - this.height/2.0 }
    left()   { return this.pos.x - this.width/2.0 }
    bottom() { return this.pos.y + this.height/2.0 }
    right()  { return this.pos.x + this.width/2.0 }

    geoData() {
        return {
            pos: this.pos.data(),
            width: this.width,
            height: this.height,
            angle: this.angle
        }
    }

    private longestEdge() { return this.width > this.height ? this.width : this.height }

    private insectRect(that: Geo) { // DONE: not right so!
        return (
            (that.bottom() > this.top() || that.top() < this.bottom()) &&
            (that.right() > this.left() || that.left() < this.right())
        )
    }
    private insectCircle(that: Geo, skalar?: number) {
        return Vector.difference(that.pos, this.pos).l() < 
            (this.longestEdge() + that.longestEdge()) * (skalar ? skalar : 1)
    }


    insect(g: Geo, type: 'rect' | 'circle', skalar?: number, points?: Vector[]) {
        return type == 'rect' ? this.insectRect(g) : 
            this.insectCircle(g, skalar)
    }

    static fromVector(
        v: Vector,
        width: number,
        height: number,
        cc?: Vector
    ) {
        const center = cc ? cc : new Vector(-0.5, -0.5)
        return new Geo({
            pos: v.plus(new Vector(
                center.x * width,
                center.y * height
            )),
            width: width,
            height: height,
            angle: 0
        })
    }
}

export function vec(x: number, y: number): VectorI {
    return { x: x, y: y }
}

export const V = {
    plus(v1: VectorI, v2: VectorI)  { return vec(v1.x + v2.x, v1.y + v2.y) },
    minus(v1: VectorI, v2: VectorI) { return vec(v1.x - v2.x,  v1.y - v2.y) },
    mul(v1: VectorI, s: number)     { return vec(v1.x * s,  v1.y * s) },
    div(v1: VectorI, s: number)     { return vec(v1.x / s,  v1.y / s) },

    nRight(vv: VectorI) { return vec(vv.y, vv.x) },
    l(vv: VectorI) { return Math.sqrt(vv.x*vv.x + vv.y*vv.y) },
    a(vv: VectorI) { return Math.atan2(vv.y, vv.x) },
    e(vv: VectorI) { return V.div(vv, V.l(vv)) },

    negate(v: VectorI) { return vec(-v.x, -v.x) },
    mulSkalar(v1: VectorI, v2: VectorI): number { return v1.x * v2.x + v1.y * v2.y },
    between(v1: VectorI, v2: VectorI) { return Math.acos(V.mulSkalar(v1, v2) / (V.l(v1) * V.l(v2))) },

    difference(a: VectorI, b: VectorI) { return V.minus(b, a) },
    al(a: number, l: number) { return vec(Math.cos(a) * l, Math.sin(a) * l) }
}

export const G = {
    top(gg: GeoI)    { return gg.pos.y - gg.height/2.0 },
    left(gg: GeoI)   { return gg.pos.x - gg.width/2.0 },
    bottom(gg: GeoI) { return gg.pos.y + gg.height/2.0 },
    right(gg: GeoI)  { return gg.pos.x + gg.width/2.0 },

    longestEdge(gg: GeoI) { return gg.width > gg.height ? gg.width : gg.height },

    insect(
        g1: Geo, 
        g2: GeoI, 
        type: 'rect' | 'circle', 
        skalar?: number, 
        points?: Vector[]
    ) {
        const insectRect = (skalar?: number) => { // DONE: not right so!
            const s = skalar ? skalar : 0
            return (
                (G.bottom(g2) > G.top(g1)-s || G.top(g2) < G.bottom(g1)+s) &&
                (G.right(g2) > G.left(g1)-s || G.left(g2) < G.right(g1)+s)
            )
        }

        const insectCircle = (skalar?: number) => {
            return V.l(V.difference(g2.pos, g1.pos)) < 
              (G.longestEdge(g1) + G.longestEdge(g2)) * (skalar ? skalar : 1)
        }

        return type == 'rect' ? insectRect(skalar) : insectCircle(skalar)
    },

    fromVector(
        v: Vector,
        width: number,
        height: number,
        cc?: Vector
    ) {
        const center = cc ? cc : new Vector(-0.5, -0.5)
        return new Geo({
            pos: v.plus(new Vector(
                center.x * width,
                center.y * height
            )),
            width: width,
            height: height,
            angle: 0
        })
    }
}

/*export function insectsPoints(points: Vector[], pos: Vector, radius: number): boolean {
    points.forEach((p, i) => {
        if (i < points.length) {
            let p1 = p
            let p2 = points[i+1]

            if (radius !== 0) {
                const it = Vector.difference(p1, p2).nRight().e().mul(radius)
                p1 = p1.plus(it)
                p2 = p2.plus(it)
            }
            if (Vector.difference(p1, p2).nRight().mulSkalar(Vector.difference(p1, pos)) > 0) return false
        }
    })
    return true
}*/

export function inRange(z1: number, z2: number, d: number) {
    return z1 < z2 + d/2 && z1 > z2 - d/2
}