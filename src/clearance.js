// World-neutral clearance leaf (Q4, implementation map C9/C2, extraction E2). A world declares an ordered role ladder and a table of
// graded items; this leaf answers "may this actor, with these people present, handle a grade-N item?" and says why not. It holds no
// state, clock or save (AR3, AR12): roles come from the owning domain's facts, custody stays with the custody owner. The first consumer
// is the Tingen church teams; tests prove the seam with a second world's rows as a fixture, not as runtime (AR11).
import {check, deepFreeze, natural, object} from './basics.js';
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.-]*$/.test(v);
const text = v => typeof v === 'string' && v.length > 0;
// roles: ids from lowest to highest. grades: {grade: {needs:{atLeast?, anyOf?, group?:{min, atLeast}}, line, vague}}.
export function defineClearance(desc) {
    check(object(desc) && id(desc.id) && Array.isArray(desc.roles) && desc.roles.length > 1 && desc.roles.every(id) && new Set(desc.roles).size === desc.roles.length, 'Invalid clearance roles.');
    check(object(desc.grades) && Object.keys(desc.grades).length > 0, 'A clearance table needs graded rows.');
    for (const [grade, row] of Object.entries(desc.grades)) {
        check(natural(Number(grade)) && object(row) && object(row.needs) && text(row.line) && text(row.vague), `Invalid clearance row ${grade}.`);
        const n = row.needs;
        check(n.atLeast === undefined || desc.roles.includes(n.atLeast), `Unknown role in ${grade}.`);
        check(n.anyOf === undefined || Array.isArray(n.anyOf) && n.anyOf.length > 0 && n.anyOf.every(r => desc.roles.includes(r)), `Unknown role in ${grade}.`);
        check(n.group === undefined || object(n.group) && natural(n.group.min) && n.group.min > 1 && desc.roles.includes(n.group.atLeast), `Invalid group rule in ${grade}.`);
        check(n.atLeast !== undefined || n.anyOf !== undefined || n.group !== undefined, `Row ${grade} requires nothing.`);
    }
    return deepFreeze(structuredClone(desc));
}
const rank = (table, role) => table.roles.indexOf(role);
// actor: the requester's role id. present: role ids of the other people in the room. known: whether the requester knows the rule
// (an unknown rule is shown as the vague line, never the numbers, GTR10).
export function clearanceFor(table, grade, {role, present = [], known = true}) {
    const row = table.grades[grade];
    check(row, `No grade ${grade} in ${table.id}.`);
    const n = row.needs, reasons = [];
    if (n.atLeast && rank(table, role) < rank(table, n.atLeast)) reasons.push(`needs ${n.atLeast.replace(/_/g, ' ')} clearance`);
    if (n.anyOf && !n.anyOf.includes(role)) reasons.push(`needs ${n.anyOf.map(r => r.replace(/_/g, ' ')).join(' or ')} clearance`);
    if (n.group) {
        const size = [role, ...present].filter(r => rank(table, r) >= rank(table, n.group.atLeast)).length;
        if (size < n.group.min) reasons.push(`needs a group of ${n.group.min} with ${n.group.atLeast.replace(/_/g, ' ')} clearance (${size} here)`);
    }
    return {ok: reasons.length === 0, grade: Number(grade), reasons: known ? reasons : [row.vague], line: known ? row.line : row.vague};
}
