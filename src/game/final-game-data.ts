import { CrazyGoodE, createGoods, RocketDescriptionI, RocketTypeE } from "./decl"

export let FinalGameData: {
    rocketDescriptons?: RocketDescriptionI[],
    introductionText?: string
} = {
    rocketDescriptons: [
        {
            type: RocketTypeE.X_WING,
            name: 'X-Wing',
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat.",
            img: 'images/x-wing.png',
            props: {
                cost: createGoods([
                    [CrazyGoodE.GOLD, 1],
                    [CrazyGoodE.ROCKS, 10],
                    [CrazyGoodE.ENERGY, 5]
                ]),
                cargoAreaSpace: 20,
                mass: 15
            }
        },
        {
            type: RocketTypeE.STERNZERSTOERER,
            name: 'Sternzerstörer',
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat.",
            img: 'images/sternzerstoerer.png',
            props: {
                cost: createGoods([
                    [CrazyGoodE.GOLD, 15],
                    [CrazyGoodE.ROCKS, 101],
                    [CrazyGoodE.ENERGY, 250]
                ]),
                cargoAreaSpace: 120,
                mass: 321
            }
        },
        {
            type: RocketTypeE.TIE_FIGHTER,
            name: 'Tie-Fighter',
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat.",
            img: 'images/tie-fighter.png',
            props: {
                cost: createGoods([
                    [CrazyGoodE.GOLD, 12],
                    [CrazyGoodE.ROCKS, 23],
                    [CrazyGoodE.ENERGY, 10]
                ]),
                cargoAreaSpace: 11,
                mass: 23
            }
        },
        {
            type: RocketTypeE.B_WING,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat.",
            img: 'images/bwing2.png',
            name: 'B-Wing',
            props: {
                cost: createGoods([
                    [CrazyGoodE.GOLD, 14],
                    [CrazyGoodE.ROCKS, 18],
                    [CrazyGoodE.ENERGY, 25]
                ]),
                cargoAreaSpace: 32,
                mass: 42
            }
        }
    ]
}