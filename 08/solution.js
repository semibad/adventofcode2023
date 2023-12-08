import { toStrings } from '../helpers';

const day = '08';
const test1 = toStrings(day, 'test1');
const test2 = toStrings(day, 'test2');
const test3 = toStrings(day, 'test3');
const data = toStrings(day, 'data');

const goal = 'ZZZ';

const parseMaps = source => {
    const inst = source[0];
    const maps = source.slice(2).reduce((out, curr) => {
        const [loc, l, r] = curr.matchAll(/[0-9A-Z]{3}/g);
        return { ...out, [loc]: { L: l[0], R: r[0] } };
    }, {});
    return { inst, maps };
}

// one

const partOne = source => {
    const { inst, maps } = parseMaps(source);
    let steps = 0;
    let loc = 'AAA';
    let path = inst.split('');
    // right, off we go
    while (loc !== goal) {
        steps ++;
        const step = path.shift();
        loc = maps[loc][step];
        if (!path.length) path = inst.split('');
    }
    return steps;
}

// two

const isA = str => str[2] === 'A';
const isZ = str => str[2] === 'Z';

const isDone = (big, rest) => rest.length === rest.filter(num => big % num === 0).length;

const partTwo = source => {
    const { inst, maps } = parseMaps(source);
    let locations = Object.keys(maps).filter(loc => isA(loc));
    // here we go again
    const toZ = locations.map(loc => {
        let steps = 0;
        let path = inst.split('');
        while (!isZ(loc)) {
            steps ++;
            const step = path.shift();
            loc = maps[loc][step];
            if (!path.length) path = inst.split('');
        }
        return steps;
    })
    // ugh fine let's approximate some maths
    const [big, ...rest] = toZ.sort((a,b) => (b-a));
    let steps = big;
    console.log(big, rest);
    while(!isDone(steps, rest)) {
        steps += big;
    }
    return steps;
}

console.log(partOne(test1));
console.log(partOne(test2));
console.log(partOne(data));
console.log(partTwo(test3));
console.log(partTwo(data));