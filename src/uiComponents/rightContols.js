import React, { useState, useContext } from 'react';
import { RoadContext } from '../roadCanvas';
import HUDBottons from './primitives/HUDBottons';
import { Animate } from "react-simple-animate";
import { Modes, Markings, selectedMarking, setSelectedMarking } from '../utils/enums';

export default function RightContols() {
  const {points, setPoints, segments, setSegments, signs, setSigns, setSelectedPoly, mode} = useContext(RoadContext);
  const [selected, setSelected] = useState(null);

  const clear = () => {
    setPoints([]);
    setSegments([]);
    setSigns([]);
    setSelectedPoly(null);
  }

  const save = () => {{{
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("segments", JSON.stringify(segments));
    localStorage.setItem("signs", JSON.stringify(signs));
  }}}

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