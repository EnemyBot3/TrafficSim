import React, { useEffect, memo, useContext, useRef, useMemo, useState } from 'react'
import { Line, Arc } from 'react-konva';
import { lerp, getIntersection, projectPoint, distance } from '../utils/math';
import { RoadContext } from '../roadCanvas';

const Sensors = ({position, rotation, sensorData, path}) => {
    const { state } = useContext(RoadContext)
    const rayCount = 5;
    const rayLenght = 200;
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

    useEffect(() => { setUpRays(); }, [rayCount, rayLenght, raySpread, position, rotation]);
    if (rays.current.length == 0) { setUpRays(); }


    useMemo(() => {
        detections.current = [] 

        for (var i = 0; i < rayCount; i++) {
            detections.current.push(getDetections(rays.current[i], path.flat()));

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

        sensorData(detections.current);
    }, [position, rotation, path, state])



    // useMemo(() => {
    //     const inRange = [];
    //     for (var i = 0; i < segments.length; i++) {
    //         const segment = segments[i];
    //         var {projection, offset} = projectPoint(position, segment);

    //         if (offset < 0) {projection = segment.start}
    //         else if ( offset > 1) {projection = segment.end}

    //         if (distance(position, projection) < roadWidth ){
    //             inRange.push(i)
    //         }
    //     }

    //     // const segmentsInRange = roadBorders.filter(r => inRange.indexOf(r.polyIndex) >= 0)
    //     const segmentsInRange = path.filter(r => inRange.indexOf(r.polyIndex) >= 0)

    //     detections.current = [] 

    //     for (var i = 0; i < rayCount; i++) {
    //         detections.current.push(getDetections(rays.current[i], segmentsInRange));
    //         function getDetections(ray, roadBorder) {
    //             let intersections = [];
    //             for(var i = 0; i < roadBorder.length; i++){
    //                 const inters = getIntersection( ray[0], ray[1], roadBorder[i].p1, roadBorder[i].p2 );
    //                 if(inters){ intersections.push(inters); }
    //             }

    //             if(intersections.length == 0){ return null; }
    //             return intersections.reduce((prev, curr) => (curr.offset < prev.offset ? curr : prev));
    //         }
    //     }

    //     sensorData(detections.current);

    // }, [position, rotation, path, state])

  return (
    <>
        { rays.current.map((ray, index) => {
            if (detections.current[index]) {
                const points = [ray[0].x, ray[0].y, detections.current[index].x, detections.current[index].y ];
                var c = "blue"
                if (index == 0) { c= "red"}
                return (
                    <>
                    <Line
                        strokeWidth={2}
                        stroke={c}
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
                        key={(index + 10).toString()}/>
                    </>
                )
            }

        })}
    </>
  )
}

export default memo(Sensors);