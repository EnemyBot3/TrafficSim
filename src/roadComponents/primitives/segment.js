import React, { useEffect, useRef } from "react";
import { Line } from 'react-konva';
import { translate, gradient } from "../../utils/math";

function Segment({ nodes }) {
    const [start, end] = nodes;
    const points = nodes.flatMap(item => [item.x, item.y]);
    const roadSegments = [];
    var roadPoints = useRef([]);

    const lineWidth = 2;
    const roadWidth = 80;
    const color = "black"
    const radius = roadWidth / 2;
    const roundness = 3;

    // const generateSegments = () => {
    //     const alpha = gradient(start, end);
    //     const alpha_cw = alpha + Math.PI / 2;
    //     const alpha_ccw = alpha - Math.PI / 2;
        
    //     for (let i = alpha_ccw; i <= alpha_cw; i += Math.PI / roundness){ roadSegments.push(translate(start, i, radius)) }
    //     // roadSegments.push("x")
    //     for (let i = alpha_ccw; i <= alpha_cw; i += Math.PI / roundness){ roadSegments.push(translate(end, Math.PI + i, radius)) }
    //     roadPoints.current = roadSegments.flatMap(item => [item.x, item.y]);
    //     console.log(roadPoints, roadSegments);
    // }

    // useEffect(() => {
    //     generateSegments()
    //     const segmentedRoad = []

    //     for (let i = 1; i <= roadSegments.length; i++) {
    //         segmentedRoad.push( { 
    //             p1: roadSegments[i - 1], 
    //             p2: roadSegments[i % roadSegments.length]
    //         });
    //     }
    //     console.log(roadPoints, roadSegments, segmentedRoad);
    //     //onUpdate(segmentedRoad);
    // }, [start, end])

    return ( 
        <>
            <Line
              strokeWidth={lineWidth}
              stroke={color}
              points={points}
            />
            {/* <Line
              strokeWidth={lineWidth}
              stroke={"black"}
              points={roadPoints.current}
              fill={'rgba(0,0,255,0.25)'}
              closed={true}
              listening={false}
            /> */}
        </>
    );
}

export default Segment;