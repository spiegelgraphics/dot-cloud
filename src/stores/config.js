import { derived } from 'svelte/store';
import { json } from 'd3';

import { params } from './params';
import { isSmall } from './dimensions';


export const config = derived(params, async ($params, set) => {
    const config = await json($params.config);
    set(config);
});

export const slides = derived([config, isSmall], ([$config, $isSmall]) => {
    const { slides = [] } = $config || {};
    return slides.map((d, i) => {
        const layout = {...d.layout};
        if (d.layout) {
            const pointWidth = layout[`point_width_${$isSmall ? 'mobile' : 'desktop'}`];
            if (pointWidth) {
                layout.point_width = pointWidth;
            }
        }
        return {
            id: i,
            ...d,
            layout
        };
    });
});

export const settings = derived([config, isSmall], ([$config, $isSmall]) => {
    const { settings = {} } = $config || {};
    if (settings.foreground_color) {
        settings.foreground_color = settings.foreground_color.map(d => d / 255);
        settings.point_width = settings[`point_width_${$isSmall ? 'mobile' : 'desktop'}`];
    }
    return settings;
});
