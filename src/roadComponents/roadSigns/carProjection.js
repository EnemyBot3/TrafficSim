import React, { useEffect, useContext, useRef } from 'react'
import Konva from 'konva'; 
import { Line, Shape, Image } from 'react-konva';
import { translate, angle, samePoint, radsToDegs, getRandomColor, getRandomRGB } from '../../utils/math';
import { States, Modes, Vehicles } from '../../utils/enums';
import { RoadContext } from '../../roadCanvas';
import Car from '../../carComponents/car';
import carSrc from '../../assets/images/car.png'
import useImage from 'use-image';

const carHeight = 50;
const carWidth = 30;

export const CarProjection = ({center, direction, flipped, projection, target}) => {
  const { setSigns, mode, state, setVehicles } = useContext(RoadContext);
  const [car] = useImage(carSrc);
  const imageRef = React.useRef();
  const rotation = flipped ? angle(direction) - Math.PI / 2 : angle(direction) + Math.PI / 2
  const color = useRef(getRandomRGB());
  const hidden = useRef(false);

  React.useEffect(() => { car && imageRef.current.cache(); }, [car]);

  useEffect(() => {  
    if (!center) return;
    if (hidden.current) return;
    if (!car) return;

    if (state == States.Play && !projection)  {
      setVehicles((vehicles) =>  [
        ...vehicles, {
          type: Vehicles.Car, 
          origin: center, 
          position: center, 
          rotation: -rotation, 
          color: color.current, 
          target: target,
          deleted: false
      }])

      hidden.current = true;
      return;
 
      // setSigns((signs) => signs.filter(sign  => sign.center && !samePoint(sign.center, center)))
    }

    // console.log('HERTE')
  }, [state, projection, car])

//   if (mode == Modes.Playing) {
//     console.log('here')
//     if (!center) return;

//     setVehicles((vehicles) =>  [
//       ...vehicles, {
//         type: Vehicles.Car, 
//         origin: center, 
//         position: center, 
//         rotation: -rotation, 
//         color:  getRandomRGB(), 
//         deleted: false
//       }])
//     setSigns((signs) => signs.filter(sign  => sign.center && !samePoint(sign.center, center)))
//     return;
//   } else {
// console.log('here')
//   }
// console.log('projection', projection)
// console.log(Modes.Markings, mode , !projection)

  const handleClick = (event) => {
    if (event.evt.button === 2) { 
      setSigns((signs) => signs.filter(sign => !samePoint(sign.center, center)))
    }
  }

  if (hidden.current) {return}

  return (
    <>
      {car && <Image 
        ref={imageRef}
        x={center.x}
        y={center.y}
        image={car}
        filters={[Konva.Filters.RGB]}
        red={color.current.r}
        green={color.current.g}
        blue={color.current.b}
        offsetX={carWidth/2}
        offsetY={carHeight/2}
        rotation={radsToDegs(rotation)} 
        opacity={projection ? 0.3 : mode == Modes.Play ? 0 : 1}
        listening={mode == Modes.Cars && !projection}
        onClick={handleClick}
      />
      //   <Shape 
      //     listening={false}
      //     opacity={projection ? 0.3 : 1}
      //     sceneFunc={(ctx, shape) => {
      //       ctx.save();
      //       ctx.translate(center.x, center.y);
      //       ctx.rotate(rotation);
      //       ctx.drawImage(car, -carWidth /2, -carHeight /2);

      //       ctx.restore();
      //       ctx.fillStrokeShape(shape);
      // }}/>
    }
    </>
  )
}
