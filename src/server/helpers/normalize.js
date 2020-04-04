const data = {
    min: 0,
    max: 1000
};

const setBounds = (min, max) => {
    data.min = min;
    data.max = max;
};

const getProportion = value => {
    const proportion = (value - data.min) / (data.max - data.min);
    // console.log({proportion})
    if (proportion < 0) return 0;
    if (proportion > 1) return 1;
    return proportion;
};

module.exports = {
    setBounds,
    getProportion
};
