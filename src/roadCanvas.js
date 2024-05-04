import React, { useState, useRef, useEffect } from 'react';

import { samePoint, sameArray, clamp, sameSegment, pointStr, distance, getIntersection } from './utils/math';
import { Blueprints, Markings, Modes, States, Vehicles, selectedBlueprint } from './utils/enums';

import Konva from 'konva';
import { Stage, Layer, Rect, Text, Line, Shape, Arc } from 'react-konva';

import Graph from './roadComponents/graph';

import MarkingsEditor from './roadComponents/markings';
import { Sign } from './roadComponents/roadSigns/sign';

import Garage from './carComponents/garage';

import RightContols from './uiComponents/rightContols';
import BottomControls from './uiComponents/bottomControls';

import roundabout from './assets/blueprints/roundabout.world';
import intersection from './assets/blueprints/intersection.world';
import cloverleaf from './assets/blueprints/cloverleaf.world'
import diamond from './assets/blueprints/diamond.world'

export const RoadContext = React.createContext();

const RoadCanvas = () => {
  const stage = useRef(null);

  const scaleBy = 0.05;
  const [stageScale, setStageScale] = useState({x: 1, y: 1});
  const [stagePosition, setStagePosition] = useState({x: 0, y: 0});

  const [mode, setMode] = useState(Modes.Graphs);
  const [state, setState] = useState(States.Pause);

  const selectedPoint = useRef(null);
  const [points, setPoints] =  useState([]);
  const [segments, setSegments] = useState([]);
  const [graph, setGraph] = useState({});

  const [polygons, setPolygons] = useState([]);
  const [roadBorders, setRoadBorders] = useState([]);
  const [selectedPoly, setSelectedPoly] = useState(null);
  const [signs, setSigns] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [generatingBorders, setGeneratingBorders] = useState(false);

  const ctrlkey = useRef(false);

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
    // const savedVehicles = localStorage.getItem("vehicles");
    const savedStage = localStorage.getItem("stage");

    if (savedPoints && savedSegments && savedSigns) {
      setPoints(JSON.parse(savedPoints));
      setSegments(JSON.parse(savedSegments));
      setSigns(JSON.parse(savedSigns));
      // setVehicles(JSON.parse(savedVehicles))
      setStageScale(JSON.parse(savedStage).stageScale);
      setStagePosition(JSON.parse(savedStage).stagePosition);
    }
  }, []);

  useEffect(() => {
    const newGraph = {};
    const nodes = [];
    const edges = JSON.parse(JSON.stringify(segments));

    for (let i = 0; i < edges.length - 1; i++){
      for (let j = i + 1; j < edges.length; j++){
        const inters = getIntersection( edges[i].start, edges[i].end, edges[j].start, edges[j].end );

        if (inters && inters.offset != 1 && inters.offset != 0){
          const point = {x: inters.x, y: inters.y};

          let aux = edges[i].end;
          edges[i].end = point
          nodes.push({start: point, end: aux})

          aux = edges[j].end;
          edges[j].end = point
          nodes.push({start: point, end: aux})
        }
      }
    }
    edges.push(...nodes);

    edges.forEach(edge => {
      const start = pointStr(edge.start);
      const end = pointStr(edge.end);
      const dist = distance(edge.start, edge.end);

      if (!newGraph[start]) { newGraph[start] = {}; }
      if (!newGraph[end])   { newGraph[end] = {}; }

      newGraph[start][end] = dist;
      if(!edge.oneWay) { newGraph[end][start] = dist; }
    });
    setGraph(newGraph);
  }, [points])

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key == "Control" ) { ctrlkey.current = true } };
    const onKeyUp = (event) => { if (event.key == "Control" ) { ctrlkey.current = false } };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [polygons]);

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
        var newSegments = segments.filter(segment => !sameArray([segment.start.x, segment.start.y, segment.end.x, segment.end.y], segPoints) );
        newSegments = [...newSegments, {start:{ x: segPoints[0] , y: segPoints[1] }, end: { x, y }},  {start:{ x: segPoints[2] , y: segPoints[3] }, end:{ x, y }} ];

        if (pointSelected) { setSegments([...newSegments, { start: selectedPoint.current, end: { x , y } }]); }
        else { setSegments(newSegments); }
        selectedPoint.current = { x , y };
      }
      else if (event.target instanceof Konva.Arc) {
        const { x, y } = event.target.attrs;
        if (pointSelected) {
          if ( samePoint(selectedPoint.current, {x, y}) ) { return; }
          const newSegment = {start: selectedPoint.current, end: { x, y }}
          if (!segments.some(({start, end}) => sameSegment({start, end}, {start: selectedPoint.current, end: {x, y}}, true) )) { setSegments([...segments, newSegment]) }
        }
        setPoints(points.map(item => ({ ...item, selected: samePoint(item, {x, y}) })));
        selectedPoint.current = { x, y };
      }
      else {
        const newPoints =  points.map(item => ({ ...item, selected: false }));
        setPoints([...newPoints, { x, y, selected: true}]);
        if (pointSelected) { setSegments([...segments, { start: selectedPoint.current, end: { x , y }}]) }
        selectedPoint.current = { x , y };
      }
    }

    function handleRightClick({ x, y }) {
      setPreviewLine([]);

      if (event.target instanceof Konva.Arc) {
        if (selectedPoint.current !== null){ selectedPoint.current = null; return;}
        setSegments(segments.filter(({start, end}) => !(samePoint(start, {x, y}) || samePoint(end, {x, y}))));
        setPoints(points.filter(item => !(samePoint(item, {x, y}))));
      }
      else if (event.target instanceof Konva.Line) {      
        const { points } = event.target.attrs;
        const clicked = {start: {x: points[0], y: points[1]}, end: {x: points[2], y: points[3]} }
        setSegments( segments.filter(segment => !sameSegment(segment, clicked) ));

      } 
      else { 
        selectedPoint.current = null;
        setPoints(points.map(item => ({ ...item, selected: false }))); 
      }
    }

  }

  const handleMouseDown = (event) => {
    if (event.evt.button === 0 && ctrlkey.current || event.evt.button === 1) {
      event.currentTarget.startDrag();
    }
  }

  const handleMouseMove = (event) => {
    var {x, y} = event.currentTarget.getRelativePointerPosition()
    event.evt.preventDefault();
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


  const handlePaste = (event) => {
    if (event.evt.button !== 0) return; 
    const mousePos = event.target.getRelativePointerPosition();
  
    const processBlueprint = (blueprintUrl) => {
      fetch(blueprintUrl)
        .then(response => response.text())
        .then(text => {
          let data = JSON.parse(text);
          const centroid = data.points.reduce((acc, point) => {
            acc.x += point.x / data.points.length;
            acc.y += point.y / data.points.length;
            return acc;
          }, {x: 0, y: 0});
  
          const xOffset = mousePos.x - centroid.x;
          const yOffset = mousePos.y - centroid.y;
          const pointsMapping = new Map();

          const centeredPoints = data.points.map(point => {
            const newX = point.x + xOffset;
            const newY = point.y + yOffset;
            pointsMapping.set(`${point.x},${point.y}`, {x: newX, y: newY});
            return {...point, x: newX, y: newY};
          });

          const centeredSigns = data.signs.map(sign => {
            const newX = sign.center.x + xOffset;
            const newY = sign.center.y + yOffset;
            if (sign.type == Markings.Car || sign.type == Markings.Start) {
              const newTargetX = sign.target.x + xOffset;
              const newTargetY = sign.target.y + yOffset;
              return {...sign, center: {x: newX, y: newY}, target: {x: newTargetX, y: newTargetY}};
            }
            return {...sign, center: {x: newX, y: newY}};
          }); 

          const updatedSegments = data.segments.map(segment => ({
            ...segment,
            start: pointsMapping.get(`${segment.start.x},${segment.start.y}`) || segment.start,
            end: pointsMapping.get(`${segment.end.x},${segment.end.y}`) || segment.end
          }));  
  
          setPoints(p => [...p, ...centeredPoints]);
          setSegments(s => [...s, ...updatedSegments]);
          setSigns(s => [...s, ...centeredSigns]);
          setSelectedPoly(null);
        })
        .catch(error => {
          console.error('Error loading blueprint:', error);
        });
    };
  

    if (selectedBlueprint === Blueprints.Roundabout) {
      processBlueprint(roundabout);
    } else if (selectedBlueprint === Blueprints.Intersection) {
      processBlueprint(intersection);
    } else if (selectedBlueprint === Blueprints.Clover) {
      processBlueprint(cloverleaf);
    } else if (selectedBlueprint === Blueprints.Diamond) {
      processBlueprint(diamond);
    }
  };
  
  

  return (
    <RoadContext.Provider value={{
      points, setPoints, 
      segments, setSegments, 
      graph, setGraph,
      mode, setMode, 
      state, setState,
      polygons, setPolygons, 
      selectedPoly, setSelectedPoly, 
      signs, setSigns, 
      vehicles, setVehicles, 
      stageScale, setStageScale, 
      stagePosition, setStagePosition, 
      roadBorders, setRoadBorders,
      generatingBorders, setGeneratingBorders
    }}>
      <Stage
        ref={stage}
        onClick={mode == Modes.Graphs ? handleClick: mode == Modes.Blueprint ? handlePaste : null}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onWheel={handleMouseWheel}
        onContextMenu={(e) => e.evt.preventDefault()}
        width={window.innerWidth} 
        height={window.innerHeight}
        scale={stageScale}
        position={stagePosition}
        className='canvas'>

          <Layer>

              {/* <Rect 
                x={0}
                y={0}
                width={100}
                height={100}
                fill={"red"}
                shadowBlur={5}
                onClick={() => {
                  console.log("points", points); 
                  console.log("segments", segments); 
                  console.log("graph", graph); 
                  console.log("signs", signs); 
                  console.log("polygons", polygons);
                  console.log('vehicles', vehicles)
                }}
              /> */}

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

           { selectedPoly !== null && polygons[selectedPoly] &&
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
                target={sign.target}
                hitbox={sign.hitbox}
            />)}

            <Garage vehicles={vehicles} setVehicles={setVehicles} />

          </Layer>
      </Stage>

      <RightContols />
      <BottomControls />

    </RoadContext.Provider>
  );
};

export default RoadCanvas;