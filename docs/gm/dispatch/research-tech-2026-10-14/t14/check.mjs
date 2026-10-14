// T14 scratch check. Run with: node docs/gm/dispatch/research-tech-2026-10-14/t14/check.mjs
// This imports real source, reads this lane's JSON and performs in-memory checks only.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {validateCheatCard, defaultCheatState, grantCheat, recordCheatMessage, validateCheatState}
    from '/Users/weiwei/code/yet-another-idle-rpg/src/cheat_cards.js';

const sourcePath = '/Users/weiwei/code/yet-another-idle-rpg/src/cheat_cards.js';
const cardsPath = new URL('./cards.json', import.meta.url);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceBefore = sha(readFileSync(sourcePath));
const cardBytes = readFileSync(cardsPath);
const cards = JSON.parse(cardBytes);
const expectedPanels = new Map([
    ['rc2-system', ['research-roadmap', 'L30']],
    ['rc8-system', ['diffusion-map', 'L31']],
    ['rc10-system', ['rival-projects', 'L32']],
    ['rc13-system', ['variance-gauge', 'L33']],
    ['rc14-system', ['ruin-archive', 'L34']],
    ['rc15-system', ['research-advisor', 'L35']],
]);
const accepted = [], rejected = [], unexpected = [], completeness = [];
const ids = new Set(), coverage = {}, forms = {}, routes = new Set(), worldFits = new Set();
function requireDraft(condition, context) { if (!condition) completeness.push(context); }
requireDraft(Array.isArray(cards), 'cards.json must be an array');
if (!Array.isArray(cards)) throw new Error('cards.json must be an array');
for (const card of cards) {
    const s = card.state;
    requireDraft(!ids.has(card.id), `${card.id}: duplicate ID`); ids.add(card.id);
    coverage[s.rc] = (coverage[s.rc] || 0) + 1;
    forms[s.form] = (forms[s.form] || 0) + 1;
    requireDraft(s.status === 'draft-consideration' && s.implemented === false, `${card.id}: proposal status`);
    requireDraft(card.stages.length >= 3 && card.hooks.length && card.observers.length >= 2, `${card.id}: stages/hooks/observers`);
    requireDraft(s.consumer?.length && s.limits?.length && s.additionalOwners?.length, `${card.id}: consumer/limits/truth-owner`);
    requireDraft(s.worldFit?.length >= 2, `${card.id}: world fit`);
    for (const fit of s.worldFit || []) {
        worldFits.add(fit.world);
        requireDraft(fit.locator && fit.standing && fit.rarity && fit.fit === 'proposal', `${card.id}: incomplete world fit`);
    }
    requireDraft(card.sources.length && card.sources.every(x => ['shown', 'stated', 'inferred'].includes(x.label) && x.locator), `${card.id}: source labels/locators`);
    const stores = s.storeReads || [];
    requireDraft(stores.length === 4 && new Set(stores.map(x => x.store)).size === 4 &&
        ['IM2', 'IM3', 'IM5', 'IM6'].every(id => stores.some(x => x.store === id && typeof x.used === 'boolean' && (!x.used || x.reads))), `${card.id}: store read contract`);
    requireDraft(s.acquisition?.length && s.acquisition.every(x => /^AQ(?:[1-9]|1[0-4])$/.test(x.code) && x.condition), `${card.id}: AQ routes`);
    for (const a of s.acquisition || []) routes.add(a.code);
    requireDraft(s.sealed?.length && s.publication?.length && s.uiScope?.viewport === '1366x768 desktop/laptop', `${card.id}: sealed/publication/desktop scope`);
    if (expectedPanels.has(card.id)) {
        const [ui, decision] = expectedPanels.get(card.id);
        requireDraft(card.ui === ui && s.panelDecision === decision && s.validationExpectation === 'panel-decision', `${card.id}: preserved panel decision`);
    }
    const original = JSON.stringify(card);
    try {
        const checked = validateCheatCard(card);
        requireDraft(isDeepStrictEqual(checked, card), `${card.id}: validator changed data`);
        accepted.push(card);
        if (expectedPanels.has(card.id)) unexpected.push(`${card.id}: proposed panel now accepted; review PANELS.md against changed source`);
    } catch (error) {
        const panel = expectedPanels.get(card.id);
        const expected = !!panel && card.ui === panel[0] && error.message === 'Invalid cheat card ui: unknown panel.';
        rejected.push({id: card.id, ui: card.ui, decision: panel?.[1] ?? null, expected, error: error.message});
        if (!expected) unexpected.push(`${card.id}: ${error.message}`);
    }
    requireDraft(original === JSON.stringify(card), `${card.id}: validator mutated input`);
}
for (let n = 1; n <= 15; n++) {
    const rc = `RC${n}`, group = cards.filter(c => c.state.rc === rc);
    requireDraft(group.length >= 3 && new Set(group.map(c => c.state.form)).size >= 3, `${rc}: at least three distinct forms`);
    requireDraft(group.some(c => c.state.form === 'mood'), `${rc}: subtle form`);
}
requireDraft(Object.keys(coverage).length === 15, 'exact RC1-RC15 coverage');
requireDraft(cards.length === 60, 'this draft has 60 variants');
let state = defaultCheatState(), grantRoundtrips = 0, messages = 0;
for (const card of accepted) {
    const before = JSON.stringify(state);
    const next = grantCheat(state, card, {route: 'AQ14:test-fixture', at: {date: '2026-10-14', lane: 'T14', sequence: grantRoundtrips}});
    requireDraft(before === JSON.stringify(state), `${card.id}: grant mutated prior state`);
    state = validateCheatState(JSON.parse(JSON.stringify(next)));
    requireDraft(isDeepStrictEqual(state.held[card.id].card, card), `${card.id}: in-memory grant/JSON roundtrip lost data`);
    state = recordCheatMessage(state, card.id, `T14 fixture: ${card.id}, not a gameplay reveal.`, {sequence: grantRoundtrips});
    grantRoundtrips++; messages++;
}
const restored = validateCheatState(JSON.parse(JSON.stringify(state)));
requireDraft(isDeepStrictEqual(state, restored), 'combined in-memory state roundtrip');
const sourceAfter = sha(readFileSync(sourcePath));
requireDraft(sourceBefore === sourceAfter, 'validator source changed during this check');
const result = {
    lane: 'T14', label: 'scratch-source-only', validatorPath: sourcePath,
    validatorSHA256: sourceBefore, validatorUnchangedDuringCheck: sourceBefore === sourceAfter,
    cardsSHA256: sha(cardBytes), total: cards.length,
    validatorAccepted: accepted.length, validatorRejected: rejected.length,
    expectedPanelRejections: rejected.filter(x => x.expected).length,
    unexpectedValidatorResults: unexpected.length, completenessErrors: completeness.length,
    rcCoverage: coverage, forms, acquisitionCodes: [...routes].sort((a,b) => Number(a.slice(2))-Number(b.slice(2))),
    distinctWorldFitEntries: worldFits.size,
    inMemoryGrantJSONRoundtrips: grantRoundtrips, fixtureMessages: messages,
    combinedStateRoundtrip: isDeepStrictEqual(state, restored),
    rejected, unexpected, completeness,
    limits: 'No build, source edit, real save, native import, browser or gameplay execution. Expected panel rejections are unresolved proposal decisions, not passing cards.'
};
console.log(JSON.stringify(result, null, 2));
if (unexpected.length || completeness.length) process.exitCode = 1;
