import { toStrings } from '../helpers';

const day = '07';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

// maps for helping sort relative hand values
const alphaMap = { 'T': 'A', 'J': 'B', 'Q': 'C', 'K': 'D', 'A': 'E' };
const jokerMap = { 'T': 'A', 'J': '0', 'Q': 'C', 'K': 'D', 'A': 'E' };
const typeMap = { 'high': 0, 'two': 1, 'twoPair': 2, 'three': 3, 'fullHouse': 4, 'four': 5, 'five': 6 };

const getType = (hand, jokers = false) => {
    // get counts of each card
    const countByCard = hand.reduce((out, card) => out[card] ? { ...out, [card]: out[card] + 1 } : {...out, [card]: 1 } , {});
    // handle jokers if we're doing that
    let jokerCount = 0;
    if (jokers) {
        jokerCount = countByCard.J || 0;
        delete(countByCard.J);
    }
    const counts = Object.values(countByCard).sort((a, b) => b - a);
    // now work out what hand we've got
    let [pri, sec] = counts;
    pri += jokerCount;
    if (pri === 5 || jokerCount === 5) return 'five'; // nasty edge case – 5 jokers is 5 aces
    if (pri === 4) return 'four';
    if (pri === 3) {
        if (sec === 2) return 'fullHouse';
        return 'three';
    }
    if (pri === 2) {
        if (sec === 2) return 'twoPair';
        return 'two';
    }
    return 'high';
};

const parseHands = (source, jokers = false) => source.map(row => {
    let [hand, bid] = row.split(' ');
    hand = hand.split('');
    const type = getType(hand, jokers);
    const typeValue = typeMap[type];
    return { 
        hand, 
        alphaHand: hand.map(card => jokers ? jokerMap[card] || card : alphaMap[card] || card).join(''),
        type,
        typeValue,
        bid: Number(bid)
    };
});

const handSort = (a, b) => {
    if (a.type === b.type) return a.alphaHand < b.alphaHand ? -1 : 1;
    return a.typeValue < b.typeValue ? -1 : 1;
};

// one

const partOne = source => parseHands(source).sort(handSort).reduce((sum, hand, i) => sum + (hand.bid * (i+1)), 0);

// two

const partTwo = source => parseHands(source, true).sort(handSort).reduce((sum, hand, i) => sum + (hand.bid * (i+1)), 0);

console.log(partOne(test));
console.log(partOne(data));
console.log(partTwo(test));
console.log(partTwo(data));
