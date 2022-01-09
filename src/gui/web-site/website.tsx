import React from "react";
import { serverHostname } from "../../client";
import { GalaxyWithoutObjectsI } from "../../common/declarations";
import { GalaxyList } from "./choose-galaxy";

export class WebSite extends React.Component<{}, { list: GalaxyWithoutObjectsI[] }> {
    constructor(p: any) {
        super(p)
        this.state = { list: [] }
        this.galaxiesRequest()
    }
    galaxiesRequest() {
        const url = serverHostname()
        $.getJSON(url + '/get-galaxies', data => {
            console.log('recieved data:')
            console.log(data)
            this.setState({ list: data.list })
        })
    }
    render(): React.ReactNode {
        return <GalaxyList list={this.state.list} onJoin={() => {}} />
    }
}