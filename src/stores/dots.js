import { derived } from 'svelte/store';

import { width, contentHeight, padding } from './dimensions';
import { data } from './data';
import { slides, settings } from './config';
import { features, projections } from './map';

import * as layouts from '../utils/layouts';
import * as colors from '../utils/colors';

export const dots = derived([width, padding, contentHeight, data, slides, settings, features, projections], ([$width, $padding, $height, $data, $slides, $settings, $features, $projections]) => {
    if (!$width || !$height || !$data || !$slides || !$settings || !$projections) return [];
    const rndArray = $data.map(_ => Array.from({length: 3}).map(_ => $settings.rnd_offset * (Math.random() * 2 - 1)));
    let previousLayoutParams = {};
    const dots = $slides.map(slide => {
        const { layout, color } = slide;
        let layoutParams = previousLayoutParams;
        if (layout.type !== 'previous') {
            layoutParams = layouts[layout.type]({
                width: $width,
                height: $height,
                data: $data,
                pointWidth: layout.point_width || $settings.point_width,
                color: $settings.foreground_color,
                opacity: $settings.opacity,
                features: $features[layout.map],
                projection: $projections[layout.map],
                padding: $padding,
                rndArray,
                ...layout
            });
        }
        previousLayoutParams = {...layoutParams};

        let colorParams = {};
        if (color) {
            colorParams = colors[color.type]({
                data: $data,
                color: $settings.foreground_color,
                opacity: $settings.opacity,
                rndArray,
                ...color
            });
        }

        return {
            ...slide,
            data: $data,
            ...layoutParams,
            ...colorParams
        };
    });
    return dots;
});
