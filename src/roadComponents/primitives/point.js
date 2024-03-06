import React, { useState, useEffect } from "react";
import { Arc } from 'react-konva';

function Point({x, y, selected = false, onDrag}) {
    const size = 10;
    const [color, setColor] = useState("transparent");
    useEffect(() => { setColor(selected? "yellow": "transparent") }, [selected]);

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
          onDragMove={handleDragMove}
          onDragEnd={handleDragMove}
          onMouseEnter={() => setColor("black")}
          onMouseLeave={() => !selected && setColor("transparent")}/>
    );
}

export default Point;