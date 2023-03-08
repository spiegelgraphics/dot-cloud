import { derived } from 'svelte/store';
import { json, geoAzimuthalEqualArea, geoEquirectangular, geoPath } from 'd3';
import { rewind, polygon, area } from '@turf/turf';

import { params } from './params';
import { width, contentHeight, padding } from './dimensions';

export const map1Geojson = derived(params, async ($params, set) => {
    const geojson = await json($params.map1);
    const { features } = geojson;
    const reFeatures = features
        .filter(f => f.geometry)
        .filter(f => !/^UA/.test(f.properties.iso))
        .map(f => rewind(f, {reverse: true}));
    set({...geojson, features: reFeatures});
});

export const map2Geojson = derived(params, async ($params, set) => {
    const geojson = await json($params.map2);
    const { features } = geojson;
    const reFeatures = features
        .filter(f => !/^UA/.test(f.properties.iso))
        .map(f => rewind(f, {reverse: true}));
    set({...geojson, features: reFeatures});
});

export const map1Features = derived(map1Geojson, $geojson => {
    const { features = [] } = $geojson || {};
    return features;
});

export const map2Features = derived(map2Geojson, $geojson => {
    const { features = [] } = $geojson || {};
    return features;
});

export const map1Projection = derived([map1Geojson, width, contentHeight, padding], ([$geojson, $width, $height, $padding]) => {
    if (!$width || !$height) return null;
    const projection = geoAzimuthalEqualArea()
        .rotate([-90, 0])
        .fitSize([$width - 2 * $padding, $height - 2 * $padding], $geojson);
    return projection;
});

export const map2Projection = derived([map2Geojson, width, contentHeight, padding], ([$geojson, $width, $height, $padding]) => {
    if (!$width || !$height) return null;
    const projection = geoEquirectangular().fitSize([$width - 2 * $padding, $height - 2 * $padding], $geojson);
    return projection;
});

export const map1 = derived([map1Features, map1Projection], ([$features, $projection]) => {
    if (!$projection) return [];
    const pathGen = geoPath().projection($projection);
    const paths = $features.map(f => {
        const { geometry } = f;
        const { iso, color } = f.properties;

        // sort multipolygon items by area
        if (geometry.type === 'MultiPolygon') {
            const polygons = geometry.coordinates.map(p => {
                return {
                    data: p,
                    area: area(polygon(p))
                };
            }).sort((a, b) => a.area < b.area ? 1 : -1);
            geometry.coordinates = polygons.map(p => p.data);
        }

        return {
            iso,
            color,
            path: pathGen(f)
        };
    });
    return paths;
});

export const map2 = derived([map2Features, map2Projection], ([$features, $projection]) => {
    if (!$projection) return [];
    const pathGen = geoPath().projection($projection);
    const paths = $features.map(f => {
        const { iso, color } = f.properties;
        return {
            iso,
            color,
            path: pathGen(f)
        };
    });
    return paths;
});

export const features = derived([map1Features, map2Features], ([$map1Features, $map2Features]) => {
    return {
        map1: $map1Features,
        map2: $map2Features
    };
});

export const projections = derived([map1Projection, map2Projection], ([$map1Projection, $map2Projection]) => {
    if (!$map1Projection || !$map2Projection) return null;
    return {
        map1: $map1Projection,
        map2: $map2Projection
    };
});

export const maps = derived([map1, map2], ([$map1, $map2]) => {
    return {
        map1: $map1,
        map2: $map2
    };
});
