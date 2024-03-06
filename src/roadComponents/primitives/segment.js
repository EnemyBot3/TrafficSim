import React, { useState, useRef } from "react";
import { Line } from 'react-konva';
import { translate, gradient } from "../../utils/math";

function Segment({ nodes }) {
    const points = nodes.flatMap(item => [item.x, item.y]);
    const lineWidth = 3;
    const [color, setColor] = useState("transparent");

    return ( 
        <Line
            strokeWidth={lineWidth}
            stroke={color}
            points={points}
            onMouseEnter={() => setColor("rgba(0, 0, 0, .5)")}
            onMouseLeave={() => setColor("transparent")}
            bazier={true}
        />
    );
}

export default Segment;