import React from "react";
import { PaintGameWorldI } from "../paint/paint_declarations";
import { RocketCanvas } from "./canvas";
import { GalaxyLogin, GalaxyLoginPropsI } from "./galaxy-login"

interface GalaxyRootStateI {
    displayType: 'login' | 'canvas'
}

interface GalaxyRootGUIPropsI extends GalaxyLoginPropsI {
    debugWorld?: PaintGameWorldI
}

export class GalaxyRootGUI extends React.Component<GalaxyRootGUIPropsI, GalaxyRootStateI> {
    static instance: GalaxyRootGUI
    
    constructor(p: any) {
        super(p)
        this.state = { displayType: 'login' }
        GalaxyRootGUI.instance = this
    }

    setCanvasDisplay() { this.setState({ ...this.state, displayType: 'canvas' }) }

    render(): React.ReactNode {
        return (
            (this.state.displayType === 'login' && !this.props.debugWorld) ? 
                <GalaxyLogin { ...this.props } />
                : <RocketCanvas debugWorld={this.props.debugWorld} />
        )
    }
}