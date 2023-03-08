import { scaleLinear, extent, groups, max } from 'd3';

import { generateDotsForFeature, generateOutsideCoord } from './geo';

// random layout
export const random = ({width, height, data, pointWidth}) => {
    const widthScale = scaleLinear().domain([0, 1]).range([pointWidth, width - pointWidth]);
    const heightScale = scaleLinear().domain([0, 1]).range([pointWidth, height - pointWidth]);

    const coords = data.map(_ => {
        return [widthScale(Math.random()), heightScale(Math.random())];
    });

    return { coords, pointWidth };
};

// rectangle layout
export const rectangle = ({width, height, data, pointWidth, order_variable, order_value}) => {
    let innerDist = 2;
    let outerDist = 5;
    const kPerRow = 4;
    const kPerCol = 6;
    const padding = 16;

    let numCols = Infinity;
    let numRows = Infinity;
    let i = 0;
    let pW = pointWidth;
    const minPw = 2;
    const minOuterDist = minPw;
    do {
        pW = Math.max(minPw, pointWidth - i);
        if (pW === minPw) outerDist = Math.max(minOuterDist, outerDist - 0.5);
        if (outerDist === minOuterDist) innerDist -= 0.5;
        numCols = Math.floor((kPerRow * (width - 2 * padding) / (kPerRow * pW + (kPerRow - 1) * innerDist + outerDist)) / kPerRow) * kPerRow;
        numRows = Math.floor((kPerCol * (height - 2 * padding) / (kPerCol * pW + (kPerCol - 1) * innerDist + outerDist)) / kPerCol) * kPerCol;
        i += 0.5;
    } while ((numCols * numRows < data.length));

    const numRectsInRow = numCols / kPerRow;
    const adjustedPadding = Math.floor((width - ((kPerRow * pW + (kPerRow - 1) * innerDist + outerDist) * numRectsInRow - outerDist)) / 2);

    const coords = [];
    let x = adjustedPadding;
    let y = adjustedPadding;
    for (let row = 1; row <= numRows; row++) {
        for (let col = 1; col <= numCols; col++) {
            coords.push([x, y]);
            x += pW + (col % kPerRow === 0 ? outerDist : innerDist);
        }
        y += pW + (row % kPerCol === 0 ? outerDist : innerDist);
        x = adjustedPadding;
    }

    let orderedCoords = coords.slice(0, data.length);
    if (order_variable) {
        const orderedData = order_value.map(v => {
            return data.filter(d => v.includes(d[order_variable]));
        })
        .flat();
        
        const assignedIds = orderedData.map(d => d.id);
        const unassigned = data.filter(d => !assignedIds.includes(d.id));

        orderedCoords = [...orderedData, ...unassigned]
            .map((d, i) => ({...d, coord: coords[i]}))
            .sort((a, b) => a.id > b.id ? 1 : -1)
            .map(d => d.coord);
    }

    return {
        coords: orderedCoords,
        pointWidth: pW
    };
};

// map layout
export const map = ({features, projection, data, width, height, padding, feature_offset, pointWidth}) => {
    if (!projection) return {};
    const coords = features.map(f => {
        const featureData = data.filter(dd => dd.region_iso === f.properties.iso);
        const positions = generateDotsForFeature(f, featureData.length, feature_offset ? pointWidth / 15 : 0).map(dd => projection(dd));
        return featureData.map((dd, i) => {
            return {
                ...dd,
                coord: positions[i]
            };
        });
    }).flat();
    
    const usedIds = coords.map(dd => dd.id);
    const unassigned = data.filter(d => !usedIds.includes(d.id)).map(d => ({...d, out: true, coord: generateOutsideCoord(width, height)}));

    const completeCoords = [...coords, ...unassigned]
        .sort((a, b) => a.id > b.id ? 1 : -1)
        .map(d => d.coord)
        .map(d => [d[0] + padding, d[1]]);

    return { coords: completeCoords, pointWidth };
};

// age histogram layout
export const age_histogram = ({data, width, height, padding, pointWidth, order_variable, order_value, center_histogram = false}) => {
    let spacing = pointWidth / 2;

    const ageRange = extent(data, d => d.age);
    const ageScale = scaleLinear()
        .domain(ageRange)
        .range([height - padding, padding]);

    const ageGroups = groups(data, d => d.age).sort((a, b) => a[0] < b[0] ? -1 : 1);
    const maxI = max(ageGroups.filter(d => d[0]), d => d[1].length);

    const minPW = 3;
    const minSpacing = -minPW;
    let i = 0;
    let pW = Math.max(pointWidth, minPW);
    let numStacks = -Infinity;
    let spaceNeeded = Infinity;
    do {
        numStacks = Math.ceil(maxI * (pW + spacing) / (width - 2 * padding));
        spaceNeeded = numStacks * (ageRange[1] - ageRange[0] + 1) * (pW + spacing) - spacing;
        i += 0.5;
        pW = Math.max(minPW, pointWidth - i);
        if (pW === minPW) spacing = Math.max(minSpacing, spacing - 0.5);
    } while ((spaceNeeded > (height - 2 * padding)) && spacing > minSpacing);

    const coords = ageGroups.map(([age, d]) => {
        if (!age) return d.map(dd => ({ ...dd, out: true, coord: generateOutsideCoord(width, height)}));
        const numDots = d.length;
        const numDotsPerStack = Math.ceil(numDots / numStacks);
        let orderedD = d;
        if (order_variable) {
            const orderedData = order_value.map(v => {
                return d.filter(dd => v.includes(dd[order_variable]));
            })
            .flat();
            
            const assignedIds = orderedData.map(dd => dd.id);
            const unassigned = d.filter(dd => !assignedIds.includes(dd.id));
    
            orderedD = [...orderedData, ...unassigned];
        }
        let iRow = -1;
        return orderedD.map((dd, i, arr) => {
            const iCol = i % numStacks;
            if (iCol === 0) iRow++;
            const xOffset = center_histogram ? (width / 2 - padding) : (numDotsPerStack * (pW + spacing) / 2);
            const x = (i - iCol - (numStacks - 1) * iRow) * (pW + spacing) + pW / 2 + width / 2 - xOffset + pW / 2 * (Math.random() * 2 - 1);
            const y = (ageScale(age) + (iCol + 1) * (pW + spacing) - padding) + pW / 2 * (Math.random() * 1.5 - 0.75);
            return {
                ...dd,
                coord: [x, y]
            };
        });
    })
    .flat()
    .sort((a, b) => a.id > b.id ? 1 : -1);

    return { coords: coords.map(d => d.coord), pointWidth: pW, yScale: ageScale };
};