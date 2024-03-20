import React, { useState, useEffect, useRef, memo } from 'react'
import useImage from 'use-image';
import { Line, Shape } from 'react-konva';
import { samePoint } from '../utils/math';
import carSrc from '../assets/images/car.png'
import Sensors from './sensors';

const size = { w: 30, h: 50 };

const Car = ({origin, direction, rotation}) => {
    const [position, setPosition] = useState(origin);
    const [carImg] = useImage(carSrc)

    const acceleration = 0.5;
    const maxSpeed = 5;
    const friction = 0.1;

    const left = useRef(false);
    const right = useRef(false);
    const forward = useRef(false);
    const reverse = useRef(false);
    const speed= useRef(0);
    const angle= useRef(-rotation);
    const oldPos = useRef(position);
    const requestRef = useRef()
    

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key == "ArrowLeft" ) { left.current = true    }
            if (event.key == "ArrowRight") { right.current = true   }
            if (event.key == "ArrowUp"   ) { forward.current = true }
            if (event.key == "ArrowDown" ) { reverse.current = true }
        };

        const onKeyUp = (event) => {
            if (event.key == "ArrowLeft" ) { left.current = false    }
            if (event.key == "ArrowRight") { right.current = false   }
            if (event.key == "ArrowUp"   ) { forward.current = false }
            if (event.key == "ArrowDown" ) { reverse.current = false }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        requestRef.current = requestAnimationFrame(updatePosition);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            cancelAnimationFrame(requestRef.current);
        };
    }, []);


    const updatePosition = () => {

        if (forward.current) { speed.current = Math.min(speed.current + acceleration,  maxSpeed    )}
        if (reverse.current) { speed.current = Math.max(speed.current - acceleration, -maxSpeed / 2)}

        if (speed.current > 0){ speed.current -= friction }
        if (speed.current < 0){ speed.current += friction }
        if (Math.abs(speed.current) < friction){ speed.current = 0 }

        if (speed.current != 0){
            const flip = speed.current > 0 ? 1 : -1;
            if (left.current ) { angle.current += 0.03 * flip }
            if (right.current) { angle.current -= 0.03 * flip }
        }

        const x = oldPos.current.x - Math.sin(angle.current) * speed.current;
        const y = oldPos.current.y - Math.cos(angle.current) * speed.current;

        if (!samePoint(oldPos.current, {x, y})){

            setPosition((prev) => { oldPos.current = prev; return {x, y} });
        }

        requestRef.current = requestAnimationFrame(updatePosition);
    }

    return (
        <>
        {carImg && <Shape
            listening={false}
            sceneFunc={(ctx, shape) => {
                ctx.save();
                ctx.translate(position.x, position.y);
                ctx.rotate(-angle.current);
                ctx.drawImage(carImg, -size.w / 2, -size.h / 2);
                ctx.restore();
                ctx.fillStrokeShape(shape);
            }}
        /> }
        <Sensors position={position} rotation={angle.current}/>
        </>
    );
};

export default memo(Car);
