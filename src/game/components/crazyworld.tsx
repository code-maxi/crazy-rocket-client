import React from "react";
import { MessagePanel } from "./chat/message-panel"
import { BaseExtensionTypeE, CrazyBaseStateI, CrazyGoodE, MessageDataI, MessageVariantTypeE, RocketTypeE } from "../decl";
import { RocketCanvas } from "./canvas";
import { CrazyBackdrops } from "./crazy_backdrops"
import { Button } from "react-bootstrap";
import { CircledBooomAnimation } from "../paint/animation/booom"
import { vec } from "../../common/math";

export interface CrazyWorldState {
    showedBaseData?: CrazyBaseStateI
    showBaseDialog: boolean,
    messages: [MessageDataI, boolean][],
    messageBoxHeight: number,
    userId: string
}

export class CrazyWorld extends React.Component<{}, CrazyWorldState> {
    static instance: CrazyWorld

    constructor(a: any) {
        super(a)
        this.state = {
            showBaseDialog: true,
            userId: 'test-user',
            showedBaseData: {
                usersOnBoard: ['test-u'],
                goods: {
                    amounts: [
                        [CrazyGoodE.ENERGY, 10],
                        [CrazyGoodE.FOOD, 70],
                        [CrazyGoodE.GOLD, 50],
                        [CrazyGoodE.ROCKS, 100]
                    ]
                },
                human: {
                    humanCategories: [
                        {
                            id: 'Children',
                            numberOfHuman: 1,
                            ageStart: 4,
                            ageEnd: 17,
                            weight: 13
                        },
                        {
                            id: 'Baby',
                            numberOfHuman: 0,
                            ageStart: 0,
                            ageEnd: 3,
                            weight: 12
                        },
                        {
                            id: 'Young Adults',
                            numberOfHuman: 0,
                            ageStart: 18,
                            ageEnd: 39,
                            weight: 13
                        },
                        {
                            id: 'Older Adults',
                            numberOfHuman: 0,
                            ageStart: 40,
                            ageEnd: 59,
                            weight: 13
                        },
                        {
                            id: 'Grand parents',
                            numberOfHuman: 0,
                            ageStart: 60,
                            ageEnd: 200,
                            weight: 13
                        },
                    ],
                    newbornHumans: 1123,
                    diedHumansUnnatural: 106,
                    weightOfAll: 1230
                },
                extensions: [
                    {
                        type: BaseExtensionTypeE.CARGO_AREA,
                        reservedSpace: 12,
                        name: 'C1',
                        maxSpace: 20,
                        unit: 'u3',
                        place: 0,
                        broken: true
                    },
                    {
                        type: BaseExtensionTypeE.HUMAN_AREA,
                        reservedSpace: 123,
                        maxSpace: 145,
                        unit: '',
                        name: 'H1',
                        place: 180,
                        broken: false
                    },
                    {
                        type: BaseExtensionTypeE.CARGO_AREA,
                        reservedSpace: 12,
                        maxSpace: 20,
                        name: 'C2',
                        unit: 'u3',
                        place: 90,
                        broken: false
                    },
                    {
                        type: BaseExtensionTypeE.HUMAN_AREA,
                        reservedSpace: 123,
                        name: 'H2',
                        maxSpace: 145,
                        unit: '',
                        place: 270,
                        broken: true
                    },
                    {
                        type: BaseExtensionTypeE.HUMAN_AREA,
                        reservedSpace: 123,
                        maxSpace: 145,
                        unit: '',
                        name: 'H1',
                        place: 45,
                        broken: false
                    },
                    {
                        type: BaseExtensionTypeE.CARGO_AREA,
                        reservedSpace: 12,
                        maxSpace: 20,
                        name: 'C2',
                        unit: 'u3',
                        place: 135,
                        broken: false
                    },
                    {
                        type: BaseExtensionTypeE.HUMAN_AREA,
                        reservedSpace: 123,
                        name: 'H2',
                        maxSpace: 145,
                        unit: '',
                        place: 225,
                        broken: true
                    },
                    {
                        type: BaseExtensionTypeE.HUMAN_AREA,
                        reservedSpace: 123,
                        name: 'H2',
                        maxSpace: 145,
                        unit: '',
                        place: 315,
                        broken: true
                    }
                ],
                warningAlerts: [
                    'There is not enough food for all people!',
                    'There is not enough food for all people 2!'
                ],
                name: 'XiPq',
                maxHumanSpace: 120,
                maxObjectSpace: 400,
                rocketsOnBoard: [
                    {
                        type: RocketTypeE.X_WING,
                        numberOf: 1,
                        selectedUsers: []
                    },
                    {
                        type: RocketTypeE.STERNZERSTOERER,
                        numberOf: 3,
                        selectedUsers: []
                    },
                    {
                        type: RocketTypeE.TIE_FIGHTER,
                        numberOf: 2,
                        selectedUsers: ['test-user']
                    },
                    {
                        type: RocketTypeE.B_WING,
                        numberOf: 0,
                        selectedUsers: []
                    }
                ],
                isRingBuilded: true,
                isInterceptionActivated: true
            },
            messages: [
                [{
                    text: 'Hello, I am a message!',
                    ownerName: 'Test User',
                    ownerId: 'u1',
                    type: null,
                    dangerIcon: false
                }, false],
                [{
                    text: 'Danger Danger Danger! I am a message!',
                    ownerName: 'System',
                    ownerId: 'u2',
                    type: MessageVariantTypeE.DANGER,
                    dangerIcon: true
                }, false],
                [{
                    text: 'Hello, I am a message!',
                    ownerName: 'Test User',
                    ownerId: 'u1',
                    type: null,
                    dangerIcon: false
                }, true],
                [{
                    text: 'Hello, I am a message!',
                    ownerName: 'Test User',
                    ownerId: 'u1',
                    type: null,
                    dangerIcon: false
                }, true]
            ],
            messageBoxHeight: 400
        }
        CrazyWorld.instance = this
    }

    addMessages(messages: MessageDataI[]) {
        this.setState({
            ...this.state,
            messages: [
                ...this.state.messages.map(o => [o[0], false] as [MessageDataI, boolean]),
                ...messages.map(m => [m, true] as [MessageDataI, boolean])
            ]
        })
    }

    private removeLastMessages(n: number) {
        this.setState({
            ...this.state,
            messages: [
                ...this.state.messages.filter((o,i) => (i < n ? false : true)),
            ]
        })
    }

    render(): React.ReactNode {
        return <div id="crazy-world-gui">
            <RocketCanvas />

            <div className="d-inline-flex flex-row fixed-bottom">
                <Button
                    onClick={() => {
                        const messageTypes = Object.values(MessageVariantTypeE)
                        this.addMessages([
                            {
                                text: 'This is a message...' + Math.random(),
                                ownerId: 'u1',
                                ownerName: 'User 1',
                                dangerIcon: Math.random() > 0.5,
                                type: Math.random() > 0.5 ? messageTypes[Math.trunc(messageTypes.length * Math.random())] : null
                            }
                        ])
                    }}
                >
                    Add a Message
                </Button>

                <Button
                    onClick={() => {
                        RocketCanvas.instance.addAnimation(new CircledBooomAnimation({
                            pos: vec(0,0),
                            depth: 100,
                            radius: 4,
                            duration: 60,
                            velocity: vec(0,0),
                            colors: [
                                '255,127,80',
                                '255,215,0',
                                '255,165,0',
                                '255,140,0'
                            ],
                            radiusFac: 1,
                            revealRadiusFac: 1
                        }))
                    }}
                >
                    Add a Booom
                </Button>
            </div>

            <MessagePanel 
                massages={this.state.messages}
                messageBoxHeight={this.state.messageBoxHeight}
                transitionDuration={500}
                onEffecDone={() => {
                    if (this.state.messages.length > 15) {
                        this.removeLastMessages(5)
                        console.log('Too much messages!')
                    }
                }}
            />

            <CrazyBackdrops
                size="150px"
                color="rgba(0,0,0,0.7)"
                zIndex={2}
            />
        </div>
    }
}

/*

<CrazyBaseModal
                baseState={this.state.showedBaseData}
                visible={this.state.showBaseDialog} 
                userId={this.state.userId}
                maxRocketSpace={7}
                rocketGoods={{amounts: [
                    [CrazyGoodE.ENERGY, 1],
                    [CrazyGoodE.FOOD, 2],
                    [CrazyGoodE.GOLD, 3],
                    [CrazyGoodE.ROCKS, 4]
                ]}}
                onBuyGood={(t, a) => console.log('' + a + 't of' + t + ' buyed!')}
                onSelectRocket={t => {
                    console.log("Rocket "+t+" selected!")
                }}
                onBuyRocket={t => {
                    console.log("Rocket "+t+" buyed!")
                }}
            />

            */