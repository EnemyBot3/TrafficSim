import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { getIntersection, getRandomColor } from "../utils/math";
import Point from "./primitives/point";
import Segment from "./primitives/segment";

Graph.polygons = [];

function Graph({points, segments, update}) {
    
    const [intersections, setIntersections] = useState([])

    const handleDrag = ({oldPosition, newPosition}) => {
        updatePolygons();
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

    const updatePolygons = () => {
        const poly1 = Graph.polygons[0];
        const poly2 = Graph.polygons[1];
        const overlaps = [];
        console.log(Graph.polygons[0])
        if (!poly1 || !poly2) return;

        for (let i = 0; i < poly1.length; i++){
            for (let j = 0; j < poly2.length; j++){
                const inters = getIntersection(
                    poly1[i].p1, 
                    poly1[i].p2, 
                    poly2[j].p1, 
                    poly2[j].p2
                )
                if (inters && inters.offset != 1 && inters.offset != 0){
                    const point = {x: inters.x, y: inters.y};
                    overlaps.push(point);

                    let aux = poly1[i].p2;
                    poly1[i].p2 = point
                    poly1.splice(i + 1, 0, {p1: point, p2: aux})

                    aux = poly2[j].p2;
                    poly2[j].p2 = point
                    poly2.splice(j + 1, 0, {p1: point, p2: aux})
                }
            }
        }
                    console.log(poly1)

        setIntersections(overlaps);
        Graph.polygons = [];
        
    }

    const handleSegments = (polygon) => {
        Graph.polygons.push(polygon)
        updatePolygons();
        // console.log(Graph.polygons);
    } 

    return ( 
        <>
        {
            segments.map((item, index) => 
                <Segment 
                  key={index} 
                  nodes={item} 
                  onUpdate={handleSegments} />
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
        {
            intersections.map((item, index) => 
            <Point 
              key={index} 
              x={item.x} 
              y={item.y} 
              onDrag={handleDrag}/>
        )
        }
        </>
    );
}

export default Graph;