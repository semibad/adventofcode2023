import { toBlocks } from '../helpers';

const day = '05';
const test = toBlocks(day, 'test');
const data = toBlocks(day, 'data');

const parseMaps = source => {
    let [seeds, ...maps] = source;
    // format seed list
    seeds = seeds[0].split(': ').reduce((out, part, i) => i === 1 && part.split(' ').map(num => Number(num)), null);
    // format maps
    maps = maps.map(m => m.slice(1).map(r => {
        const [dest, source, range] = r.split(' ').map(num => Number(num));
        return { source, dest, range }; 
    }));
    return { seeds, maps };
};

const getLocation = (seed, maps) => maps.reduce((location, stage, i) => stage.reduce((loc, r, ii) => {    
    const matches = (loc >= r.source && loc < r.source + r.range);
    return matches && loc === location
        ? r.dest + (loc - r.source)
        : loc
}, location), seed);

const getLocations = source => {
    const { seeds, maps } = parseMaps(source);
    return seeds.map(seed => getLocation(seed, maps));
}

const partOne = source => getLocations(source).reduce((out, curr) => curr < out ? curr : out, Infinity);

// two

const partTwo = source => { // this works but it's not optimal, took a good few minutes :D
    const { seeds, maps } = parseMaps(source);
    let lowest = Infinity;
    for (let i = 0; i < seeds.length; i += 2) {
        const start = seeds[i];
        const range = seeds[i+1];
        console.log(start, range);
        for (let s = start; s <= start+range; s++) {
            const location = getLocation(s, maps);
            lowest = location < lowest ? location : lowest;
        }
    }
    return lowest;
};

console.log(partOne(test));
console.log(partOne(data));
console.log(partTwo(test));
console.log(partTwo(data));
