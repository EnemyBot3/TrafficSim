import React from 'react'
import RoadCanvas from './roadCanvas';
import FPSStats from "react-fps-stats";

function App() {
  return (
    <>
      <h1>The TrafficSim</h1>
      <RoadCanvas />
      <FPSStats />
    </>
  );
}

export default App;
