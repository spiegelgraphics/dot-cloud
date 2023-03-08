<script>
    import {
        interpolate as interpolatePath,
        separate,
        combine,
        interpolateAll } from 'flubber';

    export let features;
    export let progress;

    const maxSegmentLength = 10;

    function interpolate(t, n) {
        if (!t || !n) return () => {};

        const tArr = t.split('M').filter(d => d !== '').map(d => ['M', d].join(''));
        const nArr = n.split('M').filter(d => d !== '').map(d => ['M', d].join(''));

        if (tArr.length === 1 && nArr.length === 1) {
            return interpolatePath(tArr[0], nArr[0], { single: true, maxSegmentLength });
        } else if (tArr.length === 1) {
            return separate(tArr[0], nArr.slice(0, 2), { single: true, maxSegmentLength });
        } else if (nArr.length === 1) {
            return combine(tArr.slice(0, 2), nArr[0], { single: true, maxSegmentLength });
        } else {
            return interpolateAll(tArr, nArr, { single: true, maxSegmentLength });
        }
    }

    $: interpolator = () => features[0].path;
    $: if (features.length === 2) interpolator = interpolate(features[0].path, features[1].path);

    $: path = interpolator(progress);
</script>

<path
    d={path}
/>

<style>
    path {
        fill: none;
        stroke: black;
        stroke-width: 1;
    }
</style>