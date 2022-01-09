import { client } from "./client"

export const keys = new Map<string, boolean>([
    ['ArrowUp', false],
    ['ArrowLeft', false],
    ['ArrowRight', false],
    ['Space', false],
    ['KeyL', false],
    ['KeyC', false]
])

export let listeners: ((e: KeyboardEvent, b: boolean) => void)[] = [
    (e, b) => {
        keys.set(e.code, b)
    },

    () => {
        let ka: [string, boolean][] = []
        keys.forEach((v, k) => ka.push([k, v]))
        client.send('keyboard data', ka) // DONE: Server react on keyboard data!
    }
]

export function keyListen() {
    document.body.onkeydown = (e: KeyboardEvent) => {
        if (keys.get(e.code) !== undefined && !keys.get(e.code)!) { 
            listeners.forEach(f => f(e, true))
        }
    }
    document.body.onkeyup = (e: KeyboardEvent) => {
        if (keys.get(e.code) !== undefined) { 
            listeners.forEach(f => f(e, false))
        }
    }
}