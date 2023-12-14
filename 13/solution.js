import { toMultidimensionalBlocks } from '../helpers';

const day = '13';
const test = toMultidimensionalBlocks(day, 'test');
const data = toMultidimensionalBlocks(day, 'data');

const reflect = on => row => {
    const partSize = Math.min(on, row.length - on);
    const left = row.slice(on - partSize, on).join('');
    const right = row.slice(on, on + partSize).reverse().join('');
    return (left === right);
}

const checkBlock = toIgnore => block => {
    // we'll also need this as a column grid
    const columns = new Array(block[0].length).fill(null).map((_, y) => (
        new Array(block.length).fill(null).map((_, x) => block[x][y])
    ));
    let total = 0;
    // check for horizontal
    for (const chunk of [block, columns]) {
        const isHoriz = chunk === columns;
        for(let on = 1; on < chunk[0].length; on++) {
            if (chunk.filter(reflect(on)).length === chunk.length) {
                const score = isHoriz ? on * 100 : on
                if (score !== toIgnore) total += score;
            }
        }
    }
    return total;
}

// one

const partOne = source => source.map(checkBlock(0)).reduce((sum, num) => sum + num, 0);

// two

const checkBlocksForSmudge = source => source.map(block => {
    // let's get our old solve to ignore
    const toIgnore = checkBlock(0)(block);
    console.log(toIgnore);
    // now let's run through and try fixing these mirrors i guess
    for (let y = 0; y < block.length; y++) {
        for (let x = 0; x < block[0].length; x++) {
            const newBlock = JSON.parse(JSON.stringify(block)); // deep clone the block so we don't mess up future iterations
            newBlock[y][x] = newBlock[y][x] === '#' ? '.' : '#';
            const score = checkBlock(toIgnore)(newBlock);
            if (score) return score;
        }
    }
    console.log('uh oh'); // try not to end up here
});

const partTwo = source => checkBlocksForSmudge(source).reduce((sum, num) => sum + num, 0);


console.log(partOne(test));
console.log(partOne(data));
console.log(partTwo(test));
console.log(partTwo(data));