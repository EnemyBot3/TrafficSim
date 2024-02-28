import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Arc } from 'react-konva';
import Konva from 'konva';
import Graph from './roadComponents/graph';

const RoadCanvas = () => {
  var selectedPoint = useRef(null);;

  const [drag, setDrag] = useState(false);
  const [points, setPoints] =  useState([
    {x: 100, y: 100, selected: false},
    {x: 200, y: 200, selected: false},
    {x: 300, y: 100, selected: false},
    {x: 300, y: 200, selected: false},
    {x: 100, y: 200, selected: false},
    {x: 400, y: 400, selected: false},
  ]);

  const [segments, setSegments] = useState([
    [points[0]],
    [points[1], points[2], points[3]],
    [points[0], points[3]],
    [points[0], points[2]],
  ]);

  const updateGraph = ( points, segments ) => {
    setPoints(points);
    setSegments(segments);
  }

  const handleClick = (event) => {
        console.log(event)

    if (event.evt.button === 0){ // left cliick
      const { x, y } = event.target.attrs;
      
      if (selectedPoint.current === null) {
        if (event.target instanceof Konva.Arc) {

          selectedPoint.current = {x, y};
          setPoints(points.map(item => ({ ...item, selected: item.x === x && item.y === y })));
        } 
        else if (!(event.target instanceof Konva.Arc)) {

          selectedPoint.current = {x: event.evt.layerX, y: event.evt.layerY};
          const newPoints =  points.map(item => ({ ...item, selected: false }));
          setPoints([...newPoints, {x: event.evt.layerX, y: event.evt.layerY, selected: true}]);         
        }
      } else {
        if (event.target instanceof Konva.Arc) {

          setPoints(points.map(item => ({ ...item, selected: item.x === x && item.y === y })));
          setSegments([...segments, [selectedPoint.current, {x, y}]])
          selectedPoint.current = {x, y};
        } 
        else if (!(event.target instanceof Konva.Arc)) {
         

          const newPoints =  points.map(item => ({ ...item, selected: false }));
          setPoints([...newPoints, {x: event.evt.layerX, y: event.evt.layerY, selected: true}]);     
          setSegments([...segments, [selectedPoint.current, {x: event.evt.layerX, y: event.evt.layerY}]])
          selectedPoint.current = {x: event.evt.layerX, y: event.evt.layerY};

        }
      }

    } else if (event.evt.button === 2) { // right click 
        selectedPoint.current = null;

      if (event.target instanceof Konva.Arc) {
        const { x, y } = event.target.attrs;

        setSegments(segments.map(segment => segment.filter(point => !(point.x === x && point.y === y))));
        setPoints(points.filter(item => !(x === item.x && y === item.y)));
      }
      else if (event.target instanceof Konva.Line) {

        const { points } = event.target.attrs;
        setSegments(segments.filter(segment => !(segment.flatMap(item => [item.x, item.y]).toString() === points.toString())));
      } else {

        setPoints(points.map(item => ({ ...item, selected: false })));
      }
    }

  }

  const handleMouseDown = (event) => {
    if (event.evt.button === 1) {
      event.target.startDrag();
    }
  }



  return (
    <Stage 
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.evt.preventDefault()}
      width={window.innerWidth} 
      height={window.innerHeight}
      draggable
      className='canvas'>

        <Layer>
          <Text text="Try click on rect" />

            <Rect 
              x={20}
              y={20}
              width={50}
              height={50}
              fill={"red"}
              shadowBlur={5}
            />

            <Graph 
              points={points}
              segments={segments}
              update={updateGraph}
            />

        </Layer>
    </Stage>

  );
};

export default RoadCanvas;