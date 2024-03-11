import React, { useState, useEffect, useContext } from "react";
import { Arc } from 'react-konva';
import { RoadContext } from "../../roadCanvas";
import { Modes } from "../../utils/enums";

function Point({x, y, selected = false, onDrag}) {
    const { mode } = useContext(RoadContext);
    const size = 10;
    const [color, setColor] = useState("transparent");

    useEffect(() => { setColor(selected? "yellow": "transparent") }, [selected]);
    useEffect(() => { if(mode == Modes.Markings) setColor("transparent") }, [mode]);

    const handleDragMove = (event) => {
        onDrag({
            oldPosition: {x, y}, 
            newPosition: {x: event.target.attrs.x, y: event.target.attrs.y}
        });
    }
    
    return ( 
        <Arc 
          x={x}
          y={y}
          outerRadius={size}
          angle={360}
          fill={color}
          draggable
          listening={mode == Modes.Graphs}
          onDragMove={handleDragMove}
          onDragEnd={handleDragMove}
          onMouseEnter={() => setColor("black")}
          onMouseLeave={() => !selected && setColor("transparent")}/>
    );
}

export default Point;