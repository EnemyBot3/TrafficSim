import React, { useState, useContext } from 'react';
import { RoadContext } from '../roadCanvas';
import HUDBottons from './primitives/HUDBottons';
import { Animate } from "react-simple-animate";
import { Modes, Markings, selectedMarking, setSelectedMarking } from '../utils/enums';
import TopControls from './topControls';
import { inverseLerp, degToRad } from '../utils/math';

export default function RightContols() {
  const {
    points, setPoints, 
    segments, setSegments, 
    signs, setSigns, 
    vehicles, setVehicles,
    setSelectedPoly, mode, 
    stageScale, setStageScale, 
    stagePosition, setStagePosition
  } = useContext(RoadContext);
  const [selected, setSelected] = useState(null);
  const [displayTop, setDisplayTop] = useState(false); 

  const clear = () => {
    setPoints([]);
    setSegments([]);
    setSigns([]);
    setVehicles([]);
    setSelectedPoly(null);

    setStageScale({x: 1, y: 1});
    setStagePosition({x: 0, y: 0});
  }

  const save = () => {
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("segments", JSON.stringify(segments));
    localStorage.setItem("signs", JSON.stringify(signs));
    // localStorage.setItem("vehicles", JSON.stringify(vehicles.filter(car => !car.deleted)));
    localStorage.setItem("stage", JSON.stringify({stageScale, stagePosition}));
  }

  const export_ = (name) => {
    const element = document.createElement("a");
    const world = {points, segments, signs, vehicles: vehicles.filter(car => !car.deleted), stage: {stageScale, stagePosition}}
    name = name ? name : "untitled"

    element.setAttribute(
      "href", "data:application/json; charset=utf-8," +
      encodeURIComponent(JSON.stringify(world))
    );

    element.setAttribute("download", name + ".world");
    element.click();
    setDisplayTop(false)
  }
  
  const import_ = () => {
    const element = document.createElement("input");
    element.setAttribute("type", "file");
    element.setAttribute("accept", ".world");
    element.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) { alert("No file selected."); return; }

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = (evt) => {
        const fileContent = evt.target.result;
        const jsonData = JSON.parse(fileContent);

        setPoints(jsonData.points);
        setSegments(jsonData.segments);
        setSigns(jsonData.signs);
        // setVehicles(jsonData.vehicles);
        setSelectedPoly(null);

        setStageScale(jsonData.stage.stageScale);
        setStagePosition(jsonData.stage.stagePosition);
      }
    }
    element.click();
  }

  const setMarking = (mark) => {
    if (selectedMarking === mark) {
      setSelectedMarking(null);
      setSelected(null);
    } else {
      setSelected(mark);
      setSelectedMarking(mark);
    }
  }

  const load = (map) => {
    if (map == "") return;

    const data = JSON.parse(map);
    const nodes = data.elements.filter((n) => n.type == "node");
    const ways = data.elements.filter((n) =>  n.type == "way");
    
    const newPoints = [];
    const newSegments = [];

    const latitudes = nodes.map(n => n.lat)
    const longitudes = nodes.map(n => n.lon)

    const minLat = Math.min(...latitudes)
    const maxLat = Math.max(...latitudes)
    const minLon = Math.min(...longitudes)
    const maxLon = Math.max(...longitudes)

    const deltaLat = maxLat - minLat;
    const deltaLon = maxLon - minLon;
    const aspectRatio = deltaLon / deltaLat;
    const height = deltaLat * 111000 * 10;
    const width = height * aspectRatio * Math.cos(degToRad(maxLat));

    const centerX = width / 2;
    const centerY = height / 2;

    for (const node of nodes) {
      const y = (inverseLerp(maxLat, minLat, node.lat) * height) - centerY;
      const x = (inverseLerp(minLon, maxLon, node.lon) * width) - centerX;
      newPoints.push({x, y, id: node.id})
    }

    for (const way of ways) {
      const ids = way.nodes;
      for (let i = 1; i < ids.length; i++) {
        const prev = newPoints.find((p) => p.id == ids[i - 1])
        const cur = newPoints.find((p) => p.id == ids[i])
        const oneWay = way.tags.oneway || way.tags.lanes == 1 || way.tags.junction == "roundabout"
        newSegments.push({start: prev, end: cur, oneWay})
      }
    }
    // console.log('ways', ways)
    // console.log('nodes', nodes)
    // console.log('newPoints', newPoints)
    // console.log('newSegments', newSegments)

    setPoints(newPoints)
    setSegments(newSegments)
    setSigns([])
    setVehicles([])
    setDisplayTop(false)
  }

  return (
    <>
      <Animate
        play={mode != Modes.Graphs}
        start={rightControls}
        end={{ ...rightControls, right: "-100px" }}>

          <HUDBottons onClick={clear} icon={'🗑️'} title={'Clear'}/>
          <HUDBottons onClick={save} icon={'💾'} title={'Save'}/>
          <HUDBottons onClick={() => setDisplayTop("export")} icon={'⬇️'} title={'Export'}/>
          <HUDBottons onClick={import_} icon={'🗂️'} title={'Import'} type={"file"}/>
          <HUDBottons onClick={() => setDisplayTop("map")} icon={'🗺️'} title={'Map'} />

      </Animate>

      <Animate
        play={mode != Modes.Markings}
        start={rightControls}
        end={{ ...rightControls, right: "-100px" }}>

          <HUDBottons onClick={() => setMarking(Markings.Stop)}     title={'Stop'}     icon={'🛑'} selected={ selected == Markings.Stop } />
          <HUDBottons onClick={() => setMarking(Markings.Crossing)} title={'Crossing'} icon={'🚶'} selected={ selected == Markings.Crossing } />
          <HUDBottons onClick={() => setMarking(Markings.Traffic)}  title={'Traffic'}  icon={'🚥'} selected={ selected == Markings.Traffic } />
          <HUDBottons onClick={() => setMarking(Markings.Start)}    title={'Start'}    icon={'🛣️'} selected={ selected == Markings.Start } />
          <HUDBottons onClick={() => setMarking(Markings.End)}      title={'End'}      icon={'⛳'} selected={ selected == Markings.End } />
      </Animate>

      <Animate
        play={mode != Modes.Cars}
        start={rightControls}
        end={{ ...rightControls, right: "-100px" }}>

          <HUDBottons onClick={() => setMarking(Markings.Car)}      title={'Car'}     icon={'🚗'} selected={ selected == Markings.Car } />
          <HUDBottons title={'Bus'}     icon={'🚌'} />
          <HUDBottons title={'Bicycle'} icon={'🚲'} />
          <HUDBottons title={'Lorry'}   icon={'🚚'} />
          <HUDBottons title={'Bike'}    icon={'🏍️'} />
          <HUDBottons title={'Police'}  icon={'🚔'} />
      </Animate>

      <TopControls 
        visible={displayTop} 
        onSave={(data) => displayTop == "export" ? export_(data) : load(data)}
        onCancel={() => setDisplayTop(false)} 
        height={displayTop == "export" ? 1 : 10} />

    </>
  );
}

const rightControls = {
  position: "fixed",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  right: "10px",
  top: "100px"
}