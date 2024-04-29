import { Line, Arc, Shape } from 'react-konva';
import { gradient, translate, getIntersection, getRandomColor, average, samePoint, sameArray, squareDistance } from "../../utils/math";
import { memo, useRef } from 'react';
import { RoadContext } from "../../roadCanvas";
import { Modes, States, roadWidth } from "../../utils/enums";
import { useContext, useMemo, useState } from 'react';

const Polygon = memo(function Polygon({ segments }) {
    const { mode, state, selectedPoly, setPolygons, setSelectedPoly, setRoadBorders, setGeneratingBorders } = useContext(RoadContext);

    var kept = [];
    const radius = roadWidth / 2;
    const roundness = 10;
    const color = "grey";
    const displayBorder = segments.length < 150 || (state == States.Play);

    // generates the road shape around each segment
    const polygons = useMemo(() => segments.map(segment => {
        // console.log('polygons')

        const { start, end } = segment;
        const vertices = []

        const startJunction = segments.filter(pos => samePoint(start, pos.start) || samePoint(start, pos.end)).length;
        const endJunction = segments.filter(pos => samePoint(end, pos.start) || samePoint(end, pos.end)).length;
        
        const alpha = gradient(start, end);
        const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2;     

        if (startJunction == 1) {
            const padding = translate(start, alpha, radius);
            vertices.push(translate(padding, alpha_ccw, radius)) 
            vertices.push(translate(padding, alpha_cw, radius)) 

        } else {
            const steps = Math.PI / roundness;
            for (let i = alpha_ccw; i <= alpha_cw + (steps / 2); i += steps){ vertices.push(translate(start, i, radius)) }
        }

        if (endJunction == 1) {
            const padding = translate(end, alpha, -radius);
            vertices.push(translate(padding, Math.PI+ alpha_ccw, radius)) 
            vertices.push(translate(padding, Math.PI+ alpha_cw, radius)) 

        } else {
            const steps = Math.PI / roundness;
            for (let i = alpha_ccw; i <= alpha_cw + (steps / 2); i += steps){ vertices.push(translate(end, Math.PI + i, radius)) }

        }

        return vertices.map((vertex, i) => ({
            p1: vertex,
            p2: vertices[(i + 1) % vertices.length]
        }));
    }), [segments]);
    
    useMemo(() => {
        // console.log(segments.length, mode)

        if (displayBorder) {
            for (let i = 0; i < polygons.length - 1; i++){
                for (let j = i + 1; j < polygons.length; j++){
                    updatePolygons(polygons[i], polygons[j])
                }
            }
        }
    }, [segments, state]);

    kept = useMemo( () => displayBorder ? joinPolygons() : [], [segments, displayBorder])

    useMemo(() => {
        setPolygons(polygons);
        setRoadBorders(kept);
    }, [segments, state])

    function updatePolygons(poly1, poly2) {
        // console.log('updatePolygons')

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
        // console.log('joinPolygons')

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
                if (keep) { toReturn.push({...segment, polyIndex: i}) }
            }
        }
        setGeneratingBorders(false);
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
    
    if (segments.length == 0) {return}

    return ( 
      <>
        {
            // fill
            polygons.map((pol, index) => 
                <Shape 
                    key={index}
                    fill={color}
                    listening={(mode == Modes.Markings || mode == Modes.Cars) && selectedPoly != index}
                    onMouseEnter={() => {setSelectedPoly(index)}}
                    onMouseLeave={() => setSelectedPoly(null)}
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
                const { start, end, oneWay } = segment;
                return <Line
                    strokeWidth={4}
                    stroke={"white"}
                    key={index}
                    points={[start.x, start.y, end.x, end.y]}
                    dash={oneWay? [20, 20] : [10, 10]}
                    listening={false}/>})
        }

        {
            //borders
            displayBorder &&
            kept.map((l, index) => {
                return <Line
                    key={index} 
                    strokeWidth={5}
                    stroke={"white"}
                    lineCap={'round'}
                    listening={false}
                    points={[l.p1.x, l.p1.y, l.p2.x, l.p2.y]} />
            })
        }
      </>
    );
});

export default Polygon;