import React, { useState, useContext } from 'react'
import HUDBottons from './primitives/HUDBottons';
import { RoadContext } from '../roadCanvas';
import { Modes } from '../utils/enums';

export default function BottomControls() {
    const {points, setPoints, segments, setSegments, mode, setMode} = useContext(RoadContext);

    const [selected, setSelected] = useState("Graph");

    const graphs = () => {
      setMode(Modes.Graphs);
      setSelected(Modes.Graphs)
    }
    
    const markings = () => {
      setMode(Modes.Markings);
      setSelected(Modes.Markings)
    }
    
    const cars = () => {
      setMode(Modes.Cars);
      setSelected(Modes.Cars)
    }
    
    const pause = () => {

    }

  return (
    <div className='bottomControls'>

      <HUDBottons onClick={graphs} icon={'🌐'} title={"Graph"} selected={selected == Modes.Graphs}/>
      <HUDBottons onClick={markings} icon={'🪧'} title={"Markings"} selected={selected == Modes.Markings}/>
      <HUDBottons onClick={cars} icon={'🚗'} title={"Cars"} selected={selected == Modes.Cars}/>
      <HUDBottons onClick={pause} icon={'⏯️'} title={"wseeraph"}/>
      <HUDBottons onClick={pause} icon={'🗑️'} title={"Graph"}/>
    </div>
  )
}