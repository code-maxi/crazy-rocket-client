import { RocketTypeI } from "./declarations";

export type rocketTypes = 'standart-rocket'

export function rocketTypes(s: rocketTypes) {
    const arr: RocketTypeI[] = [
        {
            id: 'standart-rocket',
            fires: [
                {
                    dx: 0, dy: 0.5,
                    fireSpeed: 0.6,
                    startWidth: 30,
                    startHeight: 40,
                    plusWidth: 0,
                    plusHeight: 0,
                    img: 'fire.png'
                }
            ],
            acceleratingSpeed: 0.1,
            turningSpeed: 0.05,
            standardZoom: 1,
            img: 'rocket.png',
            width: 70,
            height: 50
        }
    ]
    return arr.find(e => e.id === s)!
}