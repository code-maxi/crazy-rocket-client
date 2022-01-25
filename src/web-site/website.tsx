import { Button } from "@material-ui/core";
import React from "react";
import { serverHostname } from "../common/adds";
import { GalaxyI } from "../common/declarations";
import { GalaxyList } from "./choose-galaxy";

export class WebSite extends React.Component<{}, { list: GalaxyI[] }> {
    constructor(p: any) {
        super(p)
        this.state = { list: [] }
        this.galaxiesRequest()
    }
    galaxiesRequest() {
        const url = serverHostname()
        console.log('Server-URL: ' + url)
        $.getJSON(url + '/get-galaxies', data => {
            console.log('recieved galaxies data:')
            console.log(data)
            this.setState({ list: data.list })
        })
    }
    render(): React.ReactNode {
        return <div>
            <Button
                onClick={() => {    
                    $.post({
                        url: "http://localhost:1112/create-galaxy",
                        // The key needs to match your method's input parameter (case-sensitive).
                        data: JSON.stringify({
                            name: "jonas",
                            password: "jonasp"
                        }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){ console.log('success'); console.log(data) },
                        error: function(errMsg) {
                            console.log('error'); console.log(errMsg.responseJSON)
                        }
                    });
                }}
            >Neue Galaxy Erstellen 2</Button>
            <Button
                onClick={() => {    
                    $.ajax({
                        method: "DELETE",
                        url: "http://localhost:1112/delete-galaxy",
                        // The key needs to match your method's input parameter (case-sensitive).
                        data: JSON.stringify({
                            name: "jonas",
                            password: "jonasp"
                        }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){ alert(data) },
                        error: function(errMsg) {
                            alert(errMsg);
                        }
                    });
                }}
            >Galaxy Entfernen</Button>
            <GalaxyList list={this.state.list} onJoin={() => {}} />
        </div>
    }
}