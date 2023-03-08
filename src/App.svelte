<script>
    import { onMount } from 'svelte';

    import Scroller from '@sveltejs/svelte-scroller/Scroller.svelte';

    import {
        width,
        height,
        top,
        contentHeight
    } from './stores/dimensions';
    import { slides, settings } from './stores/config';
    import { params } from './stores/params';

    import SizeDetector from './components/SizeDetector.svelte';
    import Visualization from './components/Visualization.svelte';
    import Slides from './components/Slides.svelte';
    import Sources from './components/Sources.svelte';

    let index, offset;

    onMount( () => {
        height.bypassSet(window.innerHeight);
    });
</script>

<svelte:window bind:innerHeight={$height} />

<div class="graphics-svelte-app">
    <SizeDetector bind:width={$width}>
        <div class="scroller-wrapper">
            {#if ($slides && $slides.length)}
                <Scroller
                    top={$top}
                    threshold={$settings.scroller_threshold}
                    bind:index={index}
                    bind:offset={offset}
                >
                    <div
                        slot="background"
                        style="height: {$contentHeight}px;"
                    >
                        <Visualization
                            width={$width}
                            height={$contentHeight}
                            slideIndex={index}
                            progress={offset}
                        />
                    </div>
                    <div slot="foreground">
                        <Slides />
                    </div>
                </Scroller>
            {/if}
        </div>
    </SizeDetector>
    <Sources
        sources={$params.sources}
    />
</div>

<style>
    .graphics-svelte-app {
        width: 100%;
    }

    .scroller-wrapper {
        position: relative;
        margin: 0rem;
    }

    [slot="background"] {
        width: 100%;
    }

    [slot="foreground"] {
        overflow: hidden;
    }
</style>
