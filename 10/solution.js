import { toMultidimensional } from '../helpers';

const day = '10';
const test = toMultidimensional(day, 'test');
const test2 = toMultidimensional(day, 'test2');
const data = toMultidimensional(day, 'data');

const pipes = {
    '|': ['N', 'S'],
    '-': ['W', 'E'],
    'L': ['N', 'E'],
    'J': ['N', 'W'],
    '7': ['S', 'W'],
    'F': ['S', 'E'],
    '.': [],
    'S': ['N', 'S', 'E', 'W']
};

const opp = { 'N': 'S', 'S': 'N', 'E': 'W', 'W': 'E' };

const parseMap = source => source.map((row, y) => row.map((loc, x) => ({ loc, pipe: loc, x, y, potentialDirs: pipes[loc] })));

const getNextLoc = (x, y, dir, map) => { // return the next element in a given grid, or undefined if it's invalid
    let nextLoc;
    if (dir === 'N') nextLoc = map[y-1] && map[y-1][x]; 
    if (dir === 'S') nextLoc = map[y+1] && map[y+1][x];
    if (dir === 'E') nextLoc = map[y][x+1];
    if (dir === 'W') nextLoc = map[y][x-1];
    return nextLoc;
};

const validateMap = source => parseMap(source).map((row, y) => row.map((loc, x) => {
    const validDirs = loc.potentialDirs.filter(dir => {
        const locToValidate = getNextLoc(x, y, dir, source);        
        return locToValidate && pipes[locToValidate].includes(opp[dir]);
    });
    return { ...loc, validDirs };
}));

const findStart = source => source.reduce((out, row, y) => row.reduce((out, loc, x) => loc === 'S' ? { x, y } : out, out), {});

// one

const walkFromStart = source => {
    const start = findStart(source);
    const map = validateMap(source);
    // walk it;
    let loc = map[start.y][start.x];
    let steps = 0;
    let nextDir = loc.validDirs[0] // let's just do the first one
    while (loc.pipe !== 'S' || steps === 0) {
        loc = getNextLoc(loc.x, loc.y, nextDir, map);
        nextDir = loc.validDirs.filter(dir => dir !== opp[nextDir])[0];
        steps++;
    }
    return steps / 2;
}

// two

const toKey = (x, y) => `${x}-${y}`;
const fromKey = key => {
    const [x, y] = key.split('-');
    return { x: Number(x), y: Number(y) }
}

const findPath = (map, start) => {
    let keys = [];
    // walk it;
    let loc = map[start.y][start.x];
    let nextDir = loc.validDirs[0] // let's just do the first one
    while (loc.pipe !== 'S' || !keys.length) {
        keys.push(toKey(loc.x, loc.y));
        loc = getNextLoc(loc.x, loc.y, nextDir, map);
        nextDir = loc.validDirs.filter(dir => dir !== opp[nextDir])[0];
    }
    return keys;
}

const dirs = ['N', 'S', 'E', 'W'];

// this is great EXCEPT:
//      a) inefficient, although that's solvable
//      b) forgot about the whole 'can travel between pipes' criteria (that's a bigger issue)
// so! stowing this one for now, although I have some ideas ;D
const checkContainment = (x, y, uncontained, contained, isPipe, map) => {
    // initialise the queue to check through
    const key = toKey(x, y);
    const q = [key];
    // ... and an empty cache for the ones we've checked which we will be able to resolve later :)
    const checked = new Set()
    let isUncontained = false;
    // if we've already resolved this, do nothing
    if (uncontained.has(key) || contained.has(key) || isPipe.has(key)) return;
    // let's go girls
    while (q.length) {
        let nextKey = q.shift();
        // console.log(`checking ${nextKey}`);
        // check each neighbour
        dirs.forEach(dir => {
            const next = fromKey(nextKey);
            const newLoc = getNextLoc(next.x, next.y, dir, map);
            const newKey = newLoc && toKey(newLoc.x, newLoc.y);
            // if this is an edge or is resolved uncontained, then this is uncontained
            if (!newLoc || uncontained.has(newKey)) {
                isUncontained = true;
                return;
            }
            // if this is already resolved, do nothing
            if (contained.has(newKey) || isPipe.has(newKey) || checked.has(newKey)) return;
            // add it to the queue to check around
            q.push(newKey);
        })
        checked.add(nextKey);
    }
    // now we've walked the paths, we should be good to add these to the caches
    if (isUncontained) {
        checked.forEach(key => uncontained.add(key));
    } else {
        checked.forEach(key => contained.add(key));
    }
}

const findEnclosed = source => {
    const start = findStart(source);
    const map = validateMap(source);
    // let's make some caches for locations we know are contained / uncontained
    const contained = new Set();
    const uncontained = new Set();
    const isPipe = new Set(findPath(map, start));
    // helper to check a location and add it to a cache if necessary
    // now let's run through, building the lists up as we go
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            checkContainment(x, y, uncontained, contained, isPipe, map);
        }
    }
    return contained;
}

// quick and dirty visualisation of the pipeline
const drawMap = source => {
    const start = findStart(source);
    const map = validateMap(source);
    // walk it;
    const inPath = findPath(map, start);
    return map.reduce((out, row) => out + row.reduce((out, loc) => out += inPath.includes(toKey(loc.x, loc.y)) ? loc.loc : ' ', '') + '\n', '')
    
}

console.log(drawMap(data));