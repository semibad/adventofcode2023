import { toBlocks } from '../helpers';

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

console.log(partOne(test));
console.log(partOne(data));