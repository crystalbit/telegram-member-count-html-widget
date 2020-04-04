const colors = [
    '#BFF2D9',
    '#99EAC3',
    '#66DFA5',
    '#33D587',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
    '#00CA69',
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
