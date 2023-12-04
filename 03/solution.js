import { toMultidimensional } from '../helpers';

const day = '03';
const test = toMultidimensional(day, 'test1');
const data = toMultidimensional(day, 'data');

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const getNumbersFromRow = (row) => {
    let output = [];
    let current = { start: null, end: null, num: ''};
    row.forEach((char, i) => {
        if (digits.includes(char)) { // start of a new number
            if (!current.num) { // no number in progress
                current.start = i;
                current.num += char;
                // is this the end of the number?
                if (row[i+1] === undefined || !digits.includes(row[i+1])) {
                    current.end = i;
                    output = [...output, current];
                    current = { start: null, end: null, num: ''};
                }
            } else { // ongoing number
                current.num += char;
                // is this the end of the number?
                if (row[i+1] === undefined || !digits.includes(row[i+1])) {
                    current.end = i;
                    output = [...output, current];
                    current = { start: null, end: null, num: ''};
                }
            }
        }
    })
    return output;
};

const getNumbers = source => source.map(getNumbersFromRow);

const getFlatNumbers = source => getNumbers(source)
    .reduce((out, row, i) => [...out, ...row.map(number => ({ ...number, row: i }))], [])

// part one
const emptyNeighbours = ['.', undefined, ...digits];

const isEnginePart = (block, source) => {
    if (block.row > 0) { // check above
        for (let x = block.start - 1; x <= block.end + 1; x++) {
            if (!emptyNeighbours.includes(source[block.row-1][x])) return true;
        }
    }
    if (block.row < source.length - 1) { // check below
        for (let x = block.start - 1; x <= block.end + 1; x++) {
            if (!emptyNeighbours.includes(source[block.row+1][x])) return true;
        }
    }
    // check left and right
    if (!emptyNeighbours.includes(source[block.row][block.start - 1])) return true;
    if (!emptyNeighbours.includes(source[block.row][block.end + 1])) return true;
    // no neighbour characters found
    return false;
};

const getValidNumbers = source => getFlatNumbers(source).map(block => ({ ...block, valid: isEnginePart(block, source )}));

const partOne = source => getValidNumbers(source).reduce((sum, curr) => curr.valid ? sum + Number(curr.num) : sum, 0);

// part two
const getNumberWithGears = (block, source) => {
    let gears = [];
    if (block.row > 0) { // check above
        for (let x = block.start - 1; x <= block.end + 1; x++) {
            if (source[block.row-1][x] === '*') gears.push({ x, y: block.row-1 });
        }
    }
    if (block.row < source.length - 1) { // check below
        for (let x = block.start - 1; x <= block.end + 1; x++) {
            if (source[block.row+1][x] === '*') gears.push({ x, y: block.row+1 });
        }
    }
    // check left and right
    if (source[block.row][block.start - 1] === '*') gears.push({ x: block.start - 1, y: block.row });
    if (source[block.row][block.end + 1] === '*') gears.push({ x: block.end + 1, y: block.row });
    return { ...block, gears }
}

const getNumbersWithGears = source => getFlatNumbers(source).map(block => getNumberWithGears(block, source));

const getValidGears = source => getNumbersWithGears(source).reduce((out, current) => {
    current.gears.forEach(gear => {
        const key = `${gear.x}-${gear.y}`;
        if (!out[key]) {
            out[key] = [current.num]
        } else {
            out[key].push(current.num);
        }
    })
    return out;
}, {});

const partTwo = source => Object.values(getValidGears(source)).reduce((sum, gear) => (gear.length === 2 ? sum + (Number(gear[0]) * Number(gear[1])) : sum), 0);

console.log(partOne(test));
console.log(partOne(data));
console.log(partTwo(test));
console.log(partTwo(data));
