import React, { useState, useRef, useEffect, useContext, memo } from 'react'
import useImage from 'use-image';
import Konva from 'konva'; 
import { Line, Shape, Layer, Image, Arc, Text } from 'react-konva';
import { radsToDegs, samePoint, getNearestPoint, projectPoint, pointStr, strPoint, generatePoly, getNearestSegment, translate, squareDistance, distance } from '../utils/math';
import carSrc from '../assets/images/car.png'
import Sensors from './sensors';
import { RoadContext } from '../roadCanvas'; 
import { States, Modes, displayTrail } from '../utils/enums';

const size = { w: 30, h: 50 };

const Car = ({position, rotation, origin, direction, flipped, color, update, target, deleted}) => {
    const {mode, state, setVehicles, polygons, segments, points, graph} = useContext(RoadContext)
    const [carImg] = useImage(carSrc)
    const [path, setPath] =  useState([])
    const [polys, setPolys] = useState([])
    const imageRef = React.useRef();

    const acceleration = 0.5;
    const maxSpeed     = 5  ;
    const friction     = 0.2;

    const left    = useRef(false);
    const right   = useRef(false);
    const forward = useRef(false);
    const reverse = useRef(false);
    const speed   = useRef(0);
    const oldPos  = useRef(position);
    
    const turnRadius = useRef(0.01); //0.03
    const requestRef = useRef()
    const _state = useRef(state);
    const oldTarget = useRef(target);

    React.useEffect(() => { carImg && imageRef.current.cache(); }, [carImg]);

    const hitbox = (p1) => { 
        const pos = p1? p1 : position
        return[
        ...Object.values(translate(pos , rotation * -1 + Math.PI, -size.w /3 )),
        ...Object.values(translate(pos , rotation * -1 + Math.PI, size.w / 3))
    ]}

    useEffect(() => {
        setVehicles(old => old.map((car) => !car.deleted && samePoint(car.position, position) ? {...car, hitbox} : car ))
        
    }, []);

    useEffect(() => {

        if (!target) return;

        const startPoint = pointStr(getNearestPoint(position, points))
        const endPoint = pointStr(getNearestPoint(target, points))

        const distances = {};
        const predecessors = {};
        const visited = new Set();

        let nodes = Object.keys(graph);
        for (let node of nodes) { distances[node] = Infinity; }
        distances[startPoint] = 0;
    
        while (nodes.length) {
            nodes.sort((a, b) => distances[a] - distances[b]);
            const closestNode = nodes.shift();
    
            if (distances[closestNode] === Infinity) break;
            visited.add(closestNode);
    
            for (let neighbor in graph[closestNode]) {
                if (!visited.has(neighbor)) {
                    let newDistance = distances[closestNode] + graph[closestNode][neighbor];
                    if (newDistance < distances[neighbor]) {
                        distances[neighbor] = newDistance;
                        predecessors[neighbor] = closestNode;
                    }
                }
            }
        }
    
        // Path reconstruction
        let newPath = [];
        let current = endPoint;
        
        while (current && current !== startPoint) {
            newPath.unshift(current);
            current = predecessors[current];
        }
        newPath.unshift(pointStr(projectPoint(position, getNearestSegment(position, segments)).projection));
        setPath(newPath.map(s => strPoint(s)))
        setPolys(generatePoly(newPath.map(s => strPoint(s))))

    }, [polygons, target])

    useEffect(() => {
        if (deleted) return

        const onKeyDown = (event) => {
            if (event.key == "ArrowLeft" ) { left.current    = true }
            if (event.key == "ArrowRight") { right.current   = true }
            if (event.key == "ArrowUp"   ) { forward.current = true }
            if (event.key == "ArrowDown" ) { reverse.current = true }
        };

        const onKeyUp = (event) => {
            if (event.key == "ArrowLeft" ) { left.current    = false }
            if (event.key == "ArrowRight") { right.current   = false }
            if (event.key == "ArrowUp"   ) { forward.current = false }
            if (event.key == "ArrowDown" ) { reverse.current = false }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        requestRef.current = requestAnimationFrame(updatePosition);

        return () => {
            if (deleted) return
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const sensorData = (data) => {

        // console.log('data', data)
        _state.current = state

        left.current  = false;
        right.current = false;
        reverse.current = false;
        turnRadius.current = 0.01
        
        if (!data[2] || data[2].offset > 0.3) { forward.current = true } 
        // else { forward.current = false}

        if (!data[1] || data[1].offset > 0.4 ) { left.current = true; }
        
        if (!data[3]) { right.current = true; } 

        if (!data[0] || data[0].offset > 0.3) {
            turnRadius.current = 0.1
            speed.current *= 0.9;
        }

        if (data[2] && data[2].offset < 0.4) {
            turnRadius.current = 0.12
            speed.current *= 0.9;
            right.current = true;
            left.current  =  false;
        }

        if (data[2] && data[2].offset < 0.8 && data[2].type == 'car') {
            turnRadius.current = 0.01
            right.current = false;
            left.current  =  false;
            forward.current = false;
        }

        if (data[2] && data[2].offset < 0.8 && data[2].type == 'red') {
            turnRadius.current = 0.01
            right.current = false;
            left.current  =  false;
            forward.current = false;
        }

        if (data[2] && data[2].offset < 0.8 && data[2].type == 'yellow') {
            turnRadius.current = 0.01
            right.current = false;
            left.current  =  false;
            speed.current *= 0.8;

            if (speed.current < 0.2 * maxSpeed) {
                forward.current = false;
            }
        }



    }


    const updatePosition = () => {

        if (_state.current == States.Pause) {
            requestRef.current = requestAnimationFrame(updatePosition);
            return;
        }

        if (forward.current) { speed.current = Math.min(speed.current + acceleration,  maxSpeed    )}
        if (reverse.current) { speed.current = Math.max(speed.current - acceleration, -maxSpeed / 2)}

        if (speed.current > 0){ speed.current -= friction }
        if (speed.current < 0){ speed.current += friction }
        if (Math.abs(speed.current) < friction){ speed.current = 0 }

        if (speed.current != 0){
            const flip = speed.current > 0 ? 1 : -1;
            if (left.current ) { rotation += turnRadius.current * flip }
            if (right.current) { rotation -= turnRadius.current * flip }
        }

        const x = oldPos.current.x - Math.sin(rotation) * speed.current;
        const y = oldPos.current.y - Math.cos(rotation) * speed.current;

        if (!samePoint(oldPos.current, {x, y})){
            if (target && distance({x, y}, target) < 100) {
                target = target == origin ? oldTarget.current : origin;
                console.log('here')
            }
            // console.log({x, y}, target, distance({x, y}, target))
            update(oldPos.current, {position: {x, y}, rotation, hitbox: hitbox({x, y}), target})
            oldPos.current = {x, y}
        }

        requestRef.current = requestAnimationFrame(updatePosition);
    }

    const handleClick = (event) => {
        if (event.evt.button === 2) { 
            setVehicles(oldvehicles => oldvehicles.map(car => samePoint(car.position, position) ? {...car, deleted: true} : car ))
        }
    }

    return (
        <>
        { carImg && <Image
            ref={imageRef}
            x={position.x}
            y={position.y}
            image={carImg}
            offsetX={size.w/2}
            offsetY={size.h/2}
            filters={[Konva.Filters.RGB]}
            red={color.r}
            green={color.g}
            blue={color.b}
            rotation={radsToDegs(-rotation)} 
            listening={mode == Modes.Cars}
            onClick={handleClick}/>
        }

        {/* { path.length > 0 &&
            path.map(p => <Arc 
                x={p.x}
                y={p.y}
                outerRadius={10}
                angle={360}
                fill={"red"}
                listening={false}/>)
        } */}

        {
            //borders
            polys.length > 0 && displayTrail &&
            polys.map((l, index) => {
                return <Line
                    key={index} 
                    strokeWidth={5}
                    stroke={"rgb(" +color.r+ ", " + color.g+ ", " + color.b + ")"}
                    lineCap={'round'}
                    listening={false}
                    points={[l.p1.x, l.p1.y, l.p2.x, l.p2.y]} />
            })
        }

        {/* <Line 
            // strokeWidth={size.w}
            stroke={"yellow"}
            opacity={1}
            points={hitbox()}
            listening={false}/> */}

        <Sensors position={position} rotation={rotation} sensorData={sensorData} path={polys}/>
        </>
    );
};

export default memo(Car);
