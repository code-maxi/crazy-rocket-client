export function sumArray<T>(list: T[], valueF: (p: T) => number) {
    let res = 0
    list.forEach(it => { res += valueF(it) })
    return res
}