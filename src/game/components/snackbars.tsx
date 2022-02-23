import { AlertColor, Button, Slide, Stack } from "@material-ui/core";
import { Alert, Snackbar } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import React, { ReactElement } from "react";

export let snackbars = new Map<string, SnackbarContainer>()

export function alertSnackbar() { return snackbars.get('alert')! }
export function confirmSnackbar() { return snackbars.get('confirm')! }

export interface SnackbarMessage {
    message?: string
    hidingDuration?: number
    content?: (closeMe: () => void) => ReactElement
    action?: (closeMe: () => void) => ReactElement
}

export class SnackbarContainer extends React.Component<{
    vertical: 'top' | 'bottom',
    horizontal: 'left' | 'right',
    id: string
}, {
    snackVisible: boolean
}> {
    private snacks: SnackbarMessage[] = []

    constructor(props: any) {
        super(props)
        this.state = { snackVisible: false }
        snackbars.set(this.props.id, this)
    }

    addSnack(snack: SnackbarMessage) {
        this.snacks.push(snack)
        if (this.snacks.length === 1) this.showNextSnack()
    }

    alert(
        severity: AlertColor, 
        message: string,
        duration?: number, 
        onClose?: () => void
    ) { // TODO: Integrate Lan        
        this.addSnack({
            hidingDuration: duration ? duration : 3000,
            content: (cb) => (
                <Alert severity={ severity } variant="filled" onClose={ () => { cb(); if (onClose) onClose() } }>
                    { message }
                </Alert>
            )
        })
    }

    confirm(
        message: string,
        onClose: (b: boolean) => void,
        jesText?: string, 
        noText?: string
    ) { // TODO: Integrate Lan
        this.addSnack({
            message: message,
            action: (cb) => (
               <Stack>
                    <Button 
                        color="success" 
                        variant="contained"
                        onClick={() => { onClose(true); cb() }}
                    >{ jesText ? jesText : 'Yes' }</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => { onClose(false); cb() }}
                    >{ noText ? noText : 'No' }</Button>
                </Stack>       
            )
        })
    }

    closeOne() {
        this.setState({ snackVisible: false })
        this.snacks.shift()
                
        if (this.snacks.length > 0) { setTimeout(() => {
            this.showNextSnack()
        }, 500) }
    }

    showNextSnack() {
        this.setState({ snackVisible: true })
        const currentSnack = this.snacks[0]
        setTimeout(
            () => { if (this.snacks[0] === currentSnack) this.closeOne() }, 
            this.snacks[0]!.hidingDuration!
        )
    }

    render() {
        const empty = this.snacks.length === 0
        return (
            <div>
                <Snackbar
                    open={!empty && this.state.snackVisible}
                    anchorOrigin={{ vertical: this.props.vertical, horizontal: this.props.horizontal }}
                    TransitionComponent={
                        (props: TransitionProps) => 
                            <Slide direction={ this.props.vertical === 'top' ? 'up' : 'down' } { ...props }/> 
                    }
                    action={
                        !empty && this.snacks[0].action ? (
                            this.snacks[0].action(() => this.closeOne())
                        ) : undefined
                    }
                >
                    {
                        !empty && this.snacks[0].content ? (
                            this.snacks[0].content(() => this.closeOne())
                        ) : undefined
                    }
                </Snackbar>
            </div>
        )
    }
}