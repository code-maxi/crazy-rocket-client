import React from "react";
import { Badge, Button, ButtonGroup, InputGroup } from "react-bootstrap";

const chatIcon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 bi bi-chat-left-dots" viewBox="0 0 16 16">
    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
</svg>

export function CrazyChatModule(props: {
    message: string,
    sendMode: 'to-all' | 'to-me' | null,
    cursorOn: boolean,
    onCanelClicked: () => void,
    onFinishClicked: () => void,
    onSelectSendMode: (p: 'to-all' | 'to-me') => void,
    zIndex: number
}) {
    return  <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '0',
        zIndex: props.zIndex
    }} className="d-flex w-100 justify-content-center align-items-center">
        {
            !props.sendMode ? <ButtonGroup className="shadow-lg">
                <Button variant={"primary"} onClick={() => {
                    if (!props.sendMode) props.onSelectSendMode('to-me')
                }}>
                    {chatIcon} Message (Shift+C)
                </Button>

                <Button variant={"secondary"} onClick={() => {
                    if (!props.sendMode) props.onSelectSendMode('to-all')
                }}>
                    {chatIcon} Message to All (Alt+C)
                </Button>
            </ButtonGroup> : <InputGroup className="w-auto">
                    <Button disabled={props.sendMode === 'to-me' && props.message !== '' } variant="outline-danger" onClick={() => props.onCanelClicked()}>
                        Cancel (ESC)
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
                    </Button>

                <InputGroup.Text>
                    <span className="me-2">{props.message === '' ? 'Type your message ' + (props.sendMode === 'to-me' ? '' : ' to all ') + 'now.' : 'Message: '}</span>
                    {props.message !== '' ? <span className="fw-bold">{props.message}</span> : undefined }
                    <span className="fs-4" style={{marginTop:'-6px'}}>{props.cursorOn ? '▮' : '▯'}</span>
                </InputGroup.Text>

                <Button variant="success" disabled={props.message === ''} onClick={() => {
                        props.onFinishClicked()
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2 bi bi-check" viewBox="0 0 16 16">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                    </svg>
                    Finish (ENTER)
                </Button>
            </InputGroup>
        }
    </div>
}