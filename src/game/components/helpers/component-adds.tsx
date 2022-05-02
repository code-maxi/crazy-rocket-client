import React from "react";
import { Badge, ListGroup } from "react-bootstrap";

export function CrazyBlockquote(props: {
    style?: string,
    addedClassNames?: string,
    maxWidth?: string,
    children: React.ReactNode
}) {
    return <div 
        className={'d-block rounded border-start border-3 py-2 px-3 border-' + (props.style ? props.style : 'primary') + (props.addedClassNames ? ' '+props.addedClassNames : '')}
        style={{ backgroundColor: 'rgba(255,255,255,0.05)', maxWidth: props.maxWidth }}
    >
        {props.children}
    </div>
}

export function CrazyTableList(props: {
    classNames?: string,
    items: string[][]
}) {
    return <div className="d-flex flex-column">
        {
            props.items.map((i, index) => (
                <div className={"d-flex p-2 flex-row justify-content-between align-items-center bg-dark text-light" + (index === props.items.length-1 ? '' : ' border-bottom border-secondary')}>
                    <span>{i[0]}</span>
                    
                    <span className={'fw-bold ' + (i[2] ? 'fs-5' : 'fs-6')}>
                        { i[2] ? <Badge bg={i[2]}>{i[1]}</Badge> : i[1] }
                    </span>
                </div>                
            ))
        }
    </div>
}

const alertVariantIcons = new Map<string, React.ReactNode>([
    ['danger', <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>],
    ['primary', <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 bi bi-info-circle-fill" viewBox="0 0 16 16">
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
  </svg>]
])

export function Alert(props: {
    children: React.ReactNode,
    classNames?: string,
    variant: string
}) {
    const icon = alertVariantIcons.get(props.variant)
    return <div 
        className={'d-flex bg-opacity-50 align-items-start flex-row px-3 py-2 rounded bg-' + props.variant + (props.classNames ? ' '+props.classNames : '')}
        style={{ width: 'max-content' }}
    >
        { icon }
        <div>
            { props.children }
        </div>
    </div>
}