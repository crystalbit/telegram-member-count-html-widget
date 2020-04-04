const colors = [
    '#00ee00',
    '#00dd00',
    '#00cc00',
    '#00bb00',
    '#00aa00',
    '#00aa00',
    '#00aa00',
    '#00aa00',
    '#00aa00',
    '#00aa00',
    '#00aa00',
    '#00aa00',
];

const getColor = value => {
    if (value < 0) value = 0;
    if (value > 0.999) value = 0.999;
    
    const index = Math.floor(value * colors.length);
    //console.log(colors[index])
    return colors[index];
};

module.exports = {
    getColor
};
