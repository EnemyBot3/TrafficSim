import Point from "./primitives/point";
import Segment from "./primitives/segment";
import Polgon from "./primitives/polygon";
import { samePoint } from '../utils/math';

function Graph({points, segments, update}) {

    const handlePointDrag = ({oldPosition, newPosition}) => {
        update( 
            points.map(item => {
                if (item.x === oldPosition.x && item.y === oldPosition.y) {
                    return { ...item, x: newPosition.x, y: newPosition.y };
                }
                return item;
            }),
            segments.map(({start, end}) => {
                if (samePoint(start, oldPosition)){ return {start: newPosition, end} }
                if (samePoint(end, oldPosition)){ return {end: newPosition, start} }
                return {start, end}
            })
        );
    }
  

    return ( 
        <>
        <Polgon
            segments={segments} />

        {
            segments.map((item, index) => 
                <Segment 
                  key={index} 
                  nodes={item} />
            )
        }
        { 
            points.map((item, index) => 
                <Point 
                  key={index} 
                  x={item.x} 
                  y={item.y} 
                  selected={item.selected}
                  onDrag={handlePointDrag}/>
            )
        }
        </>
    );
}

export default Graph;