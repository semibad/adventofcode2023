import { toStrings } from '../helpers';

const day = '01';
const test1 = toStrings(day, 'test');
const test2 = toStrings(day, 'test2');
const data = toStrings(day, 'data');

// one
const taskOne = (source) => source.map(row => row.split('').reduce((digits, curr) => {
    let [one, two] = digits;
    if (!isNaN(Number(curr))) {
        two = curr;
        one = one || curr;
    }
    return [one, two];
}, [null, null]).join('')).reduce((sum, curr) => sum + Number(curr), 0);


// two
const numbers = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const valueFromRow = row => {
    let str = row;
    let one, two = null;
    while (str) {
        for (let num = 1; num < 10; num ++) {
            if (str.startsWith(`${num}`) || str.startsWith(numbers[num])) {
                two = num; one = one || num;
            }
        }
        str = str.substring(1);
    }
    return `${one}${two}`;
}

const taskTwo = (source) => source.map(valueFromRow).reduce((sum, curr) => sum + Number(curr), 0);

console.log(taskOne(test1));
console.log(taskOne(data));

console.log(taskTwo(test2));
console.log(taskTwo(data));
