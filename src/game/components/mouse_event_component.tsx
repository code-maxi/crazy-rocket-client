import React from "react"

export function CrazyMouseEventComponent(props: {
    onmousemove: (evt: MouseEvent) => void,
    onmousedown: (evt: MouseEvent) => void
    onmouseup: (evt: MouseEvent) => void
    onmouseleave: (evt: MouseEvent) => void
    onmouseenter: (evt: MouseEvent) => void
    onwheel: (evt: WheelEvent) => void
}) {
    const divRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        divRef.current!.onmousedown = (evt: MouseEvent) => props.onmousedown(evt)
        divRef.current!.onmousemove = (evt: MouseEvent) => props.onmousemove(evt)
        divRef.current!.onmouseup = (evt: MouseEvent) => props.onmouseup(evt)
        divRef.current!.onmouseleave = (evt: MouseEvent) => props.onmouseleave(evt)
        divRef.current!.onmouseenter = (evt: MouseEvent) => props.onmouseenter(evt)
        divRef.current!.onwheel = (evt: WheelEvent) => props.onwheel(evt)
    })

    return <div style={{
        width: '100vw',
        height: '100vh',
        zIndex: 3
    }} ref={divRef} />
}