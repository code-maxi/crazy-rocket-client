import { CrazyCard, CrazyTableList } from "../../../helpers/component-adds";
import { CrazyBaseStateI } from "../../../../decl";
import { BaseConstructionCanvas, SelectedObjectT } from "../base-construction-canvas";
import React from "react";

const extendCardConfig = 'mb-3 crazy-base-extend-card'
const extendCardWidth = '350px'

export function CrazyBaseExtendTab(props: {
    baseState: CrazyBaseStateI,
    visible: boolean
}) {
    const [selectedObject, setSelectedObject] = React.useState<SelectedObjectT | undefined>(undefined)

    return <div className={'d-flex justify-content-around align-items-center flex-row flex-wrap' + (props.visible ? '' : ' d-none')}>
        
        <CrazyCard 
            width={extendCardWidth}
            classNames={extendCardConfig}
            title="Cargo Area" 
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat."
            onHover={(b) => {
                console.log('Cargo Area on hover: ' + b)
                setSelectedObject(b ? 'cargo-area' : undefined)
            }}
        > {
            <CrazyTableList
                items={[
                    
                ]}
            />
        }

        </CrazyCard>

        <CrazyCard 
            classNames={extendCardConfig}
            width={extendCardWidth}
            title="Enter Zone Area" 
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat."
            onHover={(b) => setSelectedObject(b ? 'enter-zone-base' : undefined)}
        >

        </CrazyCard>
        
        <div className="mb-4 w-100 d-flex justify-content-center">
        <BaseConstructionCanvas
            baseState={props.baseState}
            selectedObject={selectedObject}
            size={500}
        />
        </div>

        <CrazyCard 
            classNames={extendCardConfig}
            width={extendCardWidth}
            title="Human Area" 
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat."
            onHover={(b) => setSelectedObject(b ? 'human-area' : undefined)}
        >

        </CrazyCard>

        <CrazyCard 
            classNames={extendCardConfig}
            width={extendCardWidth}
            title="Outer Ring Area" 
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae congue mauris rhoncus aenean vel. Tincidunt augue interdum velit euismod in pellentesque massa placerat."
            onHover={(b) => setSelectedObject(b ? 'outer-ring' : undefined)}
        >
        </CrazyCard>
    </div>
}