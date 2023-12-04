import { toStrings } from '../helpers';

const day = '04';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

const parseScratchcard = row => {
    const [_, win, got] = row.split(/: | \| /);  // eslint-disable-line no-unused-vars
    return {
        win: win.trim().split(/ +/),
        got: got.trim().split(/ +/),
    }
};

const parseScratchcards = source => source.map(parseScratchcard);

// one

const calculateValue = card => {
    const wins = card.got.filter(num => card.win.includes(num)).length;
    return wins
        ?  wins === 1 ? 1 : Math.pow(2, wins - 1)
        : 0;
};

const partOne = source => parseScratchcards(source).map(calculateValue).reduce((sum, curr) => sum + curr, 0);

// two

const partTwo = source => {
    const cards = Array(source.length).fill(1); // we start with one of each
    parseScratchcards(source).forEach((card, c) => {
        const wins = card.got.filter(num => card.win.includes(num)).length;
        for (let i = c+1; i < c+1 + wins; i++) {
            if (cards[i] !== undefined) cards[i] += cards[c]; // any dupes will add the same amount of additional cards
        }
    })
    return cards.reduce((sum, curr) => sum + curr, 0);
};

console.log(partOne(test));
console.log(partOne(data));
console.log(partTwo(test));
console.log(partTwo(data));