import { toStrings } from '../helpers';

const day = '09';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

const toSequences = source => source.map(seq => seq.split(' ').map(num => Number(num)));

const getInSequence = (addToRight = true) => seq => {
    let stack = [seq];
    let i = 0;
    // keep doing this until we've got a sequence of a single value
    while(stack[i].filter(num => num === stack[i][0]).length != stack[i].length) {
        // add a sequence of differences between values to the stack
        stack.push(stack[i].reduce((out, num, ii) => ii === 0 ? out : [...out, num - stack[i][ii - 1]], []));
        i++;
    }
    // go back through the stack, adding the value to the last (or first) value to get our answer
    return stack.reduceRight((out, seq) => (addToRight ? seq[seq.length - 1] + out : seq[0] - out), 0);
}

// one

const nextInSequence = getInSequence();

const partOne = source => toSequences(source).map(nextInSequence).reduce((sum, num) => num + sum, 0);

// two

const prevInSequence = getInSequence(false);

const partTwo = source => toSequences(source).map(prevInSequence).reduce((sum, num) => num + sum, 0);

console.log(partOne(test));
console.log(partOne(data));
console.log(partTwo(test));
console.log(partTwo(data));