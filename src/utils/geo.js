import { geoPath } from 'd3';
import { point, booleanPointInPolygon } from '@turf/turf';

export const generateDotsForFeature = (feature, n = 0, offset = 0.3) => {
    if (!feature) return [];
    
    const bounds = geoPath().bounds(feature);

    if (bounds.flat().some((d) => !isFinite(d))) {
        console.log(bounds, `Error (infinite bounds).`);
        return [];
    }

    const xMin = bounds[0][0] + offset;
    const xMax = bounds[1][0] - offset;
    const yMin = bounds[0][1] + offset;
    const yMax = bounds[1][1] - offset;

    let hits = 0;
    let count = 0;

    const limit = n * 1000;

    const points = [];
    while (hits < n && count < limit) {
        const lat = yMin + Math.random() * (yMax - yMin);
        const lng = xMin + Math.random() * (xMax - xMin);

        const randomPoint = point([lng, lat]);

        if (booleanPointInPolygon(randomPoint, feature)) {
            const { geometry: { coordinates } } = randomPoint;
            points.push(coordinates);
            hits++;
        }

        count++;
    }

    if (hits !== n) {
        console.log(`Error (limit reached while calculating dot coordinates).`);
    }

    return points;
};

export const generateOutsideCoord = (width, height) => {
    const minOffset = 20;
    const offset = 200;

    const x = 2 * width * Math.random() - width / 2;
    const y = -1 * Math.random() * offset - minOffset;

    return [x, y];
};
