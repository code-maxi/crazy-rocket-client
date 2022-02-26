import React from "react";
import { RocketCanvas } from "./canvas";
import { GalaxyLogin } from "./galaxy-login"

interface GalaxyRootStateI {
    displayType: 'login' | 'canvas'
}

export class GalaxyRootGUI extends React.Component<{ noGalaxySpecified: boolean }, GalaxyRootStateI> {
    static instance: GalaxyRootGUI
    constructor(p: any) {
        super(p)
        this.state = { displayType: 'login' }
        GalaxyRootGUI.instance = this
    }

    setCanvasDisplay() { this.setState({ ...this.state, displayType: 'canvas' }) }

    render(): React.ReactNode {
        return (
            this.state.displayType === 'login' ? 
                <GalaxyLogin noGalaxySpecifyed={ this.props.noGalaxySpecified } />
                : <RocketCanvas />
        )
    }
}