import { toMultidimensional } from '../helpers';

const day = '17';
const test = toMultidimensional(day, 'test');
const test2 = toMultidimensional(day, 'test2');
const data = toMultidimensional(day, 'data');

const dirs = ['S', 'E', 'W', 'N']; // ordered heuristically? maybe? who knows

const getDirFrom = (x, y, dir, map, min, max) => {
    let out = new Array(max).fill(null);
    let heat = 0;
    return out.map((_, i) => {
        const dist = i + 1;
        let cX = x;
        let cY = y;
        if (dir === 'S') cY = y+dist;
        if (dir === 'N') cY = y-dist;
        if (dir === 'E') cX = x+dist;
        if (dir === 'W') cX = x-dist;
        const value = map[cY] && Number(map[cY][cX]);
        heat += value;
        if (dist < min) return { value: null };
        return { x: cX, y: cY, dir, heat, value }
    }).filter(step => step.value);
}

const getMovesFrom = (x, y, map, min, max) => dirs.reduce((out, dir) => ({ ...out, [dir]: getDirFrom(x, y, dir, map, min, max) }), {});

const parseMap = (source, min, max) => source.map((row, y) => row.map((loss, x) => ({ loss, moves: getMovesFrom(x, y, source, min, max) })));

const toKey = (startX, startY, endX, endY) => `${startX}-${startY}-${endX}-${endY}`;

const findBestPath = (source, min = 1, max = 3) => {
    const map = parseMap(source, min, max);
    const start = { x: 0, y: 0, heat: 0 };
    const end = { x: map[0].length - 1, y: map.length - 1 };
    let checked = {};
    let bestHeat = Infinity;
    let q = [{ ...start, dir: 'E' }, { ...start, dir: 'S' }];
    // let's go nerds
    while(q.length) {
        const qItem = q.pop();
        const current = map[qItem.y][qItem.x];
        const nextDirs = (qItem.dir === 'S' || qItem.dir === 'N') ? ['E', 'W'] : ['S', 'N'];
        nextDirs.forEach(dir => current.moves[dir].forEach(move => {
            const newHeat = qItem.heat + move.heat;
            const key = toKey(qItem.x, qItem.y, move.x, move.y);
            // is it worth carrying on?
            if (checked[key] <= newHeat) return;
            if (newHeat >= bestHeat) return;
            checked[key] = newHeat;
            // did we get there?
            if (move.x === end.x && move.y === end.y) {
                bestHeat = Math.min(newHeat, bestHeat);
                return;
            }
            // add this to the queue, continue
            q.push({ x: move.x, y: move.y, dir, heat: newHeat });
            q.sort((a, b) => b.heat - a.heat);
        }))
    }
    return bestHeat;
}
console.log(findBestPath(test));
console.log(findBestPath(data));
console.log(findBestPath(test, 4, 10));
console.log(findBestPath(test2, 4, 10));
console.log(findBestPath(data, 4, 10));