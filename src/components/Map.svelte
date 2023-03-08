<script>
    import { fade } from 'svelte/transition';

    import { width, contentHeight, padding } from '../stores/dimensions';

    import MapFeature from './MapFeature.svelte';

    export let mapStart;
    export let mapEnd;
    export let progress;

    $: maps = mapEnd.map(d => {
        const { iso } = d;
        if (!mapStart) return [d];
        const e = mapStart.find(dd => dd.iso === iso);
        return [e, d];
    });

</script>

<svg
    width={Math.max(0, $width - 2 * $padding)}
    height={Math.max(0, $contentHeight - 2 * $padding)}
    transition:fade
>
    {#each maps as featurePair}
        <MapFeature
            features={featurePair}
            progress={mapStart ? progress : 1}
        />
    {/each}
</svg>

<style>
    svg {
        overflow: visible;
        opacity: 0.5;
    }
</style>