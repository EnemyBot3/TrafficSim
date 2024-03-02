import { shapes } from "konva/lib/Shape";
import React, { useEffect, useState } from "react";
import { Line, Arc, Shape } from 'react-konva';
import { gradient, translate, getIntersection, getRandomColor } from "../../utils/math";

function Polygon({ segments }) {
    var polygons = [];
    var intersections = [];
    const lineWidth = 2;
    const roadWidth = 80;
    const color = "white"
    const radius = roadWidth / 2;
    const roundness = 3;

    polygons = segments.map((segment, index) => {
        const [ start, end ] = segment;
        const vertices = []

        const alpha = gradient(start, end);
        const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2;

        for (let i = alpha_ccw; i <= alpha_cw; i += Math.PI / roundness){ vertices.push(translate(start, i, radius)) }
        for (let i = alpha_ccw; i <= alpha_cw; i += Math.PI / roundness){ vertices.push(translate(end, Math.PI + i, radius)) }

        return vertices.map((vertex, i) => ({
            p1: vertex,
            p2: vertices[(i + 1) % vertices.length]
        }));
    })

    for (let i = 0; i < polygons.length - 1; i++){

        for (let j = i + 1; j < polygons.length; j++){
            updatePolygons(polygons[i], polygons[j])
        }

        console.log(polygons)

    }
    
    function updatePolygons(poly1, poly2) {
        const overlaps = [];

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
                    intersections.push(point);

                    let aux = poly1[i].p2;
                    poly1[i].p2 = point
                    poly1.splice(i + 1, 0, {p1: point, p2: aux})

                    aux = poly2[j].p2;
                    poly2[j].p2 = point
                    poly2.splice(j + 1, 0, {p1: point, p2: aux})
                }
            }
        }
        // setIntersections(intersections);
        // console.log(polygons)
    }


    // const generatePolygons = () => {
    //     const alpha = gradient(start, end);
    //     const alpha_cw = alpha + Math.PI / 2;
    //     const alpha_ccw = alpha - Math.PI / 2;
        
    //     for (let i = alpha_ccw; i <= alpha_cw; i += Math.PI / roundness){ roadSegments.push(translate(start, i, radius)) }
    //     for (let i = alpha_ccw; i <= alpha_cw; i += Math.PI / roundness){ roadSegments.push(translate(end, Math.PI + i, radius)) }
    //     roadPoints.current = roadSegments.flatMap(item => [item.x, item.y]);
    // }

    // useEffect(() => {
    //     segments.ma
    //     generateSegments()
    //     const segmentedRoad = []

    //     for (let i = 1; i <= roadSegments.length; i++) {
    //         segmentedRoad.push( { 
    //             p1: roadSegments[i - 1], 
    //             p2: roadSegments[i % roadSegments.length]
    //         });
    //     }
    //     onUpdate(segmentedRoad);
    // }, [start, end])

    return ( 
      <>
        {
            polygons.map(pol => pol.map( p => {
                console.log(p)
                return (
                    <Line 
                        strokeWidth={5}
                        stroke={getRandomColor()}
                        points={[p.p1.x, p.p1.y, p.p2.x, p.p2.y]}
                    />
                )

            }))
        }
                {
          intersections.map((item, index) => 
            <Arc 
              x={item.x}
              y={item.y}
              outerRadius={6}
              angle={360}
              fill={"red"}
              key={index} />
        )}
        {/* <Shape 
          fill={'rgba(0,155,190,0.5)'}
          stroke={color}
          strokeWidth={4}
          listening={false}
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.moveTo(polygons[0].p1.x, polygons[0].p1.y);
            for (let i = 1; i < polygons.length; i++) {
                context.lineTo(polygons[i].p1.x, polygons[i].p1.y);
             }
            context.closePath();

            context.fillStrokeShape(shape);
          }}
        /> */}
      </>
    );
}

export default Polygon;