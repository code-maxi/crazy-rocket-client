import React from "react";
import { debugGame } from "../..";
import { PaintGameWorldI } from "../paint/paint_declarations";
import { CrazyWorld } from "./crazyworld";
import { GalaxyLogin, GalaxyLoginPropsI } from "./galaxy-login"

interface GalaxyRootStateI {
    displayType: 'login' | 'game'
}

interface GalaxyRootGUIPropsI extends GalaxyLoginPropsI {
    debugWorld?: PaintGameWorldI
}

export class GalaxyRootGUI extends React.Component<GalaxyRootGUIPropsI, GalaxyRootStateI> {
    static instance: GalaxyRootGUI
    
    constructor(p: any) {
        super(p)
        this.state = { displayType: 'game' }
        GalaxyRootGUI.instance = this
    }

    setCanvasDisplay() { this.setState({ ...this.state, displayType: 'game' }) }

    render(): React.ReactNode {
        return (
            (this.state.displayType === 'login' && !this.props.debugWorld) ? 
                <GalaxyLogin { ...this.props } />
                : <CrazyWorld />
        )
    }
}