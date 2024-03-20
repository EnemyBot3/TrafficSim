import React, { useEffect, memo, useContext, useRef, useMemo, useState } from 'react'
import { Line, Arc } from 'react-konva';
import { lerp, getIntersection, projectPoint, distance } from '../utils/math';
import { RoadContext } from '../roadCanvas';
import { roadWidth } from '../utils/enums';


const Sensors = ({position, rotation}) => {
    const { roadBorders, segments, polygons } = useContext(RoadContext)
    const rayCount = 5;
    const rayLenght = 100;
    const raySpread = Math.PI / 4;
    const rays = useRef([]);
    var detections = useRef([]);

    const setUpRays = () => {
        for (var i = 0; i < rayCount; i++) {
            const angle = lerp(raySpread, -raySpread, i/(rayCount - 1)) + rotation;
            const start = position;
            const end = {
                x: position.x - Math.sin(angle) * rayLenght,
                y: position.y - Math.cos(angle) * rayLenght,
            }

            rays.current[i] = [start, end];
        }
    }

    useEffect(() => { setUpRays();}, [rayCount, rayLenght, raySpread, position, rotation]);
    if (rays.current.length == 0) { setUpRays(); }

    // useMemo(() => {
    //     detections.current = [] 

    //     for (var i = 0; i < rayCount; i++) {
    //         detections.current.push(getDetections(rays.current[i], roadBorders.flat()));

    //         function getDetections(ray, roadBorder) {
    //             let intersections = [];

    //             for(var i = 0; i < roadBorder.length; i++){

    //                 const inters = getIntersection(
    //                     ray[0],
    //                     ray[1],
    //                     roadBorder[i].p1,
    //                     roadBorder[i].p2
    //                 );
    //                 if(inters){ intersections.push(inters); }
    //             }

    //             if(intersections.length == 0){ return null; }
    //             return intersections.reduce((prev, curr) => (curr.offset < prev.offset ? curr : prev));

    //         }
    //     }
    // }, [position, rotation, roadBorders])


    useMemo(() => {
        const inRange = [];
        for (var i = 0; i < segments.length; i++) {
            const segment = segments[i];
            var {projection, offset} = projectPoint(position, segment);

            if (offset < 0) {projection = segment[0]}
            else if ( offset > 1) {projection = segment[1]}

            if (distance(position, projection) < rayLenght + (roadWidth/2) ){
                inRange.push(i)
            }
        }

        const segmentsInRange = roadBorders.filter(r => inRange.indexOf(r.polyIndex) >= 0)
        detections.current = [] 

        for (var i = 0; i < rayCount; i++) {
            detections.current.push(getDetections(rays.current[i], segmentsInRange));
            function getDetections(ray, roadBorder) {
                let intersections = [];
                for(var i = 0; i < roadBorder.length; i++){
                    const inters = getIntersection( ray[0], ray[1], roadBorder[i].p1, roadBorder[i].p2 );
                    if(inters){ intersections.push(inters); }
                }

                if(intersections.length == 0){ return null; }
                return intersections.reduce((prev, curr) => (curr.offset < prev.offset ? curr : prev));
            }
        }

    }, [position, rotation, roadBorders])

  return (
    <>
        { rays.current.map((ray, index) => {
            if (detections.current[index]) {
                const points = [ray[0].x, ray[0].y, detections.current[index].x, detections.current[index].y ];
                return (
                    <>
                    <Line
                        strokeWidth={2}
                        stroke={"blue"}
                        points={points}
                        listening={false}
                        opacity={0.5}
                        key={index}
                    />

                    <Arc 
                        x={detections.current[index].x}
                        y={detections.current[index].y}
                        outerRadius={5}
                        opacity={0.5}
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

export default memo(Sensors);