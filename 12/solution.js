import { toStrings } from '../helpers';

const day = '12';
const test = toStrings(day, 'test');
const fixed = toStrings(day, 'fixedTest');
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

const isValidPartial = (cond, inst) => {
    const partial = cond.split('?')[0].replaceAll('.', ' ').trim().split(/ +/).map(cond => cond.length);
    if (!partial.length) return true; // for now
    if (partial[partial.length - 1] > cond[partial.length - 1]) return false;
    return JSON.stringify(partial.slice(0, -1)) === JSON.stringify(inst.slice(0, partial.length - 1));
}

const getPermutations = ({ cond, inst }, i, arr) => {
    console.log(`checking ${cond} (${i+1}/${arr.length})`);
    // right, let's find all the permutations
    let q = [cond];
    let total = 0;
    while (q.length) {
        const current = q.shift();
        // does it still have gaps to fill?
        if (current.includes('?')) {
            for (const c of [current.replace('?', '.'), current.replace('?', '#')]) {
                if (isValidPartial(c, inst)) q.push(c);
            }
        } else {
            if (isValidCondition(current, inst)) total ++;
        }
    }
    console.log(total);
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

const partTwo = source => parseUnfolded(source).map(getPermutations).reduce((sum, num) => sum + num, 0);

console.log(partOne(test));
console.log(partOne(data));
