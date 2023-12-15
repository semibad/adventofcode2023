import { readData } from '../helpers';

const day = '15';
const test = readData(day, 'test');
const data = readData(day, 'data');

const HASH = str => str.split('').reduce((out, char) => (((out + char.charCodeAt(0)) * 17) % 256), 0);

// one

const hashAll = source => source.split(',').map(HASH);

const partOne = source => hashAll(source).reduce((sum, num) => sum + num, 0);

// two

const parse = source => source.split(',').map(inst => {
    const [code, value] = inst.split('=');
    return value !== undefined
        ? { code, value: Number(value), op: '=' }
        : { code: code.split('-')[0], op: '-' }
});

const emptyRange = new Array(256).fill(null).map(() => []);

const partTwo = source => parse(source)
    .reduce((out, inst) => {
        const box = HASH(inst.code);
        const found = out[box].findIndex(el => el.code === inst.code);
        // if this is an = operation
        if (inst.op === '=') {
            const newLens = { code: inst.code, value: inst.value };
            const newBox = found > -1
                ? out[box].with(found, newLens)
                : [...out[box], newLens];
            return out.with(box, newBox);
        }
        // if this is an - operation
        const newBox = out[box].filter(el => el.code !== inst.code);
        return out.with(box, newBox);
    }, emptyRange)
    .reduce((sum, box, boxNum) => box.length
        ? sum + box.reduce((sum, lens, lensNum) => sum + ((boxNum+1) * (lensNum+1) * lens.value), 0)
        : sum
    , 0);

console.log(partOne(test));
console.log(partOne(data));
console.log(partTwo(test));
console.log(partTwo(data));