import { IDable } from "./declarations"

export function currentHostname() {
    const url = new URL(window.location.href)
    const res = url.protocol + '://' + url.hostname
    return res
}

export function serverHostname() {
    return currentHostname()
}

export function log(who: string, s?: any, sn?: string, dataNewLine?: boolean, seperator?: boolean) {
    console.log(who + ' logs: ' + s ? s : '')
    if (sn) console.log(sn)
    if (seperator === true || seperator === undefined) console.log()
}

export function removeItem<T>(array: T[], e: T): boolean {
    const index = array.indexOf(e);
    if (index > -1) {
        array.splice(index, 1)
        return true
    } return false
}
export function logUndefined(any: any | null | undefined) {
    return any ? any : (any === null ? 'null' : 'undefined')
}

export class Listener<T> {
    private listeners: ((it: T) => void)[] = []
    value: T
    constructor(v: T) {
        this.value = v  
        this.set(v)
    }
    on(f: (it: T) => void) { this.listeners.push(f) }
    set(it: T) {
        this.value = it
        this.listeners.forEach(f => f(it))
    }
}

export function migrateObjectData<T extends IDable>(arr: T[], migratingArray: T[]) {
    return arr.map(r => {
        const replacement = migratingArray.find(o => o.id === r.id)
        return replacement ? replacement : r
    }) 
}
