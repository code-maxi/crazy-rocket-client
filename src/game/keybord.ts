import { socketUser } from "./network/SocketUser"

export const keys = new Map<string, boolean>([
    ['ArrowUp', false],
    ['ArrowLeft', false],
    ['ArrowRight', false],
    ['Space', false],
    ['KeyL', false],
    ['KeyC', false]
])

export let keyListeners: ((e: KeyboardEvent, b: boolean) => void)[] = [
    (e, b) => {
        keys.set(e.code, b)
    }
]

export function keyListen() {
    document.body.onkeydown = (e: KeyboardEvent) => {
        if (keys.get(e.code) !== undefined && !keys.get(e.code)!) { 
            keyListeners.forEach(f => f(e, true))
        }
    }
    document.body.onkeyup = (e: KeyboardEvent) => {
        if (keys.get(e.code) !== undefined) { 
            keyListeners.forEach(f => f(e, false))
        }
    }
}