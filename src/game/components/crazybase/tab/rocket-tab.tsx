import { Badge, Button, Card, ListGroup, ListGroupItem, Stack } from "react-bootstrap";
import { GoodsContainerI, GoodsHelper, RocketDescriptionI, RocketOnBoardI, RocketTypeE } from "../../../decl";
import { FinalGameData } from "../../../final-game-data";

export function CrazyBaseRocketTab(props: {
    userId: string,
    rocketsOnBoard: RocketOnBoardI[],
    visible: boolean,
    baseGoods: GoodsContainerI,
    onSelectRocket: (type: RocketTypeE) => void,
    onBuyRocket: (type: RocketTypeE) => void
}) {
    const selectedRocket = props.rocketsOnBoard.find(r => r.selectedUsers.includes(props.userId))?.type
    return <div className={"d-flex flex-wrap justify-content-center" + (props.visible ? '' : ' d-none')}>
        {
            FinalGameData.rocketDescriptons?.map((des: RocketDescriptionI) => {
                const rocketOnBoard = props.rocketsOnBoard.find(r => r.type == des.type)
                const isSelected = selectedRocket == des.type
                const freeRockets = rocketOnBoard ? (rocketOnBoard.numberOf - rocketOnBoard.selectedUsers.length) : 0

                return <RocketTypeCard
                    baseGoods={props.baseGoods}
                    description={des}
                    isSelected={isSelected}
                    freeRockets={freeRockets}
                    onSelectRocket={props.onSelectRocket}
                    onBuyRocket={props.onBuyRocket}
                />
            })
        }
    </div>
}

function rocketDescriptionToPropsList(des: RocketDescriptionI): string[][] {
    return [
        ...des.props.cost.amounts.filter(a => a[1] !== 0).map(a => [''+a[0]+' Price', ''+a[1]+' u3', 'secondary']),
        ['Cargo Area Space', ''+des.props.cargoAreaSpace+' u3', 'primary'],
        ['Mass', ''+des.props.mass+' t', 'primary']
    ]
}

function RocketTypeCard(props: {
    description: RocketDescriptionI,
    isSelected: boolean,
    freeRockets: number,
    baseGoods: GoodsContainerI,
    onSelectRocket: (type: RocketTypeE) => void,
    onBuyRocket: (type: RocketTypeE) => void
}) {
    return <Card style={{ width: '22rem' }} className="shadow-lg bg-dark text-light mx-2 mb-4 d-inline">
        <Card.Img variant="top" src={props.description.img} />

        <Card.Body>
            <Card.Title>{props.description.name}</Card.Title>

            <Card.Text>
                {
                    props.description.description
                }
            </Card.Text>

            <ListGroup className="list-group-flush mt-1 mb-3">
                {
                    [
                        ...rocketDescriptionToPropsList(props.description),
                        ['Free Rockets on Board', ''+props.freeRockets, (props.freeRockets === 0 ? 'danger' : 'success')]
                    ].map(it => {
                        console.log('render it[3]:' + it[2])
                        return <ListGroupItem className="bg-dark text-light">
                            <div className="d-flex justify-content-between">
                                <span className="fs-6">{it[0]}</span>
                                <span className="fs-5"><Badge bg={it[2]}>{it[1]}</Badge></span>
                            </div>
                        </ListGroupItem>
                    })
                }
            </ListGroup>

            <div className="d-flex justify-content-between">
                <Button 
                    disabled={props.freeRockets === 0}
                    variant={(props.isSelected ? '' : 'outline-') + 'success'}
                    onClick={() => {if (!props.isSelected) props.onSelectRocket(props.description.type)}}
                >{props.isSelected ? <svg className="me-2 bi bi-check-lg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg> : undefined}
                    Select{props.isSelected ? 'ed' : ''}
                </Button>

                <Button 
                    variant="outline-primary"
                    className="fw-bold"
                    disabled={!GoodsHelper(props.baseGoods).isHigherThan(props.description.props.cost)}
                    onClick={() => props.onBuyRocket(props.description.type)}
                >
                    Build a {props.description.name}
                </Button>
            </div>
        </Card.Body>
    </Card>
}