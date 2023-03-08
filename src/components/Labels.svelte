<script>
    import { afterUpdate } from 'svelte';
    import { fade } from 'svelte/transition';

    export let unit;
    export let yScale;

    const labelElems = [];
    let labelHeight = 0;

    $: height = Math.abs(yScale.range()[1] - yScale.range()[0]);
    $: yTicks = yScale
        .ticks(height / 100)
        .map(t => ({label: t, y: yScale(t)}));

    $: afterUpdate(() => {
        labelHeight = labelElems.map(e => {
            const { height: elemHeight = 0 } = e.getBoundingClientRect();
            return elemHeight;
        });
    });
</script>

<div
    class="labels"
    transition:fade
>
    {#each yTicks as { label, y }, i}
        <div
            class="label"
            style:top="{y}px"
            style:--labelHeight="{labelHeight[i]}px"
            bind:this={labelElems[i]}
        >
            {i === (yTicks.length - 1) ? `${label} ${unit}` : `${label}`}
        </div>
    {/each}
</div>

<style>
    .labels {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
    }

    .label {
        --labelPadding: 0.1rem;
        position: absolute;
        left: 50%;
        padding: var(--labelPadding);
        border: none;
        border-radius: 3px;
        transform: translateX(-50%) translateY(calc(-1 * var(--labelHeight)));
        background: white;
    }
</style>