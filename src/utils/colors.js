// identity
export const identity = ({data, color, opacity, rndArray}) => {
    const opacities = data.map(_ => opacity);
    const colors = data.map((_, i) => color.map((c, j) => c + rndArray[i][j]));
    return { opacities, colors };
};

// inclusion highlight
export const inclusion_highlight = ({data, color, opacity, rndArray, variable, value, highlight_color, background_opacity}) => {
    const colors = data.map((d, i) => ((value.includes(d[variable]) ? highlight_color : color).map((c, j) => c + rndArray[i][j])));
    const opacities = data.map(d => value.includes(d[variable]) ? opacity : background_opacity);

    return { opacities, colors };
};
