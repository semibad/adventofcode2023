import { toStrings } from '../helpers';

const day = '12';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

const parseContent = source => source.map(row => {
    const [cond, instructions] = row.split(' ');
    const inst = instructions.split(',').map(num => Number(num));
    return {
        cond,
        inst
    };
})

const isValidCondition = (cond, inst) => 
    JSON.stringify(cond.replaceAll('.', ' ').trim().split(/ +/).map(cond => cond.length)) === JSON.stringify(inst);

const isValidPartial = (cond, inst, toReplace) => {
    const partial = cond.split('?')[0].replaceAll('.', ' ').trim().split(/ +/).map(cond => cond.length);
    if (!partial.length) return true; // for now
    // let's check ahead a bit
    const partialCurrent = partial[partial.length - 1]
    const condCurrent = cond[partial.length - 1]
    const diff = condCurrent - partialCurrent;
    const ahead = diff > 0 ? cond.substring(toReplace, toReplace + diff) : '';
    // if this iteration means we're already over the next condition
    if (diff > 0) return false;
    // if the next iterations wouldn't meet the next condition
    if (diff < diff.length && ahead.includes('.')) return false;
    if (diff.length < diff && ahead.includes('#')) return false;
    // just check to see if this can work
    return JSON.stringify(partial.slice(0, -1)) === JSON.stringify(inst.slice(0, partial.length - 1));
}

const getPermutations = ({ cond, inst }, i, arr) => {
    // right, let's find all the permutations
    let q = [cond];
    let total = 0;
    while (q.length) {
        const current = q.shift();
        const toReplace = current.split('').indexOf('?');
        // does it still have gaps to fill?
        if (toReplace > -1) {
            for (const c of [current.replace('?', '.'), current.replace('?', '#')]) {
                if (isValidPartial(c, inst)) q.push(c);
            }
        } else {
            if (isValidCondition(current, inst, toReplace)) total ++;
        }
    }
    console.log(`${total} (${i+1}/${arr.length})`);
    return total;
}

// one

const partOne = source => parseContent(source).map(getPermutations).reduce((sum, num) => sum + num, 0);

// two

const parseUnfolded = source => source.map(row => {
    const [cond, instructions] = row.split(' ');
    const inst = instructions.split(',').map(num => Number(num));
    return {
        cond: `${cond}?${cond}?${cond}?${cond}?${cond}`,        // i know
        inst: [...inst, ...inst, ...inst, ...inst, ...inst]     // I KNOW
    };
})

// current status: runs indefinitely, yayyyyyy
const partTwo = source => parseUnfolded(source).map(getPermutations).reduce((sum, num) => sum + num, 0);

console.log(partOne(test));
console.log(partTwo(data));
