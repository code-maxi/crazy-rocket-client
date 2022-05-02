import { getFromArrayMap } from "../common/adds"
import { sumArray } from "./other-adds"

export enum CrazyGoodE {
    FOOD = "FOOL",
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

export enum BaseExtensionTypeE { CARGO_AREA, HUMAN_AREA }
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
    unit: string
}

export interface RocketOnBoardI {
    numberOf: number,
    type: RocketTypeE,
    selectedUsers: string[]
}

export interface CrazyBaseStateI {
    usersOnBoard: string[],
    goods: GoodsContainerI,
    human: HumanContainerI,
    extensions: BaseExtensionI[],
    warningAlerts: string[],
    name: string,
    maxHumanSpace: number,
    maxObjectSpace: number,
    rocketsOnBoard: RocketOnBoardI[]
}