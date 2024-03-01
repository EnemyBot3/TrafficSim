import React, { useContext } from 'react';
import { RoadContext } from '../roadCanvas';

export default function RightContols() {
  const {points, setPoints, segments, setSegments} = useContext(RoadContext);

  const clear = () => {
    setPoints([]);
    setSegments([]);
  }

  const save = () => {{{
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("segments", JSON.stringify(segments));
  }}}

  return (
    <div className='rightControls'>
      <button onClick={clear}>🗑️</button>
      <button onClick={save}>💾</button>
    </div>
  );
}
