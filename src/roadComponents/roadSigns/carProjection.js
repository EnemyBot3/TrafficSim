import React, { useEffect, useContext } from 'react'
import { Line, Shape, Image } from 'react-konva';
import { translate, angle, samePoint, radsToDegs } from '../../utils/math';
import { roadWidth, Modes, Vehicles } from '../../utils/enums';
import { RoadContext } from '../../roadCanvas';
import Car from '../../carComponents/car';
import carSrc from '../../assets/images/car.png'
import useImage from 'use-image';

const carHeight = 50;
const carWidth = 30;

export const CarProjection = ({center, direction, flipped, projection}) => {
  const { mode, setSigns, setVehicles } = useContext(RoadContext);
  const [car] = useImage(carSrc);
  const rotation = flipped ? angle(direction) - Math.PI / 2 : angle(direction) + Math.PI / 2

  const hitbox = [
    ...Object.values(translate(center, angle(direction), carHeight/2 )),
    ...Object.values(translate(center, angle(direction), -carHeight/2 ))
  ]

  const handleClick = (event) => {
    if (event.evt.button === 2) { 
      setSigns((signs) => signs.filter(sign  => !samePoint(sign.center, center)))
    }
  }

  if (!projection) {
    setVehicles((vehicles) => [...vehicles, {type: Vehicles.Car, origin: center, rotation}])
    setSigns((signs) => signs.filter(sign  => !samePoint(sign.center, center)))
    return;
  }

  return (
    <>
      {car  &&  
        <Shape 
          listening={false}
          opacity={projection ? 0.3 : 0}
          sceneFunc={(ctx, shape) => {
            ctx.save();
            ctx.translate(center.x, center.y);
            ctx.rotate(rotation);
            ctx.drawImage(car, -carWidth /2, -carHeight /2);

            ctx.restore();
            ctx.fillStrokeShape(shape);
      }}/>}

      <Line 
        strokeWidth={carWidth}
        stroke={"yellow"}
        opacity={0}
        points={hitbox}
        listening={mode == Modes.Markings && !projection} 
        onClick={handleClick}/>
    </>
  )
}
