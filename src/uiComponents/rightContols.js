import React, { useState, useContext } from 'react';
import { RoadContext } from '../roadCanvas';
import HUDBottons from './primitives/HUDBottons';
import { Animate } from "react-simple-animate";
import { Modes, Markings, selectedMarking, setSelectedMarking } from '../utils/enums';

export default function RightContols() {
  const {points, setPoints, segments, setSegments, signs, setSigns, setSelectedPoly, mode, stageScale, setStageScale, stagePosition, setStagePosition} = useContext(RoadContext);
  const [selected, setSelected] = useState(null);

  const clear = () => {
    setPoints([]);
    setSegments([]);
    setSigns([]);
    setSelectedPoly(null);

    setStageScale({x: 1, y: 1});
    setStagePosition({x: 0, y: 0});
  }

  const save = () => {
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("segments", JSON.stringify(segments));
    localStorage.setItem("signs", JSON.stringify(signs));
    localStorage.setItem("stage", JSON.stringify({stageScale, stagePosition}));
  }

  const export_ = () => {
    const element = document.createElement("a");
    const world = {points, segments, signs, stage: {stageScale, stagePosition}}
    element.setAttribute(
      "href", "data:application/json; charset=utf-8," +
      encodeURIComponent(JSON.stringify(world))
    );
    element.setAttribute("download", "name.world");
    element.click();
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

        console.log(jsonData)

        setPoints(jsonData.points);
        setSegments(jsonData.segments);
        setSigns(jsonData.signs);
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

  return (
    <>
      <Animate
        play={mode == Modes.Markings}
        start={rightControls}
        end={{ ...rightControls, right: "-100px" }}>

          <HUDBottons onClick={clear} icon={'🗑️'} title={'Clear'}/>
          <HUDBottons onClick={save} icon={'💾'} title={'Save'}/>
          <HUDBottons onClick={export_} icon={'⬇️'} title={'Export'}/>
          <HUDBottons onClick={import_} icon={'🗂️'} title={'Import'} type={"file"}/>

      </Animate>

      <Animate
        play={mode == Modes.Graphs}
        start={rightControls}
        end={{ ...rightControls, right: "-100px" }}>

          <HUDBottons onClick={() => setMarking(Markings.Stop)}     title={'Stop'}     icon={'🛑'} selected={ selected == Markings.Stop } />
          <HUDBottons onClick={() => setMarking(Markings.Crossing)} title={'Crossing'} icon={'🚶'} selected={ selected == Markings.Crossing } />
          <HUDBottons onClick={() => setMarking(Markings.Traffic)}  title={'Traffic'}  icon={'🚥'} selected={ selected == Markings.Traffic } />
          <HUDBottons onClick={() => setMarking(Markings.Car)}      title={'Car'}      icon={'🚗'} selected={ selected == Markings.Car } />
          <HUDBottons onClick={() => setMarking(Markings.Start)}    title={'Start'}    icon={'🛣️'} selected={ selected == Markings.Start } />
          <HUDBottons onClick={() => setMarking(Markings.End)}      title={'End'}      icon={'⛳'} selected={ selected == Markings.End } />
      </Animate>
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