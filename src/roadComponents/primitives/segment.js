import React, { Children } from "react";
import { Line } from 'react-konva';
import Point from "./point";

function Segment({ nodes }) {
    const width = 2;
    const color = "black"
    const [start, end] = nodes;
    const points = nodes.flatMap(item => [item.x, item.y]);

    return ( 
        <>
            <Line
              strokeWidth={width}
              stroke={color}
              points={points}
            />
        </>
    );
}

export default Segment;