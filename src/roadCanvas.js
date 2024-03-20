import React, { useState, useRef, useEffect } from 'react';

import { samePoint, sameArray, clamp, projectPoint } from './utils/math';
import { Modes } from './utils/enums';

import Konva from 'konva';
import { Stage, Layer, Rect, Text, Line, Shape, Arc } from 'react-konva';

import Graph from './roadComponents/graph';

import MarkingsEditor from './roadComponents/markings';
import { Sign } from './roadComponents/roadSigns/sign';

import Vehicle from './carComponents/vehicle';

import RightContols from './uiComponents/rightContols';
import BottomControls from './uiComponents/bottomControls';


export const RoadContext = React.createContext();

const RoadCanvas = () => {
  const stage = useRef(null);

  const scaleBy = 0.05;
  const [stageScale, setStageScale] = useState({x: 1, y: 1});
  const [stagePosition, setStagePosition] = useState({x: 0, y: 0});

  const [mode, setMode] = useState(Modes.Graphs);

  const selectedPoint = useRef(null);
  const [points, setPoints] =  useState([]);
  const [segments, setSegments] = useState([]);

  const [polygons, setPolygons] = useState([]);
  const [roadBorders, setRoadBorders] = useState([]);
  const [selectedPoly, setSelectedPoly] = useState(null);
  const [signs, setSigns] = useState([]);
  const [vehicles, setVehicles] = useState([]);

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
    const savedSigns = localStorage.getItem("signs");
    const savedStage = localStorage.getItem("stage");

    if (savedPoints && savedSegments && savedSigns) {
      setPoints(JSON.parse(savedPoints));
      setSegments(JSON.parse(savedSegments));
      setSigns(JSON.parse(savedSigns));
      setStageScale(JSON.parse(savedStage).stageScale);
      setStagePosition(JSON.parse(savedStage).stagePosition);
    }
  }, []);

  useEffect(() => {
    if (mode == Modes.Markings) {
      selectedPoint.current = null;
      setPreviewLine([]);
    }
  }, [mode])

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

      if (event.target instanceof Konva.Line){
        const newPoints =  points.map(item => ({ ...item, selected: false }));
        setPoints([...newPoints, { x, y, selected: true}]);
        
        const segPoints = event.target.attrs.points;
        var newSegments = segments.filter(segment => !sameArray([segment[0].x, segment[0].y, segment[1].x, segment[1].y], segPoints) );
        newSegments = [...newSegments, [{ x: segPoints[0] , y: segPoints[1] }, { x, y }],  [{ x: segPoints[2] , y: segPoints[3] }, { x, y }] ];

        if (pointSelected) { setSegments([...newSegments, [selectedPoint.current, { x , y }]]); }
        else { setSegments(newSegments); }
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
      else {
        const newPoints =  points.map(item => ({ ...item, selected: false }));
        setPoints([...newPoints, { x, y, selected: true}]);
        if (pointSelected) { setSegments([...segments, [selectedPoint.current, { x , y }]]) }
        selectedPoint.current = { x , y };
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
      event.currentTarget.startDrag();
    }
  }

  const handleMouseMove = (event) => {
    var {x, y} = event.currentTarget.getRelativePointerPosition()

    if (mode == Modes.Graphs) {
      if (selectedPoint.current){ setPreviewLine([selectedPoint.current.x, selectedPoint.current.y, x, y]) } 
      else if (previewLine.length !== 0) { setPreviewLine([]); }
    } 
  }

  const dragBounds = (position) => {
    return {
      x: clamp(-2000, position.x, 2000), 
      y: clamp(-2000, position.y, 2000)}
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
      x: clamp(0.05, event.currentTarget.attrs.scaleX + (scaleBy * direction), 1.7), 
      y: clamp(0.05, event.currentTarget.attrs.scaleY + (scaleBy * direction), 1.7) 
    }

    var newPosition = { 
      x: x - mousePointTo.x * newScale.x, 
      y: y - mousePointTo.y * newScale.y
    }

    setStageScale(newScale);
    setStagePosition(newPosition);
  }

  return (
    <RoadContext.Provider value={{points, setPoints, segments, setSegments, mode, setMode, polygons, setPolygons, selectedPoly, setSelectedPoly, signs, setSigns, vehicles, setVehicles, stageScale, setStageScale, stagePosition, setStagePosition, roadBorders, setRoadBorders}}>
      <Stage
        ref={stage}
        onClick={mode == Modes.Graphs ? handleClick: null}
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
                onClick={() => {
                  console.log("points", points); 
                  console.log("segments", segments); 
                  console.log("signs", signs); 
                  console.log("polygons", polygons);
                  console.log('vehicles', vehicles)
                }}
              />

              <Graph 
                points={points}
                segments={segments}
                update={updateGraph}
              />
              
              <Line
                strokeWidth={2}
                stroke={"black"}
                points={previewLine}
                dash={[3, 3]}
                listening={false}
              />

           { selectedPoly !== null &&
              <>
                {(mode == Modes.Markings || mode == Modes.Cars) &&
                 <MarkingsEditor 
                  polygon={polygons[selectedPoly]} 
                  segment={segments[selectedPoly]} />
                }
              </>
            }

            {signs.map((sign, index) => 
              <Sign 
                key={index}
                type={sign.type} 
                center={sign.center} 
                direction={sign.direction} 
                flipped={sign.flipped}
            />)}

            {vehicles.map((car, index) => 
              <Vehicle 
                key={index}
                type={car.type} 
                origin={car.origin} 
                rotation={car.rotation} 
              />)}

            {/* <Car /> */}

          </Layer>
      </Stage>

      <RightContols />
      <BottomControls />

    </RoadContext.Provider>
  );
};

export default RoadCanvas;