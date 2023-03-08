import { derived } from 'svelte/store';
import { csv, autoType, shuffle } from 'd3';

import { params } from './params';


export const data = derived(params, async ($params, set) => {
    const data = await csv($params.data, autoType);
    
    const fData = data.map(d => {
        return {
            age: d.age,
            cat0: d.cat0 !== 0,
            cat1: d.cat1 !== 0,
            cat2: d.cat2 !== 0,
            cat3: d.cat3,
            region_iso: d.region_iso
        };
    });

    shuffle(fData);

    const ffData = fData.map((d, i) => ({id: i, ...d}));

    set(ffData);
});
