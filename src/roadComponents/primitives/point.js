import React, { useState, useEffect } from "react";
import { Arc } from 'react-konva';

function Point({x, y, selected = false, onDrag}) {
    const size = 18;
    const [color, setColor] = useState("black");
    useEffect(() => { setColor(selected? "yellow": "black") }, [selected]);
  
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
          outerRadius={size / 2}
          angle={360}
          fill={color}
          draggable
          onDragMove={handleDragMove}
          onDragEnd={handleDragMove}
          onMouseEnter={() => setColor("yellow")}
          onMouseLeave={() => !selected && setColor("black")}/>
    );
}

export default Point;