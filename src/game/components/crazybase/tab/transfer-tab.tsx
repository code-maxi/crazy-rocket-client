import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import React from "react";
import { CrazyGoodE, GoodsContainerI } from "../../../decl";
import { Badge, Spinner } from 'react-bootstrap'
import { getFromArrayMap } from '../../../../common/adds'

export function CrazyBaseTransferTab(props: {
    visible: boolean,
    rocketGoods: GoodsContainerI,
    baseGoods: GoodsContainerI,
    maxRocketSpace: number,
    maxHumanBaseSpace: number,
    maxObjectBaseSpace: number,
    transferData: (type: string, amount: number) => void
}) {
    return <Stack gap={4} className={"ms-auto me-auto" + (props.visible ? '' : ' d-none')} style={{ maxWidth: '600px' }}>
        {
            Object.values(CrazyGoodE).map(t => {
                const values: [number,number] = [
                    getFromArrayMap(props.rocketGoods.amounts, t)!, 
                    getFromArrayMap(props.baseGoods.amounts, t)!
                ]
                const maxValues: [number,number] = [
                    props.maxRocketSpace, 
                    t === CrazyGoodE.PEOPLE ? props.maxHumanBaseSpace : props.maxObjectBaseSpace
                ]

                return <CrazyBaseTransferTabItem
                    values={values}
                    maxValues={maxValues}
                    type={t}
                    transferData={props.transferData}
                />
            })
        }
    </Stack>
}

const ARROW_SIZE = [
    40, 30
]

function CrazyBaseTransferTabItem(props: {
    values: [number, number],
    maxValues: [number, number],
    type: CrazyGoodE,
    transferData: (type: string, amount: number) => void
}) {
    const [transferType, setTransferType] = React.useState([0, 1])
    const [sliderValue, setSliderValue] = React.useState(0)
    const [isTransferingData, setTransferingData] = React.useState(false)

    const freeSpaceAmount = props.maxValues[transferType[0]] - props.values[transferType[0]]    
    const amountAbleToTransfer = props.values[transferType[1]]
    const amountRange = freeSpaceAmount < amountAbleToTransfer ? freeSpaceAmount : amountAbleToTransfer

    return <Stack gap={2} direction='vertical' className='text-light p-3 bg-dark justify-content-center' style={{
        backgroundColor: 'rgb(50,50,50)'
    }}>
        <h5 className="pe-4">Transfer {props.type}</h5>

        <div className="d-flex align-items-center justify-content-between w-100">
            <span className="d-inline-flex justify-content-start flex-column">
                <h4 className="pe-3">
                    Rocket
                    <Badge className="ms-2"pill bg="secondary">{props.values[0] + ' u3'}</Badge>
                </h4>
                <span>
                    Free Space: {props.maxValues[0] - props.values[0]} u3
                </span>
            </span>

            <svg style={{opacity: transferType[1] === 0 ? 0 : 1}} xmlns="http://www.w3.org/2000/svg" width={ARROW_SIZE[0]} height={ARROW_SIZE[1]} fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            
            <h4 className="px-2">
                <Badge pill bg="primary">{Math.round(amountRange * sliderValue * 10) / 10 + ' u3'}</Badge>
            </h4>

            <svg style={{opacity: transferType[0] === 0 ? 0 : 1}} xmlns="http://www.w3.org/2000/svg" width={ARROW_SIZE[0]} height={ARROW_SIZE[1]} fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>

            <span className="d-inline-flex justify-content-end flex-column">
                <h4 className="ps-3">
                    <Badge pill bg="secondary" className="me-2">{props.values[1] + ' u3'}</Badge>
                    Base
                </h4>
                <span>
                    Free Space: {props.maxValues[1] - props.values[1]} u3
                </span>
            </span>
            
        </div>

        <div className="d-flex align-items-center mt-2 w-100">
            <div className="flex-grow-1">
                <input type="range" className="w-100" min={0} max={1} step={0.005} value={sliderValue} onChange={
                    (e: React.FormEvent<HTMLInputElement>) => setSliderValue(e.currentTarget.value as any)
                }/>
            </div>
            
            <Button variant="success" disabled={sliderValue <= 0 || isTransferingData} className="ms-3" onClick={
                () => {
                    const amount = Math.round(amountRange * sliderValue * 10) / 10
                    setTransferingData(true)
                    setTimeout(() => {
                        props.transferData(props.type, amount)
                        setTransferingData(false)
                    }, amount * 500)
                }
            }>Transfer{ isTransferingData ? 'ing' : ' →' } { isTransferingData ? <Spinner className="ms-1" animation="border" size="sm" /> : undefined }</Button>
        </div>

        <Stack direction='horizontal' gap={2} className="mt-2 w-100">
            <Button
                variant={(transferType[0] === 0 ? '' : 'outline-') + 'primary'} 
                onClick={() => { setTransferType([0, 1]) }}>
                To Rocket
            </Button>

            <Button 
                variant={(transferType[0] === 1 ? '' : 'outline-') + 'primary'} 
                className="ms-auto"
                onClick={() => { setTransferType([1, 0]) }}>
                To Base
            </Button>
        </Stack>
    </Stack>
}