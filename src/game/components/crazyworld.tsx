import React from "react";
import { MessagePanel } from "./chat/message-panel"
import { CrazyChatModule } from "./chat/chat-module"
import { BaseExtensionTypeE, CrazyBaseStateI, CrazyGoodE, MessageDataI, MessageVariantTypeE, RocketTypeE } from "../decl";
import { RocketCanvas } from "./canvas";
import { CrazyBackdrops } from "./crazy_backdrops"
import { Button } from "react-bootstrap";
import { CircledBooomAnimation } from "../paint/animation/booom"
import { RIPAnimation } from "../paint/animation/rip"
import { V, vec } from "../../common/math";
import { AnimationObjectI, PaintCrazyWorldI } from "../paint/paint_declarations";
import {CrazyMouseEventComponent} from "./mouse_event_component"
import { ClientMouseI, VectorI } from "../../common/declarations";
import { screenToWorld } from "../paint/paint_tools";

export interface CrazyWorldState {
    showedBaseData?: CrazyBaseStateI
    showBaseDialog: boolean,
    messages: [MessageDataI, boolean][],
    messageBoxHeight: number,
    userId: string,
    typeMessageState: 'to-all' | 'to-me' | null
    currentMessage: string,
    cursorFromMessagePanelOn: boolean
}

export class CrazyWorld extends React.Component<{}, CrazyWorldState> {
    static instance: CrazyWorld

    private clientAnimations: AnimationObjectI[] = []
    private clientAnimationCounter = 0

    clientMouse?: ClientMouseI

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
            messageBoxHeight: 400,
            currentMessage: '',
            typeMessageState: null,
            cursorFromMessagePanelOn: false
        }

        CrazyWorld.instance = this
    }

    sendMessage() {
        if (this.state.currentMessage && this.state.currentMessage !== '') {
            // TODO handle message

            console.log('send message ' + this.state.typeMessageState)

            this.setState({
                ...this.addMessagesNewState([
                    {
                        text: this.state.currentMessage,
                        ownerId: 'u1',
                        ownerName: 'Meeri-Fan',
                        type: MessageVariantTypeE.SUCCESS,
                        dangerIcon: false
                    }
                ]),
                typeMessageState: null,
                currentMessage: ''
            })
        }
    }

    cancelMessage() {
        this.setState({
            ...this.state,
            typeMessageState: null,
            currentMessage: ''
        })
    }

    componentDidMount() {
        setInterval(() => {
            if (this.state.typeMessageState) this.setState({
                ...this.state,
                cursorFromMessagePanelOn: !this.state.cursorFromMessagePanelOn
            })
        }, 500)

        const exceptionKeys = ['!','?',',','.','-','>','<','ß','"',':',' ']

        document.addEventListener('keydown', k => {
            if (this.state.typeMessageState !== null) {
                if (k.code === 'Enter') this.sendMessage()

                else if ((this.state.typeMessageState === 'to-all' || this.state.currentMessage === '') &&  k.code === 'Escape') this.cancelMessage()

                else if (k.code === 'Backspace') {
                    this.setState({
                        ...this.state,
                        currentMessage: this.state.currentMessage.substring(
                            0, this.state.currentMessage.length-1
                        )
                    })
                }

                else if ((!k.shiftKey && !k.ctrlKey && k.code.includes('Key')) || exceptionKeys.includes(k.key)) this.setState({
                    ...this.state,
                    currentMessage: this.state.currentMessage + k.key.toUpperCase()
                })
            }
            else {
                if (k.shiftKey && !k.altKey && k.code === 'KeyC') this.setState({
                    ...this.state,
                    typeMessageState: 'to-me',
                })
                if (!k.shiftKey &&  k.altKey && k.code === 'KeyC') this.setState({
                    ...this.state,
                    typeMessageState: 'to-all',
                })
            }
        })
    }

    addAnimation(ani: AnimationObjectI) {
        this.clientAnimations.push(ani)
        ani.giveMeGameProps({
            killMe: () => {
                const index = this.clientAnimations.indexOf(ani, 0)
                this.clientAnimations.splice(index, 1)
            },
            id: 'animation_' + ani.getType() + '_' + this.clientAnimationCounter
        })
        this.clientAnimationCounter ++
    }

    addMessages(messages: MessageDataI[]) {
        this.setState(this.addMessagesNewState(messages))
    }

    addMessagesNewState(messages: MessageDataI[]) {
        return {
            ...this.state,
            messages: [
                ...this.state.messages.map(o => [o[0], false] as [MessageDataI, boolean]),
                ...messages.map(m => [m, true] as [MessageDataI, boolean])
            ]
        }
    }

    private removeLastMessages(n: number) {
        this.setState({
            ...this.state,
            messages: [
                ...this.state.messages.filter((o,i) => (i < n ? false : true)),
            ]
        })
    }

    onWorldData(world: PaintCrazyWorldI) {
        
    }

    render(): React.ReactNode {
        return <div id="crazy-world-gui">
            <RocketCanvas
                zIndex={0}
                onMouseChange={(pos) => this.clientMouse = pos}
            />

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

                <Button
                    onClick={() => {
                        RocketCanvas.instance.addAnimation(new RIPAnimation(
                            vec(2,-1),
                            'User XmP died'
                        ))
                    }}
                >
                    Add a R.I.P
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
                zIndex={1}
            />

            <CrazyBackdrops
                size="150px"
                color="rgba(0,0,0,0.7)"
                zIndex={2}
            />

            <CrazyChatModule
                cursorOn={this.state.cursorFromMessagePanelOn}
                message={this.state.currentMessage}
                sendMode={this.state.typeMessageState}
                onCanelClicked={() => this.cancelMessage()}
                onFinishClicked={() => this.sendMessage()}
                onSelectSendMode={k => this.setState({
                    ...this.state,
                    typeMessageState: k
                })}
                zIndex={5}
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