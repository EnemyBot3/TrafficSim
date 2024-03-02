import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { getIntersection, getRandomColor } from "../utils/math";
import Point from "./primitives/point";
import Segment from "./primitives/segment";
import Polgon from "./primitives/polygon";

Graph.polygons = [];

function Graph({points, segments, update}) {
    
    // const [intersections, setIntersections] = useState([]);
    // const [polygons, setPolygons] = useState([]);
    // var temp = []
    // const [p, pp] = useState([]);

    const handleDrag = ({oldPosition, newPosition}) => {
        // breakPolygons();
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

    // const breakPolygons = () => {
    //     for (let i = 0; i < Graph.polygons.length - 1; i++){
    //         for (let j = i + 1; j < Graph.polygons.length; j++){
    //             updatePolygons(Graph.polygons[i], Graph.polygons[j])
                
    //         }
    //         Graph.polygons.splice(i, 1)
    //     }
    //     console.log(temp)
    //     // if (Graph.polygons.length > 10)
    //     //     Graph.polygons = [];
    //     if (temp.length > 0)
    //         setPolygons(temp);
    // }

    // const updatePolygons = (poly1, poly2) => {

    //     // if (!poly1 || !poly2) console.log("=========================================")
    //     // if (!poly1 || !poly2) return;
    //     const overlaps = [];

    //     for (let i = 0; i < poly1.length; i++){
    //         for (let j = 0; j < poly2.length; j++){
    //             const inters = getIntersection(
    //                 poly1[i].p1, 
    //                 poly1[i].p2, 
    //                 poly2[j].p1, 
    //                 poly2[j].p2
    //             )
    //             if (inters && inters.offset != 1 && inters.offset != 0){
    //                 const point = {x: inters.x, y: inters.y};
    //                 overlaps.push(point);

    //                 let aux = poly1[i].p2;
    //                 poly1[i].p2 = point
    //                 poly1.splice(i + 1, 0, {p1: point, p2: aux})

    //                 aux = poly2[j].p2;
    //                 poly2[j].p2 = point
    //                 poly2.splice(j + 1, 0, {p1: point, p2: aux})
    //             }
    //         }
    //     }

    //     // console.log(poly1, "b")

    //     setIntersections(overlaps);
    //     // Graph.polygons = [];
    //     // setPolygons([poly1, poly2]);
    //     temp.push(poly1, poly2)
        
    // }

    // const handleSegments = (polygon) => {
    //     Graph.polygons.push(polygon)
    //     console.log(Graph.polygons)
    //     breakPolygons();
    // } 

    return ( 
        <>
        {
            segments.map((item, index) => 
                <Segment 
                  key={index} 
                  nodes={item} />
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
        {/* {
            intersections.map((item, index) => 
            <Point 
              key={index} 
              x={item.x} 
              y={item.y} 
              onDrag={handleDrag}/>
        )
        } */}
        {/* {
            polygons[0] && polygons.map((item, index) =>  */}
              <Polgon
                segments={segments} />
            {/* )
        } */}
        </>
    );
}

export default Graph;