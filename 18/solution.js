import { toStrings, saveString } from '../helpers';

const day = '18';
const test = toStrings(day, 'test');
const data = toStrings(day, 'data');

// one (my original naïve solution)

const parseInstructions = source => source.map(row => {
    const [dir, dist, colour] = row.split(' ');
    return { dir, dist: Number(dist), colour }
});

const dirs = ['R', 'D', 'L', 'U']

const toIgnore = ['O', 'X'];

const flood = (map, fromX = 0, fromY = 0) => {
    let q = [{ x: fromX, y: fromY }];
    while (q.length) {
        const {x, y} = q.pop();
        map[y][x] = 'O';
        [{ x: x-1, y }, { x: x+1, y }, { x, y: y-1 }, { x, y: y+1 }].forEach(next => {
            if (map[next.y] && map[next.y][next.x] && !toIgnore.includes(map[next.y][next.x])) {
                q.push(next);
            }
        })
    }
    return map;
}

const partOne = (source) => {
    const digPlan = parseInstructions(source);
    let x = 0, y = 0;
    let steps = [{ x, y }];
    // let's make a set of step-by-step digs
    digPlan.forEach(inst => {
        for (let i = 1; i <= inst.dist; i++) {
            if (inst.dir === 'U') y -= 1;
            if (inst.dir === 'D') y += 1;
            if (inst.dir === 'L') x -= 1;
            if (inst.dir === 'R') x += 1;
            steps.push({ x, y });
        }
    });
    // now get the bounds so we can normalise it
    const bounds = steps.reduce((out, step) => ({
        x: { min: Math.min(step.x, out.x.min ), max: Math.max(step.x, out.x.max ) },
        y: { min: Math.min(step.y, out.y.min ), max: Math.max(step.y, out.y.max ) }
    }), { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } });
    // now let's draw it
    const width = Math.abs(bounds.x.min - bounds.x.max) + 1, height = Math.abs(bounds.y.min - bounds.y.max) + 1;
    console.log(width, height);
    const grid = new Array(height).fill(null).map(() => 
        new Array(width).fill(' ')
    );
    steps.map(step => ({ x: step.x - bounds.x.min, y: step.y - bounds.y.min })).forEach(step => grid[step.y][step.x] = 'X');
    // let's flood fill it then
    const expGrid = [ // expand the grid
        new Array(grid[0].length + 2).fill(' '),
        ...grid.map(row => [' ', ...row, ' ']),
        new Array(grid[0].length + 2).fill(' ')
    ];
    const floodedGrid = flood(expGrid);
    // render / save it out
    const render = floodedGrid.map(row => row.join('')).join('\n').replaceAll(' ', 'X').replaceAll('O', ' ');
    saveString(render, day);
    // how many squares did we dig out
    return floodedGrid.flat().filter(sq => sq !== 'O').length;
}

// two

const decodeInstructions = source => source.map(row => {
    const code = row.match(/[A-Fa-f0-9]{6}/)[0];
    return {
        dir: dirs[code.slice(-1)],
        dist: parseInt(code.slice(0, 5), 16)
    }
});

// adapted from https://gist.github.com/tnraro/f6c0bf3daa711721d3ce0dea1c37124a 
const shoelace = p => {
    let sum = 0;
    const len = p.length;
    for(let i = 0; i < len; i += 2){
        sum += p[i] * p[(i + 3) % len] - p[i + 1] * p[(i + 2) % len];
    }
    return Math.abs(sum) * 0.5;
}

const partTwo = source => {
    // could use parseInstructions() and this would work for part one, but I left the code I used above anyway
    const plan = decodeInstructions(source);
    let x = 0, y = 0;
    let poly = [];
    let length = 0;
    // let's make a set of step-by-step digs
    plan.forEach(inst => {
        length += inst.dist;
        if (inst.dir === 'U') y -= inst.dist;
        if (inst.dir === 'D') y += inst.dist;
        if (inst.dir === 'L') x -= inst.dist;
        if (inst.dir === 'R') x += inst.dist;
       poly = [...poly, x, y];
    });
    const area = shoelace(poly);
    // this works and honestly i don't 100% understand why, i just spotted the numbers made sense??
    return area + (length / 2) + 1;
}

console.log(partOne(test));
console.log(partOne(data));

console.log(partTwo(test));
console.log(partTwo(data));