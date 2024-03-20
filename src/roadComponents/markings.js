import React, { useState, useContext } from 'react';
import { Shape } from 'react-konva';
import { RoadContext } from "../roadCanvas";
import { Modes, roadWidth, Markings, selectedMarking } from '../utils/enums';
import { projectPoint, segmentDirectionVector, translate, gradient, crossProduct } from '../utils/math';
import { Sign } from './roadSigns/sign';


export default function MarkingsEditor({ polygon, segment }) {
    const { signs, setSigns, mode } = useContext(RoadContext);
    const [projection, setProjection] = useState(null);
    const direction = segmentDirectionVector(segment);
    const [flipped, setFlipped] = useState(false);

    const alpha = gradient(segment[0], segment[1]);
    const alpha_cw = alpha + Math.PI / 2;
    const alpha_ccw = alpha - Math.PI / 2;

    const segment_cw = [
        translate(segment[0], alpha_cw, roadWidth / 4),
        translate(segment[1], alpha_cw, roadWidth / 4)
    ]
    const segment_ccw = [
        translate(segment[0], alpha_ccw, roadWidth / 4),
        translate(segment[1], alpha_ccw, roadWidth / 4)
    ]

    const handleMouseMove = (event) => {
        const mousePos = event.currentTarget.getRelativePointerPosition();

        const center      = projectPoint(mousePos, segment).projection;
        const quartileCW  = projectPoint(mousePos, segment_cw).projection;
        const quartileCCW = projectPoint(mousePos, segment_ccw).projection;

        if (selectedMarking == Markings.Crossing) { setProjection(center); setFlipped(true) }
        else if (crossProduct(mousePos, segment) > 0) { setProjection(quartileCW); setFlipped(true) }
        else { setProjection(quartileCCW); setFlipped(false) }
    }

    const handleClick = (event) => { 

        if (event.evt.button === 0){ 
            setSigns([...signs, {type: selectedMarking, center: projection, direction, flipped}]) 
        } 

    }

    return (
        (mode == Modes.Markings || mode == Modes.Cars) && 
        <>
            <Shape 
                listening={true}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setProjection(null)}
                onClick={handleClick}

                sceneFunc={(ctx, shape) => {
                ctx.beginPath();
                ctx.moveTo(polygon[0].p1.x, polygon[0].p1.y);
                for (let i = 1; i < polygon.length; i++) {
                    ctx.lineTo(polygon[i].p1.x, polygon[i].p1.y);
                }
                ctx.closePath();
                ctx.fillStrokeShape(shape);
            }}/>

            {projection &&
                <Sign 
                    type={selectedMarking}
                    center={projection} 
                    direction={direction} 
                    flipped={flipped}
                    projection={true}/>
            }
        </>
    )
}