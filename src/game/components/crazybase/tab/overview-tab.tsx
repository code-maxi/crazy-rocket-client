import { sumArray } from '../../../other-adds'
import { Col, Container, Row, Stack, Table } from "react-bootstrap"
import { CrazyBaseStateI, GoodsHelper } from "../../../decl"
import React from 'react';
import { CrazyPieChart } from "../../helpers/crazy-charts"
import { Alert, CrazyTableList } from '../../helpers/component-adds';

interface PieDataI {
    labels: string[],
    datasets: any[]
}

export function CrazyBaseOverviewTab(props: {
    visible: boolean,
    baseState: CrazyBaseStateI
}) {
    const numberOfAllHuman = sumArray(props.baseState.human.humanCategories, hc => hc.numberOfHuman)
    const numberOfAllGoods = GoodsHelper(props.baseState.goods).sumGoods()

    const goodsGraphData = {
        labels: props.baseState.goods.amounts.map(a => a[0]),
        data: props.baseState.goods.amounts.map(a => (a[1] / numberOfAllGoods) * 100)
    }

    return <Container 
        className={'mt-3' + (props.visible ? '' : ' d-none')} 
        style={{ maxWidth: '700px' }}
    >
        <Row>
            <Col xs="auto" className="mb-5 pe-3">
                <h4 className='mb-4'>Warning Messages</h4>
                <Stack gap={2}>
                    {
                        props.baseState.warningAlerts.map(wa => <Alert variant="danger">
                            {wa}
                        </Alert>)
                    }
                </Stack>
            </Col>
        </Row>

        <Row>
            <Col xs={12} sm={6} className="mb-5 pe-3">
                <h4 className='mb-4'>Human Statistics</h4>
                <CrazyPieChart label="Human" data={ props.baseState.human.humanCategories.map(hc => [hc.id, hc.numberOfHuman]) } />
            </Col>
            <Col xs={12} sm={6} className="mb-5">
                <h4 className='mb-4'>Goods Statistics</h4>
                <CrazyPieChart label="Goods" data={ props.baseState.goods.amounts.map(hc => [''+hc[0], hc[1]]) } />
            </Col>
        </Row>

        <Row>
            <Col xs={12} sm={6} className="mb-4">
                <h4>People on Board</h4>
                <CrazyTableList 
                    classNames="mb-3"
                    items={
                        [
                            ['All Humans', ''+numberOfAllHuman, 'primary'],
                            ...props.baseState.human.humanCategories.map(a => [
                                ''+a.id+' (from '+a.ageStart+' to ' + a.ageEnd + ')', 
                                ''+a.numberOfHuman, 
                                'secondary'
                            ])
                        ]
                    }
                />
            </Col>

            <Col xs={12} sm={6} className="pe-3 mb-4">
                <h4>Goods on Board</h4>
                <CrazyTableList 
                    classNames="mb-3"
                    items={
                        [
                            ['All Goods', ''+numberOfAllGoods, 'primary'],
                            ...props.baseState.goods.amounts.map(a => [''+a[0], ''+a[1]+'u3', 'secondary'])
                        ]
                    }
                />
            </Col>
        </Row>
    </Container>
}