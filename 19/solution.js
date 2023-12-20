import { toBlocks, deepClone } from '../helpers';

const day = '19';
const test = toBlocks(day, 'test');
const data = toBlocks(day, 'data');

// it's all about the parsing

const parseInstructions = instructions => {
    return instructions.split(',').map(inst => {
        const [comp, to] = inst.split(':');
        // if this is the 'default' final instruction, handle
        if (!to) return { to: inst };
        // parse the comparison
        return { to, key: comp[0], op: comp[1], value: Number(comp.substring(2)) }
    });
}

const parseWorkflow = row => {
    let [name, instructions] = row.split(/\{|\}/);
    return { name, instructions: parseInstructions(instructions) }
}

const parseItem = row => row.split(/\{|\}/)[1].split(',').reduce((out, item) => {
    const [key, value] = item.split('=');
    return { ...out, [key]: Number(value), workflow: 'in' }
}, {})

const parseInput = source => {
    const [ workflows, items ] = source;
    return { 
        workflows: workflows.map(parseWorkflow).reduce((out, current) => ({ ...out, [current.name]: current.instructions}), {}),
        items: items.map(parseItem).map(item => ({ ...item, value: item.x + item.m + item.a + item.s }))
    };
}

// one

const sortItems = source => {
    const { items, workflows } = parseInput(source);
    const sorted = items.map(item => {
        while(item.workflow !== 'A' && item.workflow !== 'R') {
            const workflow = workflows[item.workflow];
            for (const inst of workflow) {
                // let's check to see if we're changing workflows
                const matches = !inst.key || (inst.op === '>' ? item[inst.key] > inst.value : item[inst.key] < inst.value);
                if (matches) {
                    item.workflow = inst.to;
                    break;
                }
            }
        }
        return item;
    });
    return sorted;
};

const partOne = source => sortItems(source).reduce((sum, curr) => sum += curr.workflow === 'A' ? curr.value : 0, 0);

// two

const acceptItem = item => {
    console.log(item);
    return  (item.least.x - item.most.x + 1) *
            (item.least.m - item.most.m + 1) *
            (item.least.a - item.most.a + 1) *
            (item.least.s - item.most.s + 1);
} 

// in progress, ugh feels like i'm on the right track but we'll see
const partTwo = source => {
    const { workflows } = parseInput(source);
    let sum = 0;
    let q = [{ 
        wf: 'in',
        least: { x: 1, m: 1, a: 1, s: 1 },
        most: { x: 4000, m: 4000, a: 4000, s: 4000 }
    }];
    // okay let's loop it up
   while (q.length) {
        const item = deepClone(q.pop());
        const workflow = workflows[item.wf];
        // do we need to resolve this?
        if (item.wf === 'A') {
            sum += acceptItem(item);
            continue;
        }
        if (item.wf === 'R') continue;
        // we continue, let's split this
        for (const inst of workflow) {
            if (!inst.key) { // this is a default
                item.wf = inst.to;
                item.isSplit = false;
                q.push(item);
                continue;
            }
            const split = deepClone(item); // split off a clone;
            // update the split
            if (inst.op === '<') { // the split path is less than inst.value
                split.most[inst.key] = Math.min(inst.value -1, split.most[inst.key])
                item.least[inst.key] = Math.max(inst.value, item.least[inst.key])
            } else {
                split.least[inst.key] = Math.max(inst.value +1, split.least[inst.key])
                item.most[inst.key] = Math.min(inst.value, item.most[inst.key])
            }
            split.wf = inst.to;
            split.isSplit = true;
            q.push(split);
        }
    }
    console.log(4000*4000*4000*4000, '(max)');
    console.log(167409079868000, '(expected)');
    return sum;
}
console.log(partOne(test));
console.log(partOne(data));

console.log(partTwo(test));