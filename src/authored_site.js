// C4 live authoring: one original optional site with one timed activity and a
// gather activity, compiled into the existing schema-1 optional pack adapter.
// Supported properties are exactly the DRAFT_FIELDS below. Anything else is
// rejected; this is not a universal editor and it never lists existing content.
import {object} from './basics.js';
import {validatePack, registerPack, validatePackState} from './content_packs.js';

export const AUTHORED_PACK_ID = 'authored_site';
export const AUTHORED_WORLD_ID = 'authored_site.world';
export const AUTHORED_SITE_ID = 'authored_site.site';
export const AUTHORED_WORK_ID = 'authored_site.work';
export const AUTHORED_GATHER_ID = 'authored_site.gather';
export const AUTHORED_FILE_FORMAT = 'yairpg-authored-site';
export const AUTHORED_FILE_VERSION = 1;
export const MAX_AUTHORED_PAY = 500;

// [key, kind, label, min, max]. Text min/max are lengths; numbers are integers.
export const DRAFT_FIELDS = Object.freeze([
    ['siteName', 'text', 'Site name', 1, 40],
    ['siteDescription', 'text', 'Site description', 0, 240],
    ['inputName', 'text', 'Material name', 1, 24],
    ['inputStart', 'int', 'Starting material', 0, 999],
    ['outputName', 'text', 'Product name', 1, 24],
    ['activityName', 'text', 'Activity name', 1, 40],
    ['activityDescription', 'text', 'Activity description', 0, 240],
    ['requiredInput', 'int', 'Material needed to start', 1, 999],
    ['inputCost', 'int', 'Material used', 0, 999],
    ['minutes', 'int', 'Work time (played minutes)', 1, 1440],
    ['outputGain', 'int', 'Product made', 0, 999],
    ['coinPay', 'int', 'Coin paid on completion (wood coins)', 0, MAX_AUTHORED_PAY],
    ['gatherMinutes', 'int', 'Gather time (played minutes)', 1, 1440],
    ['gatherAmount', 'int', 'Material gathered', 1, 99],
].map(Object.freeze));

// Proposal fiction; every value is editable.
export const DEFAULT_DRAFT = Object.freeze({
    siteName: 'Reed Hollow',
    siteDescription: 'A damp hollow south of the Village where reeds grow thick enough to cut.',
    inputName: 'Reeds',
    inputStart: 6,
    outputName: 'Mats',
    activityName: 'Weave a reed mat',
    activityDescription: 'Twist cut reeds into a sleeping mat a trader will buy.',
    requiredInput: 3,
    inputCost: 3,
    minutes: 30,
    outputGain: 1,
    coinPay: 8,
    gatherMinutes: 20,
    gatherAmount: 2,
});

const control = /[\u0000-\u001f\u007f]/;

class DraftError extends Error {
    constructor(reasons) {super(reasons.join(' ')); this.reasons = reasons;}
}

/** Returns a normalized copy or throws DraftError listing every reason. */
export function validateDraft(raw) {
    if(!object(raw)) throw new DraftError(['The draft must be a set of named fields.']);
    const reasons = [], draft = {}, known = new Set(DRAFT_FIELDS.map(f => f[0]));
    for(const key of Object.keys(raw)) if(!known.has(key)) reasons.push(`Unsupported property "${String(key).slice(0, 40)}".`);
    for(const [key, kind, label, min, max] of DRAFT_FIELDS) {
        const value = raw[key];
        if(kind === 'text') {
            if(typeof value !== 'string') {reasons.push(`${label} must be text.`); continue;}
            const text = value.trim();
            if(control.test(text)) reasons.push(`${label} cannot contain control characters.`);
            else if(text.length < min) reasons.push(`${label} is required.`);
            else if(text.length > max) reasons.push(`${label} must be at most ${max} characters.`);
            draft[key] = text;
        } else {
            if(!Number.isSafeInteger(value)) {reasons.push(`${label} must be a whole number.`); continue;}
            if(value < min || value > max) reasons.push(`${label} must be from ${min} to ${max}.`);
            draft[key] = value;
        }
    }
    if(!reasons.length && draft.inputCost > draft.requiredInput) reasons.push('Material used cannot exceed material needed to start.');
    if(!reasons.length && draft.inputName.toLowerCase() === draft.outputName.toLowerCase()) reasons.push('Material and product need different names.');
    if(reasons.length) throw new DraftError(reasons);
    return draft;
}

/** Compiles a valid draft into a schema-1 optional pack checked by validatePack. */
export function compileDraft(raw) {
    const d = validateDraft(raw);
    const work = {id: AUTHORED_WORK_ID, label: d.activityName, description: d.activityDescription || `Turn ${d.inputName} into ${d.outputName}.`,
        duration: d.minutes, requires: [{field: 'input', op: 'gte', value: d.requiredInput}],
        start: d.inputCost ? {add: {input: -d.inputCost}} : {}, complete: d.outputGain ? {add: {output: d.outputGain}} : {}, pay: d.coinPay};
    const gather = {id: AUTHORED_GATHER_ID, label: `Gather ${d.inputName}`, description: `Collect ${d.gatherAmount} ${d.inputName}.`,
        duration: d.gatherMinutes, start: {}, complete: {add: {input: d.gatherAmount}}};
    const pack = {schema: 1, id: AUTHORED_PACK_ID, title: d.siteName, authored: true,
        description: d.siteDescription || 'An original site you authored.',
        world: {id: AUTHORED_WORLD_ID, label: d.siteName},
        locations: [{id: AUTHORED_SITE_ID, label: d.siteName, description: d.siteDescription}],
        people: [], initial: {input: d.inputStart, output: 0},
        status: {input: d.inputName, output: d.outputName}, activities: [work, gather]};
    return validatePack(pack).definition;
}

export function exportAuthoredFile(raw) {
    return JSON.stringify({format: AUTHORED_FILE_FORMAT, version: AUTHORED_FILE_VERSION, draft: validateDraft(raw)}, null, 2);
}

export function parseAuthoredFile(text) {
    let data;
    try {data = JSON.parse(text);} catch {throw new DraftError(['This file is not valid JSON.']);}
    if(!object(data) || data.format !== AUTHORED_FILE_FORMAT) throw new DraftError(['This is not an authored site file.']);
    if(!Number.isSafeInteger(data.version) || data.version < 1) throw new DraftError(['This authored site file has no valid version.']);
    if(data.version > AUTHORED_FILE_VERSION) throw new DraftError([`This file was made by a newer version (${data.version}); this build reads version ${AUTHORED_FILE_VERSION}.`]);
    return validateDraft(data.draft);
}

const requireNotVisiting = state => {
    if(state.packs[AUTHORED_PACK_ID]?.active) throw new Error('Return to the Village from the authored site before changing it.');
};

/** Applied content lives in the save as its validated draft. */
export function applyAuthoredState(state, raw) {
    validatePackState(state); requireNotVisiting(state);
    const draft = validateDraft(raw); compileDraft(draft);
    const next = structuredClone(state); next.authored = {schema: 1, draft};
    return validatePackState(next);
}

/** Reset removes the authored site, its local progress and its registration provenance. */
export function resetAuthoredState(state) {
    validatePackState(state); requireNotVisiting(state);
    if(!state.authored) throw new Error('No authored site is applied.');
    const next = structuredClone(state);
    delete next.authored; delete next.packs[AUTHORED_PACK_ID];
    if(next.registered) delete next.registered[AUTHORED_PACK_ID];
    return validatePackState(next);
}

function unregister(d, {registry, locations, definitions}) {
    registry.worlds.delete(d.world.id);
    for(const a of d.activities) registry.actions.delete(a.id);
    for(const p of d.people) registry.simulation.people.delete(p.id);
    for(const l of d.locations) delete locations[l.id];
    definitions.delete(d.id);
}

/**
 * Makes the registered authored pack match `draft` (null removes it). Validates
 * before touching registries and restores the previous registration on failure.
 */
export function syncAuthoredRegistration(draft, owners) {
    const compiled = draft ? compileDraft(draft) : null;
    const old = owners.definitions.get(AUTHORED_PACK_ID);
    if(old) unregister(old, owners);
    if(!compiled) return null;
    try {
        const d = registerPack(compiled, owners.registry, owners.locations, owners.makeLocation);
        owners.definitions.set(d.id, d); return d;
    } catch(error) {
        if(old) {registerPack(old, owners.registry, owners.locations, owners.makeLocation); owners.definitions.set(old.id, old);}
        throw error;
    }
}
