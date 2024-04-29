import React, { useContext, useEffect, useRef } from 'react'
import { Line, Shape, Circle } from 'react-konva';
import { translate, angle, samePoint, getRandomColor, getRandomRGB } from '../../utils/math';
import { selectedVehicle, Modes, States, Vehicles } from '../../utils/enums';
import { RoadContext } from '../../roadCanvas';

const circleHeight = 30;
const circleWidth = 30;

export const Start = ({center, direction, flipped, projection, target}) => {
  const { mode, state, setSigns, setVehicles, vehicles, } = useContext(RoadContext);
  const rotation = flipped ? angle(direction) - Math.PI / 2 : angle(direction) + Math.PI / 2

  const intervalRef = useRef(null);
//   useEffect(() => {
//     if (!projection)  {
//       setSigns(signs => signs.map(sign => {
//         //samePoint(sign.center, selectedVehicle) && 
//         if (selectedVehicle && samePoint(sign.center, selectedVehicle)) {
//           return {...sign, target: center}
//         }
//         return sign
//       }))

//     }
//   }, [projection])

const spawnCar = () => {
    if (state == States.Play && !projection)  {
        setVehicles((vehicles) =>  [
          ...vehicles, {
            type: Vehicles.Car, 
            origin: center, 
            position: center, 
            rotation: -rotation, 
            color: getRandomRGB(), 
            target, target,
            direction,
            flipped,
            hitbox: [],
            deleted: false
        }])

   
        // setSigns((signs) => signs.filter(sign  => sign.center && !samePoint(sign.center, center)))
      }
}



  useEffect(() => {
      function interval() { spawnCar();}
      intervalRef.current = setInterval(interval, 2000);

      return () => { if (intervalRef.current) { clearInterval(intervalRef.current);  } };
  }, [state]);
  
  const hitbox = [
    ...Object.values(translate(center, angle(direction), -circleHeight  /  2 )),
    ...Object.values(translate(center, angle(direction), circleHeight / 2))
  ]

  const handleClick = (event) => {
    if (event.evt.button === 2) { 
      setSigns((signs) => signs.filter(sign  => !samePoint(sign.center, center)))
      if (intervalRef.current) { clearInterval(intervalRef.current); }
    }
  }

  return (
    <>
      <Circle 
        x={center.x}
        y={center.y}
        radius={15}
        opacity={ projection ? .3 : 1 }
        fill='green'
        listening={false}/>

      <Circle 
        x={center.x}
        y={center.y}
        radius={10}
        opacity={ projection ? .5 : 1 }
        fill='white'
        listening={false}/>

      <Circle 
        x={center.x}
        y={center.y}
        radius={5}
        opacity={ projection ? .3 : 1 }
        fill='green'
        listening={false}/>

      <Line 
        strokeWidth={circleWidth}
        stroke={"yellow"}
        opacity={0}
        points={hitbox}
        listening={mode == Modes.Markings && !projection} 
        onClick={handleClick}/>
    </>
  )
}
