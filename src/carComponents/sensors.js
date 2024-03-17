import React, { useContext } from 'react'
import { Line, Arc } from 'react-konva';
import { lerp, getIntersection } from '../utils/math';
import { RoadContext } from '../roadCanvas';

export default function Sensors({position, rotation}) {
    const { roadBorders } = useContext(RoadContext)
    const rayCount = 5;
    const rayLenght = 150;
    const raySpread = Math.PI / 4;
    const rays = [];
    const detections = [];

    for (var i = 0; i < rayCount; i++) {
        const angle = lerp(raySpread, -raySpread, i/(rayCount - 1)) + rotation;
        const start = position;
        const end = {
            x: position.x - Math.sin(angle) * rayLenght,
            y: position.y - Math.cos(angle) * rayLenght,
        }

        rays[i] = [start, end];
    }

    for (var i = 0; i < rayCount; i++) {
        const angle = lerp(raySpread, -raySpread, i/(rayCount - 1)) + rotation;
        const start = position;
        const end = {
            x: position.x - Math.sin(angle) * rayLenght,
            y: position.y - Math.cos(angle) * rayLenght,
        }

        rays[i] = [start, end];
    }

    for (var i = 0; i < rayCount; i++) { 
        detections.push(getDetections(rays[i], roadBorders.flat()));

        function getDetections(ray, roadBorder) {
            let intersections = [];

            for(var i = 0; i < roadBorder.length; i++){
                const inters = getIntersection(
                    ray[0],
                    ray[1],
                    roadBorder[i].p1,
                    roadBorder[i].p2
                );
                if(inters){ intersections.push(inters); }
            }

            if(intersections.length == 0){ return null; }
            return intersections.reduce((prev, curr) => (curr.offset < prev.offset ? curr : prev));

        }
    }

  return (
    <>
        { rays.map((ray, index) => {
            if (detections[index]) {
                const points = [ray[0].x, ray[0].y, detections[index].x, detections[index].y ];
                return (
                    <>
                    <Line
                        strokeWidth={2}
                        stroke={"blue"}
                        points={points}
                        listening={false}
                        key={index}
                    />

                    <Arc 
                        x={detections[index].x}
                        y={detections[index].y}
                        outerRadius={5}
                        angle={360}
                        fill={"blue"}
                        listening={false}
                        key={index + 4}/>
                    </>
                )
            }

        })}
    </>
  )
}
