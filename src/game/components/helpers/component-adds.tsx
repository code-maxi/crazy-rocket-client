import React from "react";
import { Badge, Button, Card, ListGroup, Stack } from "react-bootstrap";

export function CrazyBlockquote(props: {
    style?: string,
    addedClassNames?: string,
    maxWidth?: string,
    backgroundOpacity?: number,
    children: React.ReactNode
}) {
    return <div 
        className={'d-block rounded border-start border-3 py-2 px-3 border-' + (props.style ? props.style : 'primary') + (props.addedClassNames ? ' '+props.addedClassNames : '')}
        style={{ backgroundColor: 'rgba(255,255,255,' + (props.backgroundOpacity ? ''+props.backgroundOpacity : '0.2') + ')', maxWidth: props.maxWidth }}
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
                <div key={index} className={"d-flex p-2 flex-row justify-content-between align-items-center" + (index === props.items.length-1 ? '' : ' border-bottom border-secondary')}>
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
        style={{ maxWidth: 'max-content' }}
    >
        { icon }
        <div>
            { props.children }
        </div>
    </div>
}

interface CrazyCardButtonI {
    spaceToTheLeft?: boolean,
    disabled?: boolean,
    text: string,
    style?: string,
    checkIcon?: boolean,
    onClick: () => void
}

export function CrazyToggleButton(props: {
    text: string,
    toggled: string,
    variant: string,
    onToggle: (t: boolean) => void
    classNames?: string,
    toggleCheck?: boolean
}) {
    return <Button 
        className={props.classNames} 
        variant={(props.toggled ? '' : 'outlined-') + props.variant}
        onClick={() => props.onToggle(!props.toggled)}
    >
        {props.toggleCheck === true && props.toggled ? <svg className="me-2 bi bi-check-lg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg> : undefined}
        {props.text}
    </Button>
}

export function CrazyCard(props: {
    title: string,
    text: string,
    classNames?: string,
    width?: string,
    children?: React.ReactNode,
    onHover?: (on: boolean) => void,
    img?: string
}) {
    return <Card 
        onMouseEnter={() => {if (props.onHover) props.onHover(true)}} 
        onMouseLeave={() => {if (props.onHover) props.onHover(false)}}
        style={{ width: props.width }}
        className={"shadow-lg" + (props.classNames ? ' '+props.classNames : '')}
    >
        {props.img ? <Card.Img variant="top" src={props.img} /> : undefined}

        <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <Card.Text>
                {props.text}
            </Card.Text>

            {props.children}
        </Card.Body>
    </Card>
}