import { toMultidimensional } from '../helpers';
import PF from 'pathfinding'; // pulling in an a* finder because life is just too short 😘

const day = '11';
const test = toMultidimensional(day, 'test');
const data = toMultidimensional(day, 'data');

const findStars = source => source.reduce((out, row, y) => [...out, ...row.reduce(
    (out, loc, x) => loc === '#' ? [...out, { x, y, key: `${x}-${y}` }] : out, []
)], []);

const getExpansions = source => {
    const cols = new Array(source.length).fill(null).map((_, y) => (
        new Array(source[0].length).fill(null).map((_, x) => source[x][y])
    ));
    return {
        x: cols.reduce((out, loc, x) => (!cols[x].includes('#') ? [...out, x] : out), []),
        y: source.reduce((out, row, y) => (!row.includes('#') ? [...out, y] : out), [])
    }
};

// refactor: general solution baby

const solve = (source, expansionDist = 1000000) => {
    const checked = new Set();
    const paths = [];
    const stars = findStars(source);
    const expansions = getExpansions(source);
    // still doing the exact same thing, find all the stuff
    stars.forEach(start => {
        stars.forEach(end => {
            // same star, don't bother
            if (start.key === end.key) return;
            const routeKey = `${start.key}-${end.key}`;
            const revRouteKey = `${end.key}-${start.key}`;
            // we've already checked this the other way round
            if (checked.has(routeKey)) return;
            // okay let's get the distance
            const grid = new PF.Grid(source[0].length, source.length);
            const finder = new PF.AStarFinder();
            const path = finder.findPath(start.x, start.y, end.x, end.y, grid);
            paths.push(path);
            // add these to the cache so we don't do it again
            checked.add(routeKey);
            checked.add(revRouteKey);
        });
    });
    // this time we have to run through the path and work out when we cross into expanded space
    const distances = paths.map(path => path.reduce((sum, step, i) => {
        if (!i) return sum; // skip the first one, we're looking at distances between
        const [stepX, stepY] = step;
        const [lastX, lastY] = path[i - 1];
        const val =
            (stepX !== lastX && expansions.x.includes(stepX)) ||
            (stepY !== lastY && expansions.y.includes(stepY)) ? expansionDist : 1;
        return sum + val;
    }, 0))
    return distances.reduce((sum, curr) => sum += curr, 0);
}

// one
console.log(solve(test, 2));
console.log(solve(data, 2));

// two
console.log(solve(test, 10));
console.log(solve(test, 100));
console.log(solve(data));