import React, { useState, useContext } from 'react'
import HUDBottons from './primitives/HUDBottons';
import { RoadContext } from '../roadCanvas';
import { Modes, States } from '../utils/enums';

export default function BottomControls() {
    const {setMode, setState, state, setGeneratingBorders, generatingBorders, segments} = useContext(RoadContext);

    const [selected, setSelected] = useState("Graph");

    const graphs = () => {
      setMode(Modes.Graphs);
      setSelected(Modes.Graphs)
    }
    
    const markings = () => {
      setMode(Modes.Markings);
      setSelected(Modes.Markings);
    }

    const blueprints = () => {
      setMode(Modes.Blueprint);
      setSelected(Modes.Blueprint);
    }
    
    const cars = () => {
      setMode(Modes.Cars);
      setSelected(Modes.Cars)
    }
    
    const play = () => {
      shouldLoad();
      setTimeout(() => { setState(old => old == States.Play? States.Pause : States.Play); }, 50)
      setSelected(old => old == Modes.Play? Modes.Pause : Modes.Play);
    }

    const shouldLoad = () => {
      if (state == States.Pause && segments.length > 150) {
        setGeneratingBorders(true)
      }
    }

  return (
    <div className='bottomControls'>

      <HUDBottons onClick={graphs}     icon={'🌐'}                                 title={"Graph"}        selected={selected == Modes.Graphs}/>
      <HUDBottons onClick={markings}   icon={'🚗'}                                 title={"Markings"}     selected={selected == Modes.Markings}/>
      <HUDBottons onClick={blueprints} icon={'🛠️'}                                 title={"Blueprints"}   selected={selected == Modes.Blueprint}/>
      <HUDBottons onClick={play}       icon={state == States.Play ? '⏸️' : '▶️'}  title={state == States.Play ? "Pause": 'Play'} selected={selected == Modes.Play} load={generatingBorders}/>
    </div>    
  )
}