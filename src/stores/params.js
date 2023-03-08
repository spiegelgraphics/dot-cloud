import { readable } from 'svelte/store';
import { autoType } from 'd3';

const defaultParams = {
    data: 'data.csv',
    config: 'config.json',
    map1: 'russia_comp.geojson',
    map2: 'russia_squares.geojson',
    sources: 'Interactive'
};

export const params = readable({}, set => {
    const urlParamsObj = new URLSearchParams(window.location.search);
    const urlParams = Object.fromEntries(urlParamsObj);
    const completeParams = {
        ...defaultParams,
        ...autoType(urlParams)
    };
    set(completeParams);
});
