// Heir succession from what a life actually left behind (accepted direction,
// docs/RULES_FROM_SCRATCH.md#the-heir, 2026-10-10). Pure: reads a saved
// envelope, never storage. Names, numbers and fiction here are reversible
// proposals: half reputation, the Shack as the village home, the apprentice
// as recipient when one was taught.
import {check, positive as count} from './basics.js';
import {setSavedPurse} from './money.js';
const LESSON_IDS = Object.freeze(['routeSignals', 'guardLesson', 'controlPattern']);
export const HEIR_OBLIGATIONS = Object.freeze({
    grievance: 'An unsettled assault grievance with the elder (3-coin restitution still owed)',
    archiveDuty: 'An unkept promise to organize the elder\'s archive',
});
export const HEIR_HOME_LOCATION = 'Shack';
const MAX_ROWS = 512;
const object = v => v && typeof v === 'object' && !Array.isArray(v);

function rows(owner) {
    if(!object(owner)) return [];
    return Object.entries(owner).filter(([key, row]) => typeof key === 'string' && key.length <= 2048 && count(row?.count))
        .map(([key, row]) => [key, row.count]);
}
function merge(target, entries) {
    for(const [key, n] of entries) target[key] = {count: (target[key]?.count || 0) + n};
}
export function itemLabel(key) {
    try {const parsed = JSON.parse(key); if(typeof parsed?.id === 'string') return parsed.id;} catch {}
    return String(key);
}

// equippedKeys: inventory keys of gear the ended body wore. The live host
// supplies them; equipment in the save is not a stable item-key source.
export function deriveHeirLeftovers(previous, {equippedKeys = []} = {}) {
    const c = previous?.expansion?.chronicle;
    check(c && c.life?.endedAt != null, 'This life has not ended.');
    const x = c.life.experience || {};
    const written = (x.reflected || []).filter(id => LESSON_IDS.includes(id));
    const taught = (x.taught || []).filter(id => LESSON_IDS.includes(id));
    const carried = rows(previous.inventories?.person?.main_character);
    const worn = {};
    for(const key of equippedKeys) if(typeof key === 'string' && key) worn[key] = (worn[key] || 0) + 1;
    const belongings = {};
    merge(belongings, carried); merge(belongings, Object.entries(worn));
    const chest = rows(previous.inventories?.storage?.player);
    const purse = Number.isSafeInteger(previous.character?.money) && previous.character.money > 0 ? previous.character.money : 0;
    // The estate settles a recorded Village kit debt before anything passes.
    // A shortfall is written off (proposal; the career ledger has no heir row).
    const owed = Number.isSafeInteger(previous.village_career?.debt) && previous.village_career.debt > 0 ? previous.village_career.debt : 0;
    const paid = Math.min(purse, owed), money = purse - paid;
    const debts = owed ? [{id: 'kitDebt', owed, paid, shortfall: owed - paid}] : [];
    const home = !!((previous.availabilities?.location?.[HEIR_HOME_LOCATION] ?? 0) & 1);
    const reputation = {};
    for(const [region, v] of Object.entries(previous.character?.reputation || {})) {
        const half = Math.trunc(v / 2);
        if(Number.isSafeInteger(v) && half !== 0) reputation[region] = half;
    }
    const ties = c.relationships?.villageElder?.ties || {};
    const obligations = [];
    if(ties.grievance) obligations.push('grievance');
    if(ties.archiveDuty && !ties.dutyKept) obligations.push('archiveDuty');
    const leftovers = {schema: 1, recipient: taught.length ? 'apprentice' : 'kin',
        money, belongings: Object.entries(belongings).map(([k, v]) => [k, v.count]).slice(0, MAX_ROWS), chest: chest.slice(0, MAX_ROWS),
        home, reputation, papers: [...new Set(written)], apprentice: [...new Set(taught)],
        obligations, debts, archiveLine: !!ties.successor};
    leftovers.empty = !money && !leftovers.belongings.length && !leftovers.chest.length && !home && !leftovers.papers.length && !leftovers.apprentice.length;
    return leftovers;
}

export function validateHeirLeftovers(l) {
    check(object(l) && l.schema === 1 && ['kin', 'apprentice'].includes(l.recipient) && Number.isSafeInteger(l.money) && l.money >= 0 &&
        typeof l.home === 'boolean' && typeof l.archiveLine === 'boolean' && typeof l.empty === 'boolean', 'Invalid inheritance.');
    for(const list of [l.belongings, l.chest]) check(Array.isArray(list) && list.length <= MAX_ROWS && list.every(r => Array.isArray(r) && typeof r[0] === 'string' && count(r[1])), 'Invalid inherited goods.');
    for(const list of [l.papers, l.apprentice]) check(Array.isArray(list) && list.length <= 3 && new Set(list).size === list.length && list.every(id => LESSON_IDS.includes(id)), 'Invalid inherited lessons.');
    check(Array.isArray(l.obligations) && l.obligations.every(id => Object.hasOwn(HEIR_OBLIGATIONS, id)), 'Invalid inherited obligations.');
    check(object(l.reputation) && Object.values(l.reputation).every(Number.isSafeInteger), 'Invalid inherited standing.');
    check(Array.isArray(l.debts) && l.debts.every(d => d?.id === 'kitDebt' && [d.owed, d.paid, d.shortfall].every(n => Number.isSafeInteger(n) && n >= 0) && d.paid + d.shortfall === d.owed), 'Invalid estate debts.');
    return l;
}

// Adds the leftovers to a pristine envelope in place. The heir's own body,
// starting belongings, skills and XP stay their own.
export function applyHeirLeftovers(next, leftovers) {
    validateHeirLeftovers(leftovers);
    setSavedPurse(next, (next.character.money || 0) + leftovers.money, 'heir inheritance');
    const inv = next.inventories ||= {};
    merge(((inv.person ||= {}).main_character ||= {}), leftovers.belongings);
    merge(((inv.storage ||= {}).player ||= {}), leftovers.chest);
    if(leftovers.home) {
        const loc = ((next.availabilities ||= {}).location ||= {});
        loc[HEIR_HOME_LOCATION] = (loc[HEIR_HOME_LOCATION] ?? 0) | 1;
    }
    const rep = next.character.reputation ||= {};
    for(const [region, v] of Object.entries(leftovers.reputation)) if(Object.hasOwn(rep, region)) rep[region] += v;
    return next;
}

const total = list => list.reduce((n, [, c]) => n + c, 0);
// Short plain-English lines for the ended-life dialog and the heir's journal.
export function heirLeftoverLines(l, labels = {}) {
    const lessonName = id => labels[id] || id;
    const goods = list => list.slice(0, 6).map(([k, n]) => `${itemLabel(k)}${n > 1 ? ` ×${n}` : ''}`).join(', ') + (list.length > 6 ? `, and ${list.length - 6} more` : '');
    const lines = [l.recipient === 'apprentice' ? 'Recipient: the apprentice you taught.' : 'Recipient: your next of kin.'];
    if(l.money) lines.push(`Money: ${l.money} coins.`);
    if(l.belongings.length) lines.push(`Belongings (${total(l.belongings)}): ${goods(l.belongings)}.`);
    if(l.chest.length) lines.push(`Stored in the chest (${total(l.chest)}): ${goods(l.chest)}.`);
    if(l.home) lines.push('Home: the Shack in the Village.');
    if(l.papers.length) lines.push(`Written papers: ${l.papers.map(lessonName).join(', ')} (study each to learn it).`);
    if(l.apprentice.length) lines.push(`Taught to the apprentice: ${l.apprentice.map(lessonName).join(', ')}.`);
    const standing = Object.entries(l.reputation).map(([r, v]) => `${r} ${v > 0 ? '+' : ''}${v}`);
    if(standing.length) lines.push(`Family standing: ${standing.join(', ')}.`);
    for(const d of l.debts) lines.push(`Debt settled first: the estate paid ${d.paid} of ${d.owed} coins owed to the Village guard for a kept kit${d.shortfall ? `; the remaining ${d.shortfall} was written off` : ''}.`);
    if(l.archiveLine) lines.push('The elder\'s archive stays with your line.');
    for(const id of l.obligations) lines.push(`Obligation: ${HEIR_OBLIGATIONS[id]}.`);
    if(l.empty) lines.push('This life left almost nothing behind. The heir starts with only their own things.');
    return lines;
}
