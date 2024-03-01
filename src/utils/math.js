function getNearestPoint(positon, points, threshold = Number.MAX_SAFE_INTEGER) {
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

function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
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
 
export function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%)";
}