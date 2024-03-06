import { Line, Arc, Shape } from 'react-konva';
import { gradient, translate, getIntersection, getRandomColor, average } from "../../utils/math";
import { memo } from 'react';


const Polygon = memo(function Polygon({ segments }) {
    var kept = [];
    const roadWidth = 80;
    const radius = roadWidth / 2;
    const roundness = 3;
    const color = "grey"


    // generates the road shape around each segment
    const polygons = segments.map(segment => {
        console.log(segments.length);

        const [ start, end ] = segment;
        const vertices = []

        const alpha = gradient(start, end);
        const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2;
        const step = Math.PI / roundness

        for (let i = alpha_ccw; i <= alpha_cw + (step / 2); i += step){ vertices.push(translate(start, i, radius)) }
        for (let i = alpha_ccw; i <= alpha_cw + (step / 2); i += step){ vertices.push(translate(end, Math.PI + i, radius)) }

        return vertices.map((vertex, i) => ({
            p1: vertex,
            p2: vertices[(i + 1) % vertices.length]
        }));
    })

    for (let i = 0; i < polygons.length - 1; i++){
        for (let j = i + 1; j < polygons.length; j++){
            updatePolygons(polygons[i], polygons[j])
        }
    }
    kept = joinPolygons()

    function updatePolygons(poly1, poly2) {

        for (let i = 0; i < poly1.length; i++){
            for (let j = 0; j < poly2.length; j++){
                const inters = getIntersection(
                    poly1[i].p1, 
                    poly1[i].p2, 
                    poly2[j].p1, 
                    poly2[j].p2
                )
            
                if (inters && inters.offset != 1 && inters.offset != 0){
                    const point = {x: inters.x, y: inters.y};

                    let aux = poly1[i].p2;
                    poly1[i].p2 = point
                    poly1.splice(i + 1, 0, {p1: point, p2: aux})

                    aux = poly2[j].p2;
                    poly2[j].p2 = point
                    poly2.splice(j + 1, 0, {p1: point, p2: aux})
                }
            }
        }
    }

    function joinPolygons(){
        const toReturn = []; 
        for (let i = 0; i < polygons.length; i++) {
            for (const segment of polygons[i]) {
                let keep = true;

                for(let j = 0; j < polygons.length; j++) {
                    if (i != j) {
                        if ( intersect(polygons[j], segment) ) {
                            keep = false;
                            break;
                        }
                   } 
                }
                if (keep) { toReturn.push(segment) }
            }
        }
        return toReturn;
    }

    function intersect(poly, seg) {
        const outerPoint = {x: -2000, y: -2000}
        const midpoint = average(seg.p1, seg.p2);
        let intersectionCount = 0;

        for (const lines of poly) {
            const int = getIntersection(outerPoint, midpoint, lines.p1, lines.p2);
            if (int){ intersectionCount++; }
        }
        return intersectionCount % 2 == 1;
    }

    return ( 
      <>
        {
            // fill
            polygons.map((pol, index) => 
                <Shape 
                    key={index}
                    fill={color}
                    listening={false}
                    stroke={color}
                    strokeWidth={20}
                    sceneFunc={(ctx, shape) => {
                    ctx.beginPath();
                    ctx.moveTo(pol[0].p1.x, pol[0].p1.y);
                    for (let i = 1; i < pol.length; i++) {
                        ctx.lineTo(pol[i].p1.x, pol[i].p1.y);
                    }
                    ctx.closePath();
                    ctx.fillStrokeShape(shape);
                }}/>
            )          
        }

        {
            // mid point line
            segments.map((segment, index) => {
                const [ start, end ] = segment;
                return <Line
                  strokeWidth={4}
                  stroke={"white"}
                  key={index}
                  points={[start.x, start.y, end.x, end.y]}
                  dash={[10, 10]}
                  listening={false}/>})
        }

        {
            // borders
            kept.map((l, index) => {
                return (
                    <Line
                      key={index} 
                      strokeWidth={5}
                      stroke={"white"}
                      lineCap={'round'}
                      listening={false}
                      points={[l.p1.x, l.p1.y, l.p2.x, l.p2.y]} />)
            })
        }
      </>
    );
});

export default Polygon;