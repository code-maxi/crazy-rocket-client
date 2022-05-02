import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import React from "react";
import { CrazyBaseStateI, CrazyGoodE, GoodsContainerI, RocketTypeE } from "../../decl";
import Table from 'react-bootstrap/Table'
import { CrazyBlockquote } from '../helpers/component-adds'
import { Badge } from 'react-bootstrap'
import { CrazyBaseTransferTab } from './tab/transfer-tab'
import { CrazyBaseOverviewTab } from './tab/overview-tab'
import { CrazyBaseRocketTab } from './tab/rocket-tab'

export interface CrazyBaseModalI {
    baseState?: CrazyBaseStateI,
    rocketGoods: GoodsContainerI,
    maxRocketSpace: number,
    userId: string,
    visible: boolean,
    onBuyGood: (type: CrazyGoodE, amount: number) => void
    onSelectRocket: (type: RocketTypeE) => void,
    onBuyRocket: (type: RocketTypeE) => void
}

enum CrazyBaseModalTab {
    OVERVIEW = 'Overview', 
    DATA_TRANSFER = 'Data Transfer', 
    BASE_EXTENSIONS = 'Extend Base', 
    ROCKET_UPDATES = 'Update Rocket' 
}

const crazyBaseTabIntroduction = new Map<CrazyBaseModalTab, string>([
    [ CrazyBaseModalTab.OVERVIEW, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat." ],
    [ CrazyBaseModalTab.DATA_TRANSFER, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat." ],
    [ CrazyBaseModalTab.BASE_EXTENSIONS, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat." ],
    [ CrazyBaseModalTab.ROCKET_UPDATES, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat." ]
])

export function CrazyBaseModal(props: CrazyBaseModalI) {
    const [tabValue, setTabValue] = React.useState<CrazyBaseModalTab>(CrazyBaseModalTab.OVERVIEW)

    return props.baseState ? <Modal
            show={props.visible}
            centered 
            backdrop="static"
            keyboard={false}
            size="lg"
            fullscreen="lg-down"
        >

        <Modal.Header className="bg-dark text-light">
            <div className="d-flex justify-content-between w-100 align-items-center">
                <h4 style={{ minWidth: '150px' }}><Badge bg="secondary">{tabValue}</Badge></h4>
                
                <h3>{'Base ' + props.baseState?.name}</h3>
                
                <Button variant="danger">
                    Leave Base 
                </Button>
            </div>
        </Modal.Header>

        <Modal.Body className="bg-dark text-light overflow-auto" style={{ minHeight: '40vh', height: 'calc(100vh - 200px)', backgroundColor: 'black' }}>
            <div className="d-flex flex-column justify-content-stretch">
                <CrazyBlockquote addedClassNames='mb-4 align-self-center' maxWidth="550px">
                    {crazyBaseTabIntroduction.get(tabValue)}
                </CrazyBlockquote>

                <CrazyBaseOverviewTab 
                    visible={tabValue === CrazyBaseModalTab.OVERVIEW}
                    baseState={props.baseState}
                />

                <CrazyBaseTransferTab
                    visible={tabValue === CrazyBaseModalTab.DATA_TRANSFER}
                    rocketGoods={props.rocketGoods}
                    baseGoods={props.baseState.goods}
                    maxHumanBaseSpace={props.baseState.maxHumanSpace}
                    maxObjectBaseSpace={props.baseState.maxObjectSpace}
                    maxRocketSpace={props.maxRocketSpace}
                    transferData={(t, a) => console.log('Data from type ' + t + ' transferred!')}
                />

                <CrazyBaseRocketTab
                    visible={tabValue === CrazyBaseModalTab.ROCKET_UPDATES}
                    userId={props.userId}
                    rocketsOnBoard={props.baseState.rocketsOnBoard}
                    onBuyRocket={props.onBuyRocket}
                    onSelectRocket={props.onSelectRocket}
                    baseGoods={props.baseState.goods}
                />
            </div>
        </Modal.Body>

        <Modal.Footer className="bg-dark text-light">
            <ButtonGroup>
                { Object.values(CrazyBaseModalTab).map(o => (
                    <Button 
                        variant={(tabValue === o ? '' : 'outline-') + 'secondary btn-small'} 
                        onClick={ () => setTabValue(o) }
                        className={tabValue === o ? 'fw-bold' : ''}
                    >
                        { o }
                    </Button>
                )) }
            </ButtonGroup>
        </Modal.Footer>
    </Modal> : <React.Fragment />
}