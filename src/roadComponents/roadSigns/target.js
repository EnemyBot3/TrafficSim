import React, { useContext, useEffect } from 'react'
import { Line, Shape, Circle } from 'react-konva';
import { translate, angle, samePoint } from '../../utils/math';
import { selectedVehicle, setSelectedVehicle, Modes, selectedStart, setSelectedStart } from '../../utils/enums';
import { RoadContext } from '../../roadCanvas';

const circleHeight = 30;
const circleWidth = 30;

export const Target = ({center, direction, flipped, projection}) => {
  const { mode, setSigns, setVehicles, vehicles, } = useContext(RoadContext);


  // console.log('selectedVehicle, center', selectedVehicle, center)
  useEffect(() => {
    if (!projection)  {
      setSigns(signs => signs.map(sign => {
        if (selectedVehicle && samePoint(sign.center, selectedVehicle)) {
          setSelectedVehicle(null)
          return {...sign, target: center}
        }
        if (selectedStart && samePoint(sign.center, selectedStart)) {
          setSelectedStart(null)
          return {...sign, target: center}
        }
        return sign
      }))

    }
  }, [projection])

  const hitbox = [
    ...Object.values(translate(center, angle(direction), -circleHeight  /  2 )),
    ...Object.values(translate(center, angle(direction), circleHeight / 2))
  ]

  const handleClick = (event) => {
    if (event.evt.button === 2) { 
      setSigns((signs) => signs.filter(sign  => !samePoint(sign.center, center)))
    }
  }

  return (
    <>
      <Circle 
        x={center.x}
        y={center.y}
        radius={15}
        opacity={ projection ? .3 : 1 }
        fill='red'
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
        fill='red'
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
