import React, { useState, useContext } from 'react';
import { RoadContext } from '../roadCanvas';
import HUDBottons from './primitives/HUDBottons';
import { Animate } from "react-simple-animate";
import { Modes, Markings, selectedMarking, setSelectedMarking } from '../utils/enums';
import TopControls from './topControls';
import { inverseLerp, degToRad } from '../utils/math';
// import OverpassFrontend from 'overpass-frontend';
// import query_overpass from 'query-overpass';
import axios from 'axios';

export default function LeftControls() {
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

  console.log('vehicles', signs)


  // const data = `
  // // @name home
  // [out:json];
  // (
  //    way['highway']
  //    ['highway'!~'pedestrian']
  //    ['highway'!~'footway']
  //    ['highway'!~'cycleway']
  //    ['highway'!~'path']
  //    ['highway'!~'service']
  //    ['highway'!~'corridor']
  //    ['highway'!~'track']
  //    ['highway'!~'steps']
  //    ['highway'!~'raceway']
  //    ['highway'!~'bridleway']
  //    ['highway'!~'proposed']
  //    ['highway'!~'construction']
  //    ['highway'!~'elevator']
  //    ['highway'!~'bus_guideway']
  //    ['access'!~'private']
  //    ['access'!~'no']
  //    (53.50284322735887,-2.1979415416717534,53.5046171994739,-2.1929419040679936);
  // );
  // out body;
  // >;
  // out skel;`;
  
  // axios.post('https://overpass-api.de/api/interpreter', 
  //     'data=' + encodeURIComponent(data), 
  //     { 
  //         headers: { 
  //             'Content-Type': 'application/x-www-form-urlencoded'
  //         }
  //     }
  // )
  // .then(response => {
  //     console.log(response.data);
  // })
  // .catch(error => {
  //     console.error('Error:', error);
  // });


// console.log(p())

  return (
    <>
      <Animate
        play={mode != Modes.Cars}
        start={leftControls}
        end={{ ...leftControls, left: "-500px" }}>

            <div className='hello'>

            </div>

          <HUDBottons title={'Stop'}     icon={'🛑'} selected={ selected == Markings.Stop }     />
          <HUDBottons title={'Crossing'} icon={'🚶'} selected={ selected == Markings.Crossing } />
          <HUDBottons title={'Traffic'}  icon={'🚥'} selected={ selected == Markings.Traffic }  />
          <HUDBottons title={'Start'}    icon={'🛣️'} selected={ selected == Markings.Start }    />
          <HUDBottons title={'End'}      icon={'⛳'} selected={ selected == Markings.End }      />
      </Animate>

      <TopControls 
        visible={displayTop} 
        onSave={()  => {}}
        onCancel={() => setDisplayTop(false)} 
        height={displayTop == "export" ? 1 : 10} />

    </>
  );
}

const leftControls = {
  position: "fixed",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  left: "10px",
  top: "100px",
}