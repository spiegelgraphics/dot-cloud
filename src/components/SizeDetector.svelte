<script>
    import { onMount } from 'svelte';

    export let width = undefined;
    export let height = undefined;

    let tid;
    let container;

    function handleResize() {
        clearTimeout(tid);
        if (!container) return;
        ({ width, height } = container.getBoundingClientRect());
    }

    function throttleResize() {
        clearTimeout(tid);
        tid = setTimeout(handleResize, 100);
    }

    onMount(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            throttleResize();
        }, 125);

        new ResizeObserver(throttleResize).observe(container);

        return () => clearTimeout(tid);
    });
</script>

<svelte:window on:resize={throttleResize} />

<div
    class="size-detector"
    bind:this={container}
>
    <slot />
</div>

<style>
    .size-detector {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>