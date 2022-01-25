import { RocketI } from "../../common/declarations";
import { drawableObject } from "./drawableObject";

/*
export let clientRocket = {
    sendTouchingObjects() {
        const o = currentRocket
        
        if (o !== undefined) {
            let to: GalaxyTouchingObjectsI = {
                asteroids: []
            }
            gameData.objects.asteroids.forEach(a => {
                if ((new Geo(o.geo)).insect(new Geo(a.geo), 'circle')) {
                    to.asteroids.push(a)
                }
            })
    
            client.send('touching objects', to, true) // DONE: Server react to touching objects...
        }
    }
}


export function myRocket() {
    const result = gameData.objects.rockets.find(r => r.id === props.id)
    return result ? result : null
}
*/

export function rocketHelper(o: RocketI) {
    return {
        paint(g: CanvasRenderingContext2D) {
            drawableObject({
                ...o,
                img: 'rocket.png'
            }).paint(g)
        }
    }
}