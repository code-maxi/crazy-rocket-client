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
    ang: number
    width: number
    height: number

    constructor(g?: GeoI) {
        if (g !== undefined) {
            this.pos = Vector.fromData(g.pos)
            this.ang = g.ang
            this.width = g.width
            this.height = g.height
        } else {
            this.pos = new Vector(0,0)
            this.ang = 0
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
            angle: this.ang
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
            ang: 0
        })
    }
}

export function vec(x: number, y: number): VectorI {
    return { x: x, y: y }
}

    
export const V = {
    vec(x: number, y: number): VectorI { return { x: x, y: y } },
    
    zero(): VectorI { return {x:0,y:0} },
    al(a: number, l: number) { return vec(Math.cos(a) * l, Math.sin(a) * l) },
    
    delta(a: VectorI, b: VectorI): VectorI { return { x: b.x-a.x, y: b.y-a.y } },
    length(v: VectorI): number { return Math.sqrt(v.x*v.x + v.y*v.y) },

    distance(a: VectorI, b: VectorI) { return this.length(this.delta(a,b)) },
    equals(a: VectorI, b: VectorI) { return a.x === b.x && a.y == b.y },
    
    mul(a: VectorI, s: number): VectorI { return { x: a.x*s, y: a.y*s } },
    mulVec(a: VectorI, b: VectorI): VectorI { return { x: a.x*b.x, y: a.y*b.y } },
    divVec(a: VectorI, b: VectorI): VectorI { return { x: a.x/b.x, y: a.y/b.y } },
    half(v: VectorI): VectorI { return this.mul(v, 0.5) },
    
    add(a: VectorI, b: VectorI): VectorI { return { x: a.x + b.x, y: a.y + b.y } },
    sub(a: VectorI, b: VectorI): VectorI { return { x: a.x - b.x, y: a.y - b.y } },
    addX(a: VectorI, s: number): VectorI { return { x: a.x + s, y: a.y } },
    addY(a: VectorI, s: number): VectorI { return { x: a.x, y: a.y + s } },
    
    mirrorX(a: VectorI) { return vec(-a.x, a.y)  },
    mirrorY(a: VectorI) { return vec(a.x, -a.y)  },

    negate(a: VectorI) { return vec(-a.x, -a.y) },

    addAll(v: VectorI[]) {
        let sum = this.zero()
        v.forEach(i => sum = this.add(sum, i))
        return sum
    },

    normalRight(v: VectorI): VectorI { return { x: v.y, y: -v.x } },
    e(v: VectorI): VectorI { return this.mul(v, 1/this.length(v)) },
    el(v: VectorI, l: number) { return this.mul(this.e(v), l) },

    square(a: number): VectorI { return { x:a,y:a } },
    scalarProduct(a: VectorI, b: VectorI) { return a.x*b.x + a.y*b.y },

    abs(v: VectorI): VectorI { return { x: Math.abs(v.x), y: Math.abs(v.y) } },
    trunc(v: VectorI): VectorI { return { x: Math.trunc(v.x), y: Math.trunc(v.y) } },

    includesPoint(point: VectorI, pos: VectorI, size: VectorI) {
        const pos2 = this.add(pos, size)
        return point.x >= pos.x && point.y >= pos.y && point.x <= pos2.x && point.y <= pos2.y
    }
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
            return V.length(V.delta(g2.pos, g1.pos)) < (G.longestEdge(g1) + G.longestEdge(g2)) * (skalar ? skalar : 1)
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
            ang: 0
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