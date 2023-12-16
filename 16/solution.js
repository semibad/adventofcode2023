import { toMultidimensional } from '../helpers';

const day = '16';
const test = toMultidimensional(day, 'test');
const data = toMultidimensional(day, 'data');

const parseMap = source => source.map((row, y) => row.map((char, x) => ({ char, key: `${x}-${y}` ,touched: false })));

const redirects = {
    '|': { E: ['N', 'S'], W: ['N', 'S'] },
    '-': { N: ['E', 'W'], S: ['E', 'W'] },
    '/': { N: ['E'], E: ['N'], S: ['W'], W: ['S'] },
    '\\': { N: ['W'], E: ['S'], S: ['E'], W: ['N'] },
}

const beam = (x, y, dir, map, cache = new Set()) => {
    // we're going to cache cause there are definitely loops in the data sets
    cache.add(`${dir}-${x}-${y}`);
    while (true) { // eslint-disable-line no-constant-condition
        if (dir === 'N') y--;
        if (dir === 'S') y++;
        if (dir === 'W') x--;
        if (dir === 'E') x++;
        const newLoc = map[y] && map[y][x];
        if (!newLoc) return;
        newLoc.touched = true;
        const redirect = redirects[newLoc.char] && redirects[newLoc.char][dir];
        if (redirect) {
            redirect.forEach(newDir => { if (!cache.has(`${newDir}-${x}-${y}`)) beam(x, y, newDir, map, cache) });
            return;
        }
    }
}

// one

const partOne = (source, startX = -1, startY = 0, dir = 'E', render = false) => {
    const map = parseMap(source);
    beam(startX, startY, dir, map);
    // render it
    if (render) {
        console.log(map.map(row => row.map(loc => loc.touched ? '#' : loc.char).join('')).join('\n'));
    }
    return map.flat().filter(el => el.touched).length;
}

// two

const partTwo = source => {
    const starts = [
        ...new Array(source.length).fill(null).map((_, y) => ({ x: -1, y, dir: 'E' })),
        ...new Array(source.length).fill(null).map((_, y) => ({ x: source[0].length, y, dir: 'W' })),
        ...new Array(source[0].length).fill(null).map((_, x) => ({ x, y: -1, dir: 'S' })),
        ...new Array(source[0].length).fill(null).map((_, x) => ({ x, y: source.length, dir: 'N' }))
    ];
    return starts.map(start => partOne(source, start.x, start.y, start.dir)).reduce((out, curr) => Math.max(out, curr), 0);
}
console.log(partOne(test));
console.log(partOne(data));
console.log(partTwo(test));
console.log(partTwo(data));