<script>
    import { scaleLinear } from 'd3';

    import { dots } from '../stores/dots';
    import { maps } from '../stores/map';
    import { settings } from '../stores/config';

    import Map from './Map.svelte';
    import WebGLCanvas from './WebGLCanvas.svelte';
    import Labels from './Labels.svelte';

    export let width;
    export let height;
    export let slideIndex;
    export let progress;

    $: currentSlide = $dots[slideIndex] || {};
    $: previousSlide = $dots[slideIndex - 1] || currentSlide;

    $: ({layout: { map: currentMapId } = {}} = currentSlide);
    $: currentMap = $maps[currentMapId];
    $: ({layout: { map: previousMapId } = {}} = previousSlide);
    $: previousMap = $maps[previousMapId];

    $: progressScale = scaleLinear()
        .domain([0, $settings.max_offset])
        .range([0, 1])
        .clamp(true);
    $: scaledProgress = progressScale(progress);
</script>

<div class="visualization">
    {#if (currentMap)}
        <Map
            mapStart={previousMap}
            mapEnd={currentMap}
            progress={scaledProgress}
        />
    {/if}
    <WebGLCanvas
        dotsStart={previousSlide}
        dotsEnd={currentSlide}
        width={width}
        height={height}
        defaultPointWidth={$settings.point_width}
        progress={scaledProgress}
    />
    {#if (currentSlide.labels)}
        <Labels
            unit={currentSlide.labels.unit}
            yScale={currentSlide.yScale}
        />
    {/if}
</div>

<style>
    .visualization {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>