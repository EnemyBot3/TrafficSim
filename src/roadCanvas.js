import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { samePoint, sameArray, clamp, distance } from './utils/math';
import Konva from 'konva';
import Graph from './roadComponents/graph';
import RightContols from './uiComponents/rightContols';

export const RoadContext = React.createContext();

const RoadCanvas = () => {
  const scaleBy = 0.05;
  const [stageScale, setStageScale] = useState({x: 1, y: 1}) 
  const [stagePosition, setStagePosition] = useState({x: 0, y: 0})
  const selectedPoint = useRef(null);

  const [points, setPoints] =  useState([]);
  const [segments, setSegments] = useState([]);

  // {x: 100, y: 100, selected: false},
  // {x: 200, y: 200, selected: false},
  // {x: 300, y: 100, selected: false},
  // {x: 300, y: 200, selected: false},
  // {x: 100, y: 200, selected: false},
  // {x: 400, y: 400, selected: false},
  
  // [points[0]],
  // [points[1], points[2], points[3]],
  // [points[0], points[3]],
  // [points[0], points[2]],


  useEffect(() => {
    const savedPoints = localStorage.getItem("points");
    const savedSegments = localStorage.getItem("segments");

    if (savedPoints && savedSegments) {
      setPoints(JSON.parse(savedPoints));
      setSegments(JSON.parse(savedSegments));
    }

  }, []);

  const [previewLine, setPreviewLine] = useState([]);

  const updateGraph = ( points, segments ) => {
    setPoints(points);
    setSegments(segments);
  }

  const handleClick = (event) => {

    if (event.evt.button === 0){ handleLeftClick(event.target.getRelativePointerPosition()) } 
    else if (event.evt.button === 2) { handleRightClick(event.target.attrs) }

    function handleLeftClick({ x, y })  {
      const pointSelected = !(selectedPoint.current === null);

      if (!(event.target instanceof Konva.Arc)){
        const newPoints =  points.map(item => ({ ...item, selected: false }));
        setPoints([...newPoints, { x, y, selected: true}]);
        if (pointSelected) { setSegments([...segments, [selectedPoint.current, { x , y }]]) }
        selectedPoint.current = { x , y };
      }
      else if (event.target instanceof Konva.Arc) {
        const { x, y } = event.target.attrs;
        if (pointSelected) {
          if ( samePoint(selectedPoint.current, {x, y}) ) { return; }
          const newSegment = [selectedPoint.current, { x, y }]
          if (!segments.some(segment => segment.every(point => newSegment.some(newPoint => samePoint(newPoint, point) )))) {
            setSegments([...segments, newSegment])
          }
        }
        setPoints(points.map(item => ({ ...item, selected: samePoint(item, {x, y}) })));
        selectedPoint.current = { x, y };
      }

    }

    function handleRightClick({ x, y }) {
      setPreviewLine([]);

      if (event.target instanceof Konva.Arc) {
        if (selectedPoint.current !== null){ selectedPoint.current = null; return;}
        const newSegments = segments.map(segment => segment.filter(point => !( samePoint(point, {x, y}))));
        setSegments(newSegments.filter(segment => segment.length > 1));
        setPoints(points.filter(item => !(samePoint(item, {x, y}))));
      }
      else if (event.target instanceof Konva.Line) {      
        const { points } = event.target.attrs;
        setSegments(segments.filter(segment => !sameArray(segment.flatMap(item => [item.x, item.y]), points) ));
      } 
      else { 
        selectedPoint.current = null;
        setPoints(points.map(item => ({ ...item, selected: false }))); 
      }
    }

  }

  const handleMouseDown = (event) => {
    if (event.evt.button === 1) {
      event.target.startDrag();
    }
  }

  const handleMouseMove = (event) => {
    if (selectedPoint.current){
      var {x, y} = event.currentTarget.getRelativePointerPosition()
      setPreviewLine([selectedPoint.current.x, selectedPoint.current.y, x, y])
    } else if (previewLine.length !== 0) {
      console.log(previewLine)
      setPreviewLine([]);
    }
  }

  const dragBounds = (position) => {
    return {
      x: clamp(-1000, position.x, 1000), 
      y: clamp(-1000, position.y, 1000)}
  }

  const handleMouseWheel = (event) => {
    event.evt.preventDefault();
    
    const direction = event.evt.deltaY > 0 ? -1 : 1;
    const {x, y} = event.currentTarget.getPointerPosition()

    const mousePointTo = {
      x: (x - event.currentTarget.attrs.x) / event.currentTarget.attrs.scaleX,
      y: (y - event.currentTarget.attrs.y) / event.currentTarget.attrs.scaleY,
    }

    const newScale = { 
      x: clamp(0.15, event.currentTarget.attrs.scaleX + (scaleBy * direction), 1.7), 
      y: clamp(0.15, event.currentTarget.attrs.scaleY + (scaleBy * direction), 1.7) 
    }

    var newPosition = { 
      x: x - mousePointTo.x * newScale.x, 
      y: y - mousePointTo.y * newScale.y
    }

    setStageScale(newScale);
    setStagePosition(newPosition);
  }
 
  return (
    <RoadContext.Provider value={{points, setPoints, segments, setSegments}}>
      <Stage
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onWheel={handleMouseWheel}
        onContextMenu={(e) => e.evt.preventDefault()}
        dragBoundFunc={dragBounds}
        width={window.innerWidth} 
        height={window.innerHeight}
        scale={stageScale}
        position={stagePosition}
        className='canvas'>

          <Layer>
            <Text text="Try click on rect" />

              <Rect 
                x={0}
                y={0}
                width={100}
                height={100}
                fill={"red"}
                shadowBlur={5}
                onClick={() => {console.log(points); console.log(segments);}}
              />

              <Line
                strokeWidth={2}
                stroke={"black"}
                points={previewLine}
                dash={[3, 3]}
                listening={false}
              />

              <Graph 
                points={points}
                segments={segments}
                update={updateGraph}
              />

          </Layer>
      </Stage>

      <RightContols />

    </RoadContext.Provider>
  );
};

export default RoadCanvas;