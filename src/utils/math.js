import { roadWidth } from "./enums";

export function getNearestPoint(positon, points, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    
    points.forEach(point => {
        const dist = distance(point, positon);
        if (dist < minDist && dist < threshold) {
          minDist = dist;
          nearest = point;
        }
    });

    return nearest;
}

export function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function squareDistance(p1, p2) {
    return p1.x - p2.x, p1.y + p2.y;
}

export function average(p1, p2) {
    return {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

/**
 * Returns true if the two points are the same.
 *
 * Example: given p1 = {x: 100, y: 250} and p2 = {x: 100, y: 250} return true
 *
 * @param {p1} the first point
 * @param {p2} the second point
 * @returns true or false
 * @type Boolean
 */
export function samePoint(p1, p2){
    return (p1.x === p2.x && p1.y === p2.y);
}

export function sameSegment(s1, s2, reversable = false){
    const check1 = samePoint(s1.start, s2.start) && samePoint(s1.end, s2.end);
    const check2 = reversable ? samePoint(s1.start, s2.end) && samePoint(s1.end, s2.start) : false;

    return check1 || check2;
}

export function getSegmentsWithPoint(point, segments){
    const segs = [];
    for (const seg of segments) {
        if (samePoint(seg.start, point) || samePoint(seg.end, point)) {
            segs.push(seg)
        }
    }
    return segs;
}

export function pointStr(position) {
    return position.x + "," + position.y;
}

export function strPoint(string) {
    const [x, y] = string.split(',')
    return {x: parseInt(x), y: parseInt(y)};
}

/**
 * Returns true if the two arrays are the same.
 * If Reversable is set to true the arrays wiil be sorted before comparison 
 * Example: given arr1 = [100, 200, 400] and arr1 = [100, 200, 400] return true
 *
 * @param {arr1} the first array
 * @param {arr2} the second array
 * @param {reversable} if true sorts the arrays before comparing
 * @returns true or false
 * @type Boolean
 */
export function sameArray(arr1, arr2, reversable = false){
    if (!arr1 || !arr2) return false
    if (arr1.length !== arr2.length) return false
    if (arr1 === arr2) return true;

    if (reversable){
        arr1 = arr1.sort();
        arr2 = arr2.sort();
    }

    return JSON.stringify(arr1) === JSON.stringify(arr2);
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * clamp(0, 10 * x, 255)
 *
 * @param {min} The lower boundary of the output range
 * @param {value} The number to clamp
 * @param {max} The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
export function clamp(min, value, max) {
    return Math.min(Math.max(value, min), max);
};

/**
 * Returns the point translated by the given offset towards the given angle.
 *
 * Example: point {x: 1, y: 1} translated 90 deg with ofset 10
 * retturns point {x: 10, y: 1}
 *
 * @param {position} the starting point
 * @param {angle} diirection to translate tto
 * @param {offset} amount to translate by
 * @returns the new position
 * @type object
 */
export function translate(position, angle, offset){
    return {
        x: position.x + Math.cos(angle) * offset,
        y: position.y + Math.sin(angle) * offset
    }
}

/**
 * Returns the gradiient giiven two points 
 *
 * Example: given p1 = {x: 0, y: 0} and p2 = {x: 10, y: 10} return 10
 *
 * @param {p1} the first point
 * @param {p2} the second point
 * @returns the gradient
 * @type int
 */
export function gradient(p1, p2){
    return Math.atan2(p1.y - p2.y, p1.x - p2.x)
}

export function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
 
    if (bottom != 0) {
       const t = tTop / bottom;
       const u = uTop / bottom;
       if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
          return {
             x: lerp(A.x, B.x, t),
             y: lerp(A.y, B.y, t),
             offset: t,
          };
       }
    }
    return null;
}
 
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function inverseLerp(a, b, v) {
    return (v - a) / (b - a);
}
 
export function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%)";
}

export function getRandomRGB() {
    const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(100, 255);
    const g = randomBetween(100, 255);
    const b = randomBetween(100, 255);
    return {r, g, b}
}

export function projectPoint(point, segment) {
    const a = subtract(point, segment.start);
    const b = subtract(segment.end, segment.start);

    const normB = normalize(b);
    const offset = dot(a, normB) / magnitude(b);
    const projection = add(segment.start, scale(normB, dot(a, normB))); 

    return {projection, offset}
}

export function subtract(p1, p2) {
    return {x: p1.x - p2.x, y: p1.y - p2.y}
}

export function normalize(p) {
    return scale(p, 1 / magnitude(p));
}
 
export function scale(p, scaler) {
    return {x: p.x * scaler, y: p.y * scaler}
}

function magnitude(p) {
    return Math.hypot(p.x, p.y);
}

export function add(p1, p2) {
    return {x: p1.x + p2.x, y: p1.y + p2.y}
}

export function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

export function segmentDirectionVector(segment) {
    return normalize(subtract(segment.start, segment.end));
}

export function angle(p) {
    return Math.atan2(p.y, p.x);
}

export function round(p, amount) {
    return { x: Math.round(p.x, amount), y: Math.round(p.y, amount)}
}

export function radsToDegs(radians)
{
  return radians * (180/Math.PI);
}

export function degToRad(degrees)
{
  return degrees * Math.PI / 180;
}

export function perpendicular(p) {
    return { x: -p.y, y: p.x };
}

export function crossProduct(p, segment) {
    const A = subtract(p, segment.start);
    const B = subtract(p, segment.end);
    const cross = A.x * B.y - A.y * B.x;
    return cross;
}

export function generatePoly(path) {

    const radius = roadWidth / 2;
    const roundness = 10;
    const segments = [];

    for (let i = 1; i < path.length; i++) {
        segments.push({start: path[i - 1], end: path[i]})
    }


    const polygons = segments.map(segment => {

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
    })

    for (let i = 0; i < polygons.length - 1; i++){
        for (let j = i + 1; j < polygons.length; j++){
            updatePolygons(polygons[i], polygons[j])
        }
    }
    
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
                if (keep) { toReturn.push({...segment, polyIndex: i}) }
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
  
    return joinPolygons();
}