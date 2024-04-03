import React, { useState, useContext } from "react";
import { Line } from 'react-konva';
import { translate, gradient} from "../../utils/math";
import { RoadContext } from "../../roadCanvas";
import { Modes } from "../../utils/enums";

function Segment({ nodes }) {
    const { mode } = useContext(RoadContext);
    const points = [nodes.start.x, nodes.start.y, nodes.end.x, nodes.end.y];
    const lineWidth = 10;
    const [color, setColor] = useState("transparent");

    return ( 
        <Line
            strokeWidth={lineWidth}
            stroke={color}
            points={points}
            onMouseEnter={() => setColor("rgba(0, 0, 0, .5)")}
            onMouseLeave={() => setColor("transparent")}
            listening={mode == Modes.Graphs}
        />
    );
}

export default Segment;