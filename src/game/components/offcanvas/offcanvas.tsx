import { CrazyTeamStateI } from "../../decl"
import { Badge, Offcanvas } from "react-bootstrap"

export function CrazyOffCanvas(props: {
    baseStates: string,
    teams: CrazyTeamStateI[],
    isShowed: boolean,
    onHide: () => void
}) {
    return <Offcanvas show={props.isShowed} backdrop={false} onHide={() => props.onHide()}>
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>CrazyInfo</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            
        </Offcanvas.Body>
    </Offcanvas>
}

function CrazyOffCanvasList(props: {
    items: string[]
}) {
    return <div className="d-flex flex-column">
        {
            props.items.map((i, index) => (
                <div key={index} className={"d-flex p-2 flex-row justify-content-between align-items-center"}>
                    <span>{i[0]}</span>
                    
                    <span className={'fw-bold ' + (i[2] ? 'fs-5' : 'fs-6')}>
                        { i[2] ? <Badge bg={i[2]}>{i[1]}</Badge> : i[1] }
                    </span>
                </div>                
            ))
        }
    </div>
}