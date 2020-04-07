import React from 'react'
import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from 'use-image';
import TshirtView from './tshirtcolor'


export default function Designer({ tshirt, tshirtOnChange }) {
    const [selected, setSelected] = React.useState(false);
    const [pageLoaded, setPageLoaded] = React.useState(false)
    const elStage = React.useRef();

    const checkDeselect = e => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelected(false);
        }
    };

    React.useEffect(() => {
        setPageLoaded(true)
    }, [])

    return (
        <div ref={elStage} className="w-full flex justify-center items-center">
            <Stage className="absolute"
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
                width={pageLoaded ? Math.round(40 * elStage.current.clientWidth / 100) : 0}
                height={pageLoaded ? Math.round(58 * elStage.current.clientWidth / 100) : 0}>
                <Layer>
                    <DesignView
                        isSelected={selected}
                        data={tshirt}
                        tshirt={tshirt.direction === 'front' ? tshirt.designs.front : tshirt.designs.back}
                        onSelect={() => {
                            setSelected(true);
                            console.log('selected')
                        }}
                        // design={tshirt.direction === 'front' ? tshirt.designs.front.asset : tshirt.designs.back.asset}
                        onChange={tshirtOnChange}
                        width={pageLoaded ? 50 * (Math.round(40 * elStage.current.clientWidth / 100)) / 100 : 0}
                    />
                </Layer>
            </Stage>
            <TshirtView direction={tshirt.direction} color={tshirt.color} />
        </div>
    )
}


const DesignView = ({ isSelected, onSelect, tshirt, onChange, data }) => {
    // const [positions, setPosition] = React.useState(t)
    const [image] = useImage(tshirt.asset);
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.setNode(shapeRef.current);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Image
                ref={shapeRef}
                isSelected={isSelected}
                image={image}
                draggable
                {...tshirt.positions}
                onClick={onSelect}
                onTap={onSelect}
                onDragStart={() => {
                    onChange({
                        ...data,
                        designs: {
                            ...data.designs,
                            [data.direction]: {
                                ...data.designs[data.direction],
                                positions: {
                                    ...data.designs[data.direction].positions,
                                    isDragging: true,
                                }
                            }
                        }
                    })
                }}
                onDragEnd={e => {
                    onChange({
                        ...data,
                        designs: {
                            ...data.designs,
                            [data.direction]: {
                                ...data.designs[data.direction],
                                positions: {
                                    ...data.designs[data.direction].positions,
                                    isDragging: false,
                                    x: e.target.x(),
                                    y: e.target.y(),
                                }
                            }
                        }
                    })
                }}
                onTransformEnd={e => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...data,
                        designs: {
                            ...data.designs,
                            [data.direction]: {
                                ...data.designs[data.direction],
                                positions: {
                                    ...data.designs[data.direction].positions,
                                    x: node.x(),
                                    y: node.y(),
                                    // set minimal value
                                    width: Math.max(5, node.width() * scaleX),
                                    height: Math.max(node.height() * scaleY),
                                }
                            }
                        }
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};