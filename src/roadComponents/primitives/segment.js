import React, { Children, useEffect } from "react";
import { Line } from 'react-konva';
import { translate, gradient } from "../../utils/math";
import Point from "./point";

function Segment({ nodes, onUpdate }) {
    const [start, end] = nodes;
    const points = nodes.flatMap(item => [item.x, item.y]);

    const lineWidth = 2;
    const roadWidth = 80;
    const color = "black"
    const radius = roadWidth / 2;
    const roundness = 10;

    const alpha = gradient(start, end);
    const alpha_cw = alpha + Math.PI / 2;
    const alpha_ccw = alpha - Math.PI / 2;
    const roadSegments = [];
    
    for (let i = alpha_ccw; i <= alpha_cw; i += Math.PI / roundness){ roadSegments.push(translate(start, i, radius)) }
    for (let i = alpha_ccw; i <= alpha_cw; i += Math.PI / roundness){ roadSegments.push(translate(end, Math.PI + i, radius)) }
    const roadPoints = roadSegments.flatMap(item => [item.x, item.y]);

    useEffect(() => {
        const segmentedoad = []

        for (let i = 1; i <= roadSegments.length; i++) {
            segmentedoad.push( { 
                p1: roadSegments[i - 1], 
                p2: roadSegments[i % roadSegments.length]
            });
        }
        onUpdate(segmentedoad);
    }, [start, end])

    return ( 
        <>
            <Line
              strokeWidth={lineWidth}
              stroke={color}
              points={points}
            />
            <Line
              strokeWidth={lineWidth}
              stroke={"black"}
              points={roadPoints}
              fill={'rgba(0,255,0,0.5)'}
              closed={true}
              listening={false}
            />
        </>
    );
}

export default Segment;