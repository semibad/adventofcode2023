import { toStrings } from '../helpers';

const day = '06';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

// one

const parseRaceInfo = source => {
    const [time, dist] = source.map(line => line.split(/ +/).slice(1).map(num => Number(num)));
    return time.map((time, i) => ({ time, dist: dist[i]}));
};

const solveRace = race => {
    let wins = 0;
    for (let i = 0; i <= race.time; i++) {
        const perSec = i;
        const secs = race.time - i;
        const travelled = secs * perSec;
        if (travelled > race.dist) wins ++;
    }
    return wins;
};

const partOne = source => parseRaceInfo(source).map(solveRace).reduce((total, curr) => total ? total * curr : curr, 0);

// two

const partTwo = source => {
    const [time, dist] = source.map(line => Number(line.split(/ +/).slice(1).join('')));
    return solveRace({ time, dist });
};

console.log(partOne(test));
console.log(partOne(data));
console.log(partTwo(test));
console.log(partTwo(data));
