export const createDrawDots = (regl) => regl({
    frag: `
        precision mediump float;

        varying vec3 fragColor;
        varying float fragOpacity;
    
        void main() {
            float point_dist = length(gl_PointCoord * 2. - 1.);
            if(point_dist > 1.0) discard;
            gl_FragColor = vec4(fragColor, fragOpacity);
        }
    `,
    vert: `
        precision mediump float;

        attribute vec2 coordStart;
        attribute vec3 colorStart;
        attribute float opacityStart;
        attribute vec2 coordEnd;
        attribute vec3 colorEnd;
        attribute float opacityEnd;
        
        varying vec3 fragColor;
        varying float fragOpacity;
        
        uniform float width;
        uniform float height;
        uniform float pointWidthStart;
        uniform float pointWidthEnd;
        uniform float progress;
    
        vec2 normalizeCoords(vec2 coord) {
            float x = coord[0];
            float y = coord[1];
    
            return vec2(2.0 * ((x / width) - 0.5), -(2.0 * ((y / height) - 0.5)));
        }
    
        void main() {
            gl_PointSize = mix(pointWidthStart, pointWidthEnd, progress);

            vec2 coord = mix(coordStart, coordEnd, progress);
            vec3 color = mix(colorStart, colorEnd, progress);
            float opacity = mix(opacityStart, opacityEnd, progress);
    
            fragColor = color;
            fragOpacity = opacity;

            gl_Position = vec4(normalizeCoords(coord), 0.0, 1.0);
        }
    `,
  
    attributes: {
        coordStart: (_, props) => props.coordsStart,
        colorStart: (_, props) => props.colorsStart,
        opacityStart: (_, props) => props.opacitiesStart,
        coordEnd: (_, props) => props.coordsEnd,
        colorEnd: (_, props) => props.colorsEnd,
        opacityEnd: (_, props) => props.opacitiesEnd
    },
    
    uniforms: {
        width: (_, props) => props.width,
        height: (_, props) => props.height,
        pointWidthStart: (_, props) => props.pointWidthStart,
        pointWidthEnd: (_, props) => props.pointWidthEnd,
        progress: (_, props) => props.progress
    },

    depth: {
        enable: false,
        mask: false
    },

    blend: {
        enable: true,
        func: {
            srcRGB: 'src alpha',
            srcAlpha: 'src alpha',
            dstRGB: 'one minus src alpha',
            dstAlpha: 'one minus src alpha'
        }
    },
  
    count: (_, props) => props.coordsStart.length,
  
    primitive: 'points'
});
