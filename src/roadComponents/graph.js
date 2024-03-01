import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import Point from "./primitives/point";
import Segment from "./primitives/segment";


function Graph({points, segments, update}) {

    const handleDrag = ({oldPosition, newPosition}) => {
        update( 
            points.map(item => {
                if (item.x === oldPosition.x && item.y === oldPosition.y) {
                    return { ...item, x: newPosition.x, y: newPosition.y };
                }
                return item;
            }),
            segments.map(segment =>
                segment.map(point => {
                  if (point.x === oldPosition.x && point.y === oldPosition.y) {
                    return { ...point, x: newPosition.x, y: newPosition.y };
                  }
                  return point;
                })
            )
        );
    }

    return ( 
        <>
        {
            segments.map((item, index) => 
                <Segment key={index} nodes={item} />
            )
        }
        { 
            points.map((item, index) => 
                <Point 
                  key={index} 
                  x={item.x} 
                  y={item.y} 
                  selected={item.selected}
                  onDrag={handleDrag}/>
            )
        }
        </>
    );
}

export default Graph;