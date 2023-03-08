import { writable, derived } from 'svelte/store';
import { debounce } from 'lodash-es';

export const width = writable(0);
export const height = ((startValue) => {
    const { subscribe, set: oSet } = writable(startValue);

    const set = debounce((value) => {
        oSet(value);
    }, 500);

    return {
        subscribe,
        set,
        bypassSet: oSet
    };
})(0);

export const padding = writable(16);

export const isSmall = derived(width, $width => {
    return $width < 520;
});

export const headerHeight = derived(isSmall, ($isSmall) => {
    let result = $isSmall ? 100 : 108;    
    return result;
}, 0);

export const contentHeight = derived([height, headerHeight], ([$height, $headerHeight]) => {
    let availableHeight = $height - $headerHeight;
    return Math.max(0, availableHeight);
}, 0);

export const top = derived([height, headerHeight], ([$height, $headerHeight]) => {
    return $headerHeight / $height;
}, 0);

export const bottom = derived([height, headerHeight], () => {    
    return 1;
}, 0);
