import React from "react";

export function CrazyBackdrops(props: {
    size: string,
    zIndex: number,
    color: string
}) {
    return <React.Fragment>
        <div style={{
                width: '100vw',
                height: props.size,
                position: 'fixed',
                top: '0',
                left: '0',
                zIndex: props.zIndex,
                backgroundImage: 'linear-gradient('+props.color+', rgba(0,0,0,0))'
            }} className="d-block" />

        <div style={{
                width: props.size,
                height: '100vh',
                position: 'fixed',
                top: '0',
                left: '0',
                zIndex: props.zIndex,
                backgroundImage: 'linear-gradient(90deg, '+props.color+', rgba(0,0,0,0))'
            }} className="d-block" />
        
        <div style={{
                width: '100vw',
                height: props.size,
                position: 'fixed',
                bottom: '0',
                left: '0',
                zIndex: props.zIndex,
                backgroundImage: 'linear-gradient(rgba(0,0,0,0), '+props.color+')'
            }} className="d-block" />
        
        <div style={{
                width: props.size,
                height: '100vh',
                position: 'fixed',
                top: '0',
                right: '0',
                zIndex: props.zIndex,
                backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0), '+props.color+')'
            }} className="d-block" />
    </React.Fragment>
}

