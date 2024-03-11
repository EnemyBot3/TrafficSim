import React, { useContext } from 'react'
import { Line, Shape } from 'react-konva';
import { translate, angle, samePoint } from '../../utils/math';
import { roadWidth, Modes } from '../../utils/enums';
import { RoadContext } from '../../roadCanvas';

const stopHeight = 30;
const stopWidth = roadWidth / 2;

export const Stop = ({center, direction, flipped, projection}) => {
  const { mode, setSigns } = useContext(RoadContext);
  const points = [
    ...Object.values(translate(center, angle(direction), flipped? stopHeight * -1.3 : stopHeight)),
    ...Object.values(translate(center, angle(direction), flipped? -stopHeight : stopHeight * 1.3))
  ]

  const hitbox = [
    ...Object.values(translate(center, angle(direction), flipped? -stopHeight * 1.3 : -stopHeight * .7 )),
    ...Object.values(translate(center, angle(direction), flipped? stopHeight * .7 : stopHeight * 1.3 ))
  ]

  const handleClick = (event) => {
    if (event.evt.button === 2) { 
      setSigns((signs) => signs.filter(sign  => !samePoint(sign.center, center)))
    }
  }

  return (
    <>
      <Line 
        strokeWidth={stopWidth}
        stroke={"white"}
        points={points}
        opacity={ projection ? 0.5 : 1}
        listening={false} />

      <Shape 
        listening={false}
        sceneFunc={(ctx, shape) => {
          ctx.save();
          ctx.translate(center.x, center.y);
          ctx.rotate(flipped ? angle(direction) - Math.PI / 2 : angle(direction) + Math.PI / 2);
          ctx.scale(1, 3)
          ctx.opacity = projection ? 0.5 : 1;

          ctx.beginPath();
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillStyle = "white";
          ctx.font = "bold " + stopHeight / 2 + "px Arial";
          ctx.fillText("STOP", 0, 0);

          ctx.restore();
          ctx.fillStrokeShape(shape);
      }}/>

      <Line 
        strokeWidth={stopWidth}
        stroke={"yellow"}
        opacity={0}
        points={hitbox}
        listening={mode == Modes.Markings && !projection} 
        onClick={handleClick}/>
    </>
  )
}
