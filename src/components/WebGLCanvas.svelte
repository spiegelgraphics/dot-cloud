<script>
    import createRegl from 'regl';

    import { createDrawDots } from '../utils/webgl';

    export let dotsStart;
    export let dotsEnd;
    export let width;
    export let height;
    export let defaultPointWidth;
    export let progress;

    let devicePixelRatio = 1;
    let canvas;
    let regl;
    let drawDots;

    $: if (width && height && canvas) {
        devicePixelRatio = window.devicePixelRatio || 1;
    
        canvas.width = devicePixelRatio * width;
        canvas.height = devicePixelRatio * height;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        regl = createRegl({
            canvas,
            pixelRatio: devicePixelRatio,
            attributes: {
                depth: false,
                antialias: true
            }
        });
        drawDots = createDrawDots(regl);
    }

    $: if (drawDots && dotsStart && dotsStart.coords && dotsStart.coords.length && dotsEnd && dotsEnd.coords && dotsEnd.coords.length && progress) {
        const { coords: coordsStart, colors: colorsStart, opacities: opacitiesStart, pointWidth: pointWidthStart = defaultPointWidth } = dotsStart;
        const { coords: coordsEnd, colors: colorsEnd, opacities: opacitiesEnd, pointWidth: pointWidthEnd = defaultPointWidth } = dotsEnd;

        regl.clear({
            color: [0, 0, 0, 0.0],
            depth: 1
        });
        
        drawDots({
          coordsStart,
          colorsStart,
          opacitiesStart,
          coordsEnd,
          colorsEnd,
          opacitiesEnd,
          pointWidthStart: pointWidthStart * devicePixelRatio,
          pointWidthEnd: pointWidthEnd * devicePixelRatio,
          width,
          height,
          progress
        });
    }
</script>

<canvas
    bind:this={canvas}
/>

<style>
    canvas {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 5;
    }
</style>