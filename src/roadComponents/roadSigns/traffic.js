import React, { useContext, useEffect, useState } from 'react'
import { Line, Shape, Circle } from 'react-konva';
import { translate, angle, samePoint, perpendicular, } from '../../utils/math';
import { roadWidth, Modes, Colors } from '../../utils/enums';
import { RoadContext } from '../../roadCanvas';

const circleHeight = 26;
const circleWidth = 20;

export const Traffic = ({center, direction, flipped, projection}) => {
  const { mode, setSigns } = useContext(RoadContext);
  const [color, setColor] = useState(Colors.Red);


  const nextColor = () => {
    setColor(old => {
      let c;
      if (old == Colors.Red) c = Colors.Green;
      else if (old == Colors.Green) c = Colors.Yellow;
      else if (old == Colors.Yellow) c = Colors.Red;

      setSigns( oldS => oldS.map( sign => samePoint(sign.center, center) ? {...sign, color: c} : sign ))
      
      return c;
    })
  }



  const points = {
    redLight: translate(center, angle(perpendicular(direction)), -circleHeight  /  2 ),
    yellowLight: center,
    greenLight: translate(center, angle(perpendicular(direction)), circleHeight / 2)
  }

  const hitbox = [
    ...Object.values(translate(center, angle(perpendicular(direction)), -circleHeight )),
    ...Object.values(translate(center, angle(perpendicular(direction)), circleHeight ))
  ]

  const handleClick = (event) => {
    if (event.evt.button === 2) { 
      setSigns((signs) => signs.filter(sign  => !samePoint(sign.center, center)))
    }
  }

  useEffect(() => {
    
    function interval() { nextColor();}
    setInterval(interval, 5000)
    setSigns( oldS => oldS.map( sign => samePoint(sign.center, center) ? {...sign, hitbox, color} : sign ))

    return () => {
      clearInterval(interval)
    };
  }, []);


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
        opacity={color == Colors.Red ? 1 : 0.2}
        x={points.redLight.x}
        y={points.redLight.y}
        radius={5}
        fill='red'
        listening={false}/>

      <Circle 
        opacity={color == Colors.Yellow ? 1 : 0.2}
        x={points.yellowLight.x}
        y={points.yellowLight.y}
        radius={5}
        fill='yellow'
        listening={false}/>

      <Circle 
        opacity={color == Colors.Green ? 1 : 0.2}
        x={points.greenLight.x}
        y={points.greenLight.y}
        radius={5}
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
