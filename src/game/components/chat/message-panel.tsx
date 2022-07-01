import React, { useEffect } from "react"
import { Collapse } from "react-bootstrap"
import { MessageDataI } from "../../decl"
import { paintProcessBar } from "../../paint/paint_tools"

export function MessagePanel(props: {
    massages: [MessageDataI, boolean][],
    transitionDuration: number,
    messageBoxHeight: number,
    onEffecDone: () => void,
    zIndex: number
}) {
    React.useEffect(() => {
        setTimeout(() => {
            props.onEffecDone()
        }, props.transitionDuration)
    })
    const viewHeight = props.messageBoxHeight*0.75

    return <div 
            style={{
                zIndex: props.zIndex,
                position: 'fixed',
                left: '50vw',
                bottom: 'calc(100vh - '+(viewHeight)+'px)',
                width: '50vw',
                minWidth: '200px',
                maxWidth: '500px',
                transform: 'translate(-50%,0)'
            }} 
            className="d-flex flex-column align-items-center justify-content-end"
        >
        {props.massages.map((m,i) => (
            <MessagePanelItem
                transitionDuration={props.transitionDuration}
                message={m[0]}
                isAdded={m[1]}
                isLast={props.massages.length-1 === i}
                key={i}
            />
        ))}
    </div>
}

const messagePanelItemWidth = '400px'

function MessagePanelItem(props: {
    message: MessageDataI,
    isLast: boolean,
    transitionDuration: number,
    isAdded: boolean
}) {
    const [collapseState, setCollapseState] = React.useState(props.isAdded ? false : true)

    useEffect(() => {
        if (props.isAdded) setCollapseState(true)
    })

    return <Collapse timeout={props.transitionDuration} in={collapseState} className={props.isAdded && !collapseState ? 'd-none' : 'd-block'}>
        <div className="d-flex w-100 flex-column align-items-center" style={{width: 'max-content'}}>
            <div 
                className={"d-flex " + (props.message.type ? 'mb-2' : 'mb-1')}
            >
                <span style={{height:'max-content', flexShrink:'0'}} className={"d-inline-flex align-items-center fs-6 d-inline-block me-2 fw-bold" + (props.message.type ? ' bg-' + props.message.type + ' bg-opacity-75 px-2 py-1 rounded' : '')}>
                    {props.message.dangerIcon ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg> : undefined} <span>{props.message.type ? props.message.ownerName : undefined}</span>
                </span>
                
                <div className="d-inline-flex flex-grow-1 fs-6 px-2 py-1 rounded" style={{backgroundColor:'rgba(0,0,0,0.75)'}}>
                    {!props.message.type ? <span className="fw-bold me-3">{props.message.ownerName}</span> : undefined}
                    {props.message.text}
                </div>
            </div>
        </div>
    </Collapse>
}

/*

{
                !props.isLast ? <div className="d-block bg-secondary mb-3" style={{width: '80%', height: '1px'}} /> : undefined
            }

*/