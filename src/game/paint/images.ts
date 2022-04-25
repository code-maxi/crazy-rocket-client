export let images: [string, HTMLImageElement][] = []

export function getImage(s: string) {
    const i = images.find(o => o[0] === s)
    return i ? i[1] : images.find(o => o[0] === 'noimage.png')![1]
}

export function loadImages(s: string[]) {
    s.forEach(i => {
        const src = "images/" + i
        let image = new Image()
        image.src = src
        images.push([i, image])
    })

    console.log('images: ')
    images.forEach(i => console.log(i))
}