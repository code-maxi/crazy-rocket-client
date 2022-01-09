import { send } from "process";
import { client, currentRocket, props } from "../../client";
import { GalaxyObjectsI, GalaxyTouchingObjectsI, RocketI } from "../../common/declarations";
import { Geo, inRange } from "../../common/math";
import { keys } from "../keybord";
import { drawableObject } from "./drawableObject";
import { galaxyData, migrateObjectData } from "./galaxy";

export let clientRocket = {
    sendTouchingObjects() {
        const o = currentRocket
        
        if (o !== undefined) {
            let to: GalaxyTouchingObjectsI = {
                asteroids: []
            }
            galaxyData.objects.asteroids.forEach(a => {
                if ((new Geo(o.geo)).insect(new Geo(a.geo), 'circle')) {
                    to.asteroids.push(a)
                }
            })
    
            client.send('touching objects', to, true) // DONE: Server react to touching objects...
        }
    }
}

export function myRocket() {
    const result = galaxyData.objects.rockets.find(r => r.id === props.id)
    return result ? result : null
}

export function rocketHelper(o: RocketI) {
    return {
        paint(g: CanvasRenderingContext2D) {
            drawableObject(o).paint(g)
        }
    }
}