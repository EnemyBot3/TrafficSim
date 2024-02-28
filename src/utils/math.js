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