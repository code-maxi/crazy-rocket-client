import { getFromArrayMap } from "../common/adds"
import { sumArray } from "./other-adds"
import { PaintCrazyWorldI } from "./paint/paint_declarations"

export enum CrazyGoodE {
    FOOD = "FOOD",
    ENERGY = "ENERGY",
    GOLD = "GOLD",
    ROCKS = "ROCKS",
    PEOPLE = "PEOPLE"
}

export interface GoodsContainerI {
    amounts: [CrazyGoodE, number][]
}

export function createGoods(partiallyGoods: [CrazyGoodE, number][]): GoodsContainerI {
    return {
        amounts: Object.values(CrazyGoodE).map(e => {
            const v = getFromArrayMap(partiallyGoods, e)
            return [e, v ? v : 0]
        })
    }
}

export function goodsToString(goods: [CrazyGoodE, number][]) {
    return goods.map(a => a[1] + 'u3 ' + a[0]).join(', ')
}


export function GoodsHelper(sis: GoodsContainerI) {
    return {
        findGood(type: CrazyGoodE) {
            return sis.amounts.find(a => a[0] === type)![1]
        },
        goodsToString() {
            return sis.amounts.map(a => a[1] + 'u3 ' + a[0]).join(', ')
        },
        add(that: GoodsContainerI): GoodsContainerI {
            return {
                amounts: sis.amounts.map(a => [a[0], a[1] + GoodsHelper(that).findGood(a[0])])
            }
        },
        isHigherThan(that: GoodsContainerI) {
            let isHigher = true
            for (let a of sis.amounts) {
                if (a[1] < GoodsHelper(that).findGood(a[0])) {
                    isHigher = false
                    break;
                }
            }
            return isHigher
        },
        sumGoods() {
            return sumArray(sis.amounts, a => a[1])
        }
    }
}

export interface HumanCategoryI {
    id: string,
    numberOfHuman: number,
    ageStart: number,
    ageEnd: number,
    weight: number
}

export interface HumanContainerI {
    humanCategories: HumanCategoryI[],
    newbornHumans: number,
    diedHumansUnnatural: number,
    weightOfAll: number
}

export enum BaseExtensionTypeE { CARGO_AREA = "CARGO_AREA", HUMAN_AREA = "HUMAN_AREA" }
export enum RocketTypeE { 
    X_WING, 
    STERNZERSTOERER, 
    TIE_FIGHTER,
    B_WING 
}

export interface RocketDescriptionI {
    type: RocketTypeE,
    name: string,
    description: string,
    img: string,
    props: {
        cost: GoodsContainerI,
        cargoAreaSpace: number,
        mass: number
    }
}

export interface BaseExtensionI {
    type: BaseExtensionTypeE,
    reservedSpace: number,
    maxSpace: number,
    name: string,
    broken: boolean,
    unit: string,
    place: number // between 0 and 100
}

export interface RocketOnBoardI {
    numberOf: number,
    type: RocketTypeE,
    selectedUsers: string[]
}

export interface CrazyBaseStateI {
    goods: GoodsContainerI,
    human: HumanContainerI,
    extensions: BaseExtensionI[],
    isRingBuilded: boolean,
    isInterceptionActivated: boolean,
    warningAlerts: string[],
    name: string,
    maxHumanSpace: number,
    maxObjectSpace: number,
    rocketsOnBoard: RocketOnBoardI[]
}

export interface FinalGameDataI {
    rocketDescriptons?: RocketDescriptionI[],
    introductionText?: string,
    baseRingToCenter: number
}

// Chat

export enum MessageVariantTypeE {
    DANGER = 'danger',
    INFO = 'info',
    WARNING = 'warning',
    SECONDARY = 'secondary',
    SUCCESS = 'success'
}

export interface MessageDataI {
    ownerName: string,
    ownerId: string,
    text: string,
    type: MessageVariantTypeE | null
    dangerIcon: boolean
}

export interface MessageContainerI {
    messages: MessageDataI[]
}

// Teams

export interface CrazyUserI {
    id: string,
    team: string,
    name: string,
    galaxy: string
}

export interface CrazyTeamStateI {
    color: string,
    recuedPeople: number,
    users: CrazyUserI[],
    baseStates: CrazyBaseStateI[]
}

export interface CrazyRocketStateI {
    weight: number,
    speedInKmH: number,
    goods: number,
    human: HumanContainerI
}

// ----------

export interface StateCrazyWorldDataI {
    teamStates: [string, CrazyTeamStateI][]
    rocketState: CrazyRocketStateI | null
    dialogStates: []
}

export interface WholeCrazyWorldDataI {
    myUser: CrazyUserI
    paint: PaintCrazyWorldI
    state: StateCrazyWorldDataI
}