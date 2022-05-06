export function sumArray<T>(list: T[], valueF: (p: T) => number) {
    let res = 0
    list.forEach(it => { res += valueF(it) })
    return res
}

export function forIch<T>(i: number, convert: (i: number) => T) {
    let res: T[] = []
    for (let e = 0; e < i; e ++) res.push(convert(e))
    return res
}