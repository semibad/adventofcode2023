import { toMultidimensional, deepClone, hash } from '../helpers';

const day = '14';
const test = toMultidimensional(day, 'test');
const data = toMultidimensional(day, 'data');

const findBoulders = source => source.reduce(
    (out, row, y) => row.reduce((out, loc, x) => loc === 'O' ? [...out, { x, y }] : out, out)
, []);

// one

const moveBoulders = (source, render = false) => {
    let grid = deepClone(source);
    const boulders = findBoulders(source);
    boulders.forEach((boulder) => {
        for (let y = boulder.y; y >= 0; y--) {
            if (!y || grid[y-1][boulder.x] !== '.') {
                grid[boulder.y][boulder.x] = '.';
                grid[y][boulder.x] = 'O';
                return;
            }
        }
    });
    // render it?
    if (render) {
        console.log(grid.map(row => row.join('')).join('\n'));
    }
    return grid;
}

const partOne = source => moveBoulders(source, true).reverse().reduce(
    (sum, row, i) => sum + row.filter(loc => loc === 'O').length * (i+1)
, 0)

// two

const rotateGrid = grid => grid[0].map((val, index) => grid.map(row => row[index]).toReversed());

const dirs = ['N', 'W', 'S', 'E'];

const moveBouldersWithRotations = (source, render = false, fullRotations = 1000000000) => {
    let cache = {};
    let grid = deepClone(source);
    let rotations = 0;
    let hasSkipped = false; // definitely could do better, but YOLO
    while (rotations < fullRotations) {
        let rotationCache = [];
        console.log(`rotation ${rotations}`);
        dirs.forEach(dir => {
            const boulders = findBoulders(grid);
            const toCache = dir + hash(JSON.stringify(grid));
            rotationCache.push(toCache);
            boulders.forEach((boulder) => {
                for (let y = boulder.y; y >= 0; y--) {
                    if (!y || grid[y-1][boulder.x] !== '.') {
                        grid[boulder.y][boulder.x] = '.';
                        grid[y][boulder.x] = 'O';
                        return;
                    }
                }
            });
            grid = rotateGrid(grid);
        })
        rotations ++;
        if (render) {
            console.log(grid.map(row => row.join('')).join('\n'));
            console.log('')
        }
        // have we got a suitable cached result
        const hashedRotation = hash(rotationCache.join(''))
        if (cache[hashedRotation] && !hasSkipped) {
            // we have a pattern!
            const patternLength = rotations - cache[hashedRotation];
            // skip to the ennnnd
            hasSkipped = true;
            rotations = fullRotations - ((fullRotations - rotations) % patternLength);
            console.log(`skipped to ${rotations}`);
            
        }
        cache[hashedRotation] = rotations;
    }
    
    return grid;
}

const partTwo = source => moveBouldersWithRotations(source).reverse().reduce(
    (sum, row, i) => sum + row.filter(loc => loc === 'O').length * (i+1)
, 0)

console.log(partOne(test));
console.log(partOne(data));
console.log(partTwo(test));
console.log(partTwo(data));
