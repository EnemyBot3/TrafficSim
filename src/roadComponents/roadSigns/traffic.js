import React, { useContext } from 'react'
import { Line, Shape, Circle } from 'react-konva';
import { translate, angle, samePoint, perpendicular, } from '../../utils/math';
import { roadWidth, Modes } from '../../utils/enums';
import { RoadContext } from '../../roadCanvas';

const circleHeight = 26;
const circleWidth = 20;

export const Traffic = ({center, direction, flipped, projection}) => {
  const { mode, setSigns } = useContext(RoadContext);

  const points = {
    redLight: translate(center, angle(perpendicular(direction)), -circleHeight  /  2 ),
    yellowLight: center,
    greenLight: translate(center, angle(perpendicular(direction)), circleHeight / 2)
  }

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
      <Line 
        strokeWidth={17}
        stroke={"black"}
        opacity={projection ? .5 : 1}
        points={[points.redLight.x,
            points.redLight.y, 
            points.greenLight.x,
            points.greenLight.y]}
        listening={mode == Modes.Markings && !projection} 
        lineCap={'round'}
        onClick={handleClick}/>

      <Circle 
        x={points.redLight.x}
        y={points.redLight.y}
        radius={5}
        fill='red'
        listening={false}/>

      <Circle 
        x={points.yellowLight.x}
        y={points.yellowLight.y}
        radius={5}
        fill='yellow'
        listening={false}/>

      <Circle 
        x={points.greenLight.x}
        y={points.greenLight.y}
        radius={5}
        fill='green'
        listening={false}/>

      <Line 
        strokeWidth={circleWidth * 2.2}
        stroke={"yellow"}
        opacity={0}
        points={hitbox}
        listening={mode == Modes.Markings && !projection} 
        onClick={handleClick}/>
    </>
  )
}
