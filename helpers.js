import fs from 'fs';

// basic read of file from given day number
const readData = (day, file = 'data') => fs.readFileSync(`${__dirname}/${day}/${file}.txt`, 'utf8'); // eslint-disable-line no-undef

// split by line, strings
const toStrings = (day, file) => readData(day, file).split("\n");

// split by line, converted to numbers, empty line returns undefined
const toNumbers = (day, file) => toStrings(day, file).map(curr => curr === '' ? undefined : Number(curr)) || [];

// split into multidimensional grid
const toMultidimensional = (day, file) => toStrings(day, file).map(row => row.split(''));

// split into multidimensional grid, converted to numbers
const toMultidimensionalNumeric = (day, file) => toMultidimensional(day, file).map(curr => Number(curr));

// split into blocks (double returns) then lines, strings
const toBlocks = (day, file) => readData(day, file)
    .split("\n\n")
    .map(block => block.split("\n"));

    // split into blocks (double returns) then lines, arrays
const toMultidimensionalBlocks = (day, file) => readData(day, file)
.split("\n\n")
.map(block => block.split("\n").map(row => row.split('')));

// save a list of numbers
const saveNumbers = (arr, day, filename = 'saved') => {
    const contents = arr.join('\n');
    fs.writeFileSync(`${__dirname}/${day}/${filename}.txt`, contents); // eslint-disable-line no-undef
}

// save a multiline string
const saveString = (input, day, filename = 'render') => {
    fs.writeFileSync(`${__dirname}/${day}/${filename}.txt`, input); // eslint-disable-line no-undef
}

// deep clone a data structure
const deepClone = data => JSON.parse(JSON.stringify(data));

// hash a string (borrowed from https://stackoverflow.com/a/52171480)
const hash = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export { 
    readData, toStrings, toNumbers, toMultidimensional, toMultidimensionalNumeric, 
    toBlocks, toMultidimensionalBlocks, saveNumbers, saveString, deepClone, hash
};