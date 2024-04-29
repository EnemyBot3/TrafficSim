import React, { useEffect, memo, useContext, useRef, useMemo, useState } from 'react'
import { Line, Arc } from 'react-konva';
import { lerp, getIntersection, projectPoint, distance, samePoint } from '../utils/math';
import { RoadContext } from '../roadCanvas';
import { Colors, Vehicles } from '../utils/enums';

const Sensors = ({position, rotation, sensorData, path}) => {
    const { state, roadBorders, signs, vehicles } = useContext(RoadContext)
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
        const traffic = signs.filter(sign => sign.type == "Traffic"); 
        const cars = vehicles.filter(vehicle => !samePoint(vehicle.position, position))
        // const cars = vehicles
        // console.log('vehicles', vehicles)
        
        for (var i = 0; i < rayCount; i++) {
            detections.current.push(getDetections(rays.current[i], path.length > 0 ? path.flat(): roadBorders.flat()));

            function getDetections(ray, roadBorder) {
                let intersections = [];

                for(var i = 0; i < roadBorder.length; i++){

                    const inters = getIntersection(
                        ray[0],
                        ray[1],
                        roadBorder[i].p1,
                        roadBorder[i].p2
                    );
                    if(inters){ intersections.push({...inters, type: 'border'}); }
                }

                for(var i = 0; i < traffic.length; i++){

                    const inters = getIntersection(
                        ray[0],
                        ray[1],
                        {x: traffic[i].hitbox[0], y: traffic[i].hitbox[1]},
                        {x: traffic[i].hitbox[2], y: traffic[i].hitbox[3]}
                    );
                    if(inters && traffic[i].color == Colors.Red){ intersections.push({...inters, type: 'red'}); }
                    if(inters && traffic[i].color == Colors.Yellow){ intersections.push({...inters, type: 'yellow'}); }

                }

                for(var i = 0; i < cars.length; i++){

                    const inters = getIntersection(
                        ray[0],
                        ray[1],
                        {x: cars[i].hitbox[0], y: cars[i].hitbox[1]},
                        {x: cars[i].hitbox[2], y: cars[i].hitbox[3]}
                    );
                    // console.log('inters',inters, ray[0],
                    // ray[1], traffic,
                    // {x: traffic[i].hitbox[0], y: traffic[i].hitbox[1]},
                    // {x: traffic[i].hitbox[2], y: traffic[i].hitbox[3]})
                    if(inters){ intersections.push({...inters, type: 'car'}); }
                }



                if(intersections.length == 0 ){ return null; }
                return intersections.reduce((prev, curr) => (curr.offset < prev.offset ? curr : prev));

            }
        }

        sensorData(detections.current);
    }, [position, rotation, path, state, signs, vehicles])


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
                        key={Math.random()}
                    />

                    <Arc 
                        x={detections.current[index].x}
                        y={detections.current[index].y}
                        outerRadius={5}
                        opacity={0.5}
                        angle={360}
                        fill={"blue"}
                        listening={false}
                        key={Math.random()}/>
                    </>
                )
            }

        })}
    </>
  )
}

export default memo(Sensors);