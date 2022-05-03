import React from "react";
import { debugShop } from "../..";
import { BaseExtensionTypeE, CrazyBaseStateI, CrazyGoodE, RocketTypeE } from "../decl";
import { RocketCanvas } from "./canvas";
import {CrazyBaseModal} from "./crazybase/CrazyBaseModal"

export interface CrazyWorldState {
    showedBaseData?: CrazyBaseStateI
    showBaseDialog: boolean,
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
            }
        }
        CrazyWorld.instance = this
    }

    render(): React.ReactNode {
        return <div id="crazy-world-gui">
            <RocketCanvas />
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
        </div>
    }
}