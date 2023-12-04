import { toStrings } from '../helpers';

const day = '02';
const test = toStrings(day, 'test1');
const data = toStrings(day, 'data');

const parseGame = row => {
    const game = row.split(': ')[1];
    const pulls = game
        .split('; ')
        .map(pull => pull.split(', ').reduce(
         (out, item) => {
            const [count, colour] = item.split(' ');
            return { ...out, [colour]: out[colour] < count ? Number(count) : out[colour] };
         }, {red: 0, green: 0, blue: 0}));
    return pulls;
}
const parseGames = source => source.map(parseGame);

// one
const max = {red: 12, green: 13, blue: 14};

const gameIsPossible = game => !game.filter(pull => max.red < pull.red || max.green < pull.green || max.blue < pull.blue).length;

const getPossibleGames = source => parseGames(source).reduce((sum, game, i) => (
    gameIsPossible(game) ? sum + i + 1 : sum
), 0);

const taskOne = source => getPossibleGames(source);

// two
const getPowers = source => parseGames(source)
    .map(game => game.reduce((out, pull) => (
        { 
            red: pull.red > out.red ? pull.red : out.red,
            green: pull.green > out.green ? pull.green : out.green, 
            blue: pull.blue > out.blue ? pull.blue : out.blue, 
        }
    ), {red: 0, green: 0, blue: 0}))
    .map(game => game.red * game.green * game.blue);

const taskTwo = source => getPowers(source).reduce((sum, curr) => sum + curr);

console.log(taskOne(test));
console.log(taskOne(data));

console.log(taskTwo(test));
console.log(taskTwo(data));