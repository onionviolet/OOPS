import {accrue, createPosition, openAutoSteps, POSITION_SCHEMA, validatePosition} from './progression_path.js';
import {beginQuotedWorking, defineWorkingLaw, quoteWorking, settleWorking} from './kernel_working.js';

export const ROLE_STACK_SCHEMA = 'progression.positions@2';

// A single PRG3 position is the revision 1 wire format. The list preserves
// slot order and each path id is a unique key within this holder.
export function readRoleStack(policy, value) {
    const stack = value?.schema === POSITION_SCHEMA ? {schema:ROLE_STACK_SCHEMA, positions:[value]} : value;
    if (stack?.schema !== ROLE_STACK_SCHEMA || !Array.isArray(stack.positions) ||
        !stack.positions.length || stack.positions.length > policy.slots.length) throw Error('Invalid role slots.');
    const seen = new Set();
    for (const record of stack.positions) {
        const row = policy.roles[record.path]?.row;
        if (!row || seen.has(record.path)) throw Error('Unknown or duplicate role.');
        validatePosition(row, record);
        seen.add(record.path);
    }
    return stack;
}

export function advanceRoles(policy, stack, activity, gain) {
    const positions = readRoleStack(policy, stack).positions.map(record => {
        const role = policy.roles[record.path];
        if (role.activity !== activity) return record;
        const earned = accrue(role.row, record, role.track, gain);
        return openAutoSteps(role.row, earned).record;
    });
    return {schema:ROLE_STACK_SCHEMA, positions};
}

// Changes are declared edges. A merged role names the lineage it carries,
// or starts at an explicit entry position. Uninvolved positions retain order.
function planChange(policy, stack, choice, facts) {
    const current = readRoleStack(policy, stack);
    const {positions} = current;
    const edge = policy.changes[choice];
    if (!edge || positions.some(p => p.path === edge.to) ||
        edge.from.some(id => !positions.some(p => p.path === id))) throw Error('Role change unavailable.');
    const available = policy.slots.filter(slot => !slot.requires || facts[slot.requires]).length;
    if (positions.length - edge.from.length + 1 > available ||
        (edge.requires && !facts[edge.requires])) throw Error('Role slot or requirement is unavailable.');
    const row = policy.roles[edge.to].row;
    const source = positions.find(p => p.path === edge.carry);
    if (edge.requiresEntry && !facts.entry) throw Error('The receiving path must supply its entry position.');
    const entry = edge.requiresEntry ? facts.entry : {position:edge.start ?? 0,tracks:edge.tracks ?? {}};
    const next = source ? createPosition(row, {position:source.position, tracks:source.tracks,since:source.since})
        : createPosition(row, entry);
    const remaining = positions.filter(p => !edge.from.includes(p.path));
    const first = positions.findIndex(p => edge.from.includes(p.path));
    remaining.splice(first < 0 ? remaining.length : first, 0, next);
    const result = readRoleStack(policy, {...current,positions:remaining});
    if (!edge.entryPractice) return result;
    const role = policy.roles[edge.to];
    const earned = accrue(role.row,next,role.track,facts[edge.entryPractice]);
    return {...result,positions:result.positions.map(p=>p===next?openAutoSteps(role.row,earned).record:p)};
}

const law = defineWorkingLaw({id:'progression.role-choice',revision:1,operations:{
    choose:{roles:{},minutes:0,settle:({options})=>({ok:true,effects:[{kind:'roles.changed',...options}]})}
}});
function terms(policy, stack, choice, facts) {
    const next = planChange(policy, stack, choice, facts);
    const method = {id:choice,revision:1,law:law.ref,roles:{},steps:[
        {op:'choose',options:{before:stack,after:next}}
    ]};
    return {method,args:{id:choice,at:0,bindings:{}}};
}
export function quoteRoleChange(policy, stack, choice, facts = {}) {
    const {method,args} = terms(policy,stack,choice,facts);
    return quoteWorking(law,method,args);
}
export function settleRoleChange(policy, stack, choice, facts, fingerprint) {
    const {method,args} = terms(policy,stack,choice,facts);
    const start = beginQuotedWorking(law,method,{...args,fingerprint});
    if (!fingerprint || start.stale) throw Error('Review the current role offer.');
    return settleWorking(law,start.record,{now:0}).record.receipts[0].truth.effects[0].after;
}
