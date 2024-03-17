import React, { useContext } from 'react'
import { Line, Shape } from 'react-konva';
import { translate, angle, samePoint, perpendicular, scale, add } from '../../utils/math';
import { roadWidth, Modes } from '../../utils/enums';
import { RoadContext } from '../../roadCanvas';

const crossingHeight = 50;
const crossingWidth = roadWidth;

export const Crossing = ({center, direction, flipped, projection}) => {
  const { mode, setSigns } = useContext(RoadContext);
  const perp = perpendicular(direction);

  const points = [
    ...Object.values(add(center, scale(perp, crossingWidth / 2 ))),
    ...Object.values(add(center, scale(perp, -crossingWidth / 2 )))
  ]

  const hitbox = [
    ...Object.values(translate(center, angle(direction), crossingHeight * .6)),
    ...Object.values(translate(center, angle(direction), -crossingHeight * .6))
  ]

  const handleClick = (event) => {
    if (event.evt.button === 2) { 
      setSigns((signs) => signs.filter(sign  => !samePoint(sign.center, center)))
    }
  }

  return (
    <>
        <Line 
            strokeWidth={crossingHeight}
            stroke={"white"}
            dash={[11, 11]}
            points={points}
            opacity={ projection ? 0.3 : 1}
            listening={false} />
        
        <Line 
            strokeWidth={crossingWidth}
            points={hitbox}
            stroke={"white"}
            opacity={0}
            listening={mode == Modes.Markings && !projection} 
            onClick={handleClick}/>
    </>
  )

}
