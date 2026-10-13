import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentRegistry} from '../src/expansion_engine.js';
import {emptyPackState, validatePackState, enterPack, leavePack, actPack, cancelPack, advancePackSettlement, packSaveState, preparePackSave, validatePack} from '../src/content_packs.js';
import {decodeSaveFile, encodeSaveFile} from '../src/save_files.js';
import {DEFAULT_DRAFT, AUTHORED_PACK_ID, AUTHORED_WORK_ID, AUTHORED_GATHER_ID, AUTHORED_SITE_ID, AUTHORED_WORLD_ID, validateDraft, compileDraft,
    exportAuthoredFile, parseAuthoredFile, applyAuthoredState, resetAuthoredState, syncAuthoredRegistration} from '../src/authored_site.js';

const VERSION = 'v0.5.5.30';
const owners = () => ({registry: createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]}), locations: {Village: {}},
    definitions: new Map(), makeLocation: l => ({id: l.id, name: l.label})});
const reasons = fn => {try {fn();} catch(e) {return e.reasons || [e.message];} assert.fail('expected rejection');};
const nativeSave = content_packs => ({'game version': VERSION, 'current time': {year: 999, month: 4, day: 1, hour: 8, minute: 0},
    'current location': 'Village', character: {name: 'TEST FIXTURE R15 FA21', money: 0, xp: {total_xp: 0}, inventory: {}, equipment: {}},
    skills: {}, locations: {}, activities: {}, dialogues: {}, traders: {}, ...(content_packs ? {content_packs} : {})});

test('default draft is valid and compiles to the existing schema-1 pack adapter', () => {
    const d = compileDraft(DEFAULT_DRAFT);
    assert.equal(d.id, AUTHORED_PACK_ID); assert.deepEqual(d.activities.map(a => a.id), [AUTHORED_WORK_ID, AUTHORED_GATHER_ID]);
    assert.equal(d.activities[0].pay, DEFAULT_DRAFT.coinPay); assert.deepEqual(d.activities[0].requires, [{field: 'input', op: 'gte', value: 3}]);
    assert.deepEqual(validatePack(d).definition, d);
});

test('invalid drafts list every reason and unsupported properties are rejected', () => {
    const r = reasons(() => validateDraft({...DEFAULT_DRAFT, siteName: '  ', minutes: 0, coinPay: 9999, people: [], inputStart: 1.5}));
    assert(r.some(x => /Unsupported property "people"/.test(x))); assert(r.some(x => /Site name is required/.test(x)));
    assert(r.some(x => /Work time .* from 1 to 1440/.test(x))); assert(r.some(x => /Coin paid .* from 0 to 500/.test(x)));
    assert(r.some(x => /Starting material must be a whole number/.test(x)));
    assert.match(reasons(() => validateDraft({...DEFAULT_DRAFT, inputCost: 5, requiredInput: 2}))[0], /cannot exceed/);
    assert.match(reasons(() => validateDraft({...DEFAULT_DRAFT, outputName: 'reeds'}))[0], /different names/);
    assert.match(reasons(() => validateDraft({...DEFAULT_DRAFT, siteName: 'a\u0007b'}))[0], /control characters/);
    assert.match(reasons(() => validateDraft(null))[0], /named fields/);
    // Pay on immediate work is outside the adapter grammar.
    const pack = compileDraft(DEFAULT_DRAFT); pack.activities[0].duration = 0; assert.throws(() => validatePack(pack), /pay/);
});

test('export and import round trip; malformed, foreign and future files are rejected', () => {
    const edited = {...DEFAULT_DRAFT, siteName: 'Kiln Yard', minutes: 45};
    assert.deepEqual(parseAuthoredFile(exportAuthoredFile(edited)), edited);
    assert.match(reasons(() => parseAuthoredFile('{nope'))[0], /not valid JSON/);
    assert.match(reasons(() => parseAuthoredFile(JSON.stringify({format: 'other', version: 1, draft: edited})))[0], /not an authored site file/);
    assert.match(reasons(() => parseAuthoredFile(JSON.stringify({format: 'yairpg-authored-site', version: 2, draft: edited})))[0], /newer version \(2\)/);
    assert(reasons(() => parseAuthoredFile(JSON.stringify({format: 'yairpg-authored-site', version: 1, draft: {...edited, minutes: -1}}))).some(x => /Work time/.test(x)));
    assert.throws(() => exportAuthoredFile({...edited, siteName: ''}), /Site name/);
});

test('apply registers, edit re-registers with changed terms, reset removes and leaves base untouched', () => {
    const o = owners(), baseWorlds = [...o.registry.worlds.keys()];
    let state = applyAuthoredState(emptyPackState(), DEFAULT_DRAFT);
    syncAuthoredRegistration(state.authored.draft, o);
    assert(o.registry.worlds.has(AUTHORED_WORLD_ID)); assert(o.registry.actions.has(AUTHORED_WORK_ID)); assert(o.locations[AUTHORED_SITE_ID]);
    state = applyAuthoredState(state, {...DEFAULT_DRAFT, minutes: 90, siteName: 'Kiln Yard'});
    syncAuthoredRegistration(state.authored.draft, o);
    assert.equal(o.definitions.get(AUTHORED_PACK_ID).activities[0].duration, 90); assert.equal(o.locations[AUTHORED_SITE_ID].name, 'Kiln Yard');
    state = resetAuthoredState(state); syncAuthoredRegistration(state.authored?.draft ?? null, o);
    assert.equal(state.authored, undefined); assert.deepEqual([...o.registry.worlds.keys()], baseWorlds);
    assert(!o.registry.actions.has(AUTHORED_WORK_ID)); assert(!o.locations[AUTHORED_SITE_ID]); assert.equal(o.definitions.size, 0);
    assert.throws(() => resetAuthoredState(state), /No authored site/);
});

test('invalid apply and a registration collision leave state and registries unchanged', () => {
    const o = owners(), before = emptyPackState();
    assert.throws(() => applyAuthoredState(before, {...DEFAULT_DRAFT, minutes: 0}));
    assert.deepEqual(before, emptyPackState());
    const state = applyAuthoredState(before, DEFAULT_DRAFT); syncAuthoredRegistration(state.authored.draft, o);
    o.registry.actions.set(AUTHORED_GATHER_ID + '_x', {}); // unrelated
    o.locations[AUTHORED_SITE_ID + '_x'] = {};
    // A base location with the authored ID blocks a re-apply; the old registration is restored.
    const blocked = owners(); blocked.locations[AUTHORED_SITE_ID] = {base: true};
    assert.throws(() => syncAuthoredRegistration(DEFAULT_DRAFT, blocked), /conflicts/);
    assert.deepEqual(blocked.locations[AUTHORED_SITE_ID], {base: true}); assert(!blocked.registry.worlds.has(AUTHORED_WORLD_ID));
    const o2 = owners(); syncAuthoredRegistration(DEFAULT_DRAFT, o2); o2.registry.simulation.people.set('x', {});
    o2.registry.worlds.set('authored_site.world', o2.registry.worlds.get('authored_site.world'));
    assert.throws(() => syncAuthoredRegistration({...DEFAULT_DRAFT, minutes: 0}, o2)); assert.equal(o2.definitions.get(AUTHORED_PACK_ID).activities[0].duration, 30);
});

test('authored activity: eligibility, native pay exactly once, cancel refunds, edit changes eligibility', () => {
    const o = owners(); syncAuthoredRegistration(DEFAULT_DRAFT, o); const d = () => o.definitions.get(AUTHORED_PACK_ID);
    let state = enterPack(applyAuthoredState(emptyPackState(), DEFAULT_DRAFT), d());
    assert.deepEqual(state.packs[AUTHORED_PACK_ID].values, {input: 6, output: 0});
    state = actPack(state, d(), AUTHORED_WORK_ID); assert.equal(state.packs[AUTHORED_PACK_ID].values.input, 3);
    let r = advancePackSettlement(state, o.definitions, 29); assert.equal(r.pay, 0); assert.equal(r.state.packs[AUTHORED_PACK_ID].job.remaining, 1);
    r = advancePackSettlement(r.state, o.definitions, 5); assert.equal(r.pay, 8); assert.equal(r.settled.length, 1); assert.equal(r.state.packs[AUTHORED_PACK_ID].values.output, 1);
    assert.equal(advancePackSettlement(r.state, o.definitions, 500).pay, 0);
    state = actPack(r.state, d(), AUTHORED_WORK_ID); assert.equal(state.packs[AUTHORED_PACK_ID].values.input, 0);
    assert.throws(() => actPack(state, d(), AUTHORED_WORK_ID), /unavailable/);
    state = cancelPack(state, d()); assert.equal(state.packs[AUTHORED_PACK_ID].job, null); assert.equal(state.packs[AUTHORED_PACK_ID].values.input, 3);
    assert.equal(advancePackSettlement(state, o.definitions, 500).pay, 0);
    assert.throws(() => cancelPack(state, d()), /no running/);
    // Editing needs the visit ended; raising the requirement blocks the activity.
    assert.throws(() => applyAuthoredState(state, {...DEFAULT_DRAFT, requiredInput: 4}), /Return to the Village/);
    state = leavePack(state, AUTHORED_PACK_ID); state = applyAuthoredState(state, {...DEFAULT_DRAFT, requiredInput: 4});
    syncAuthoredRegistration(state.authored.draft, o); state = enterPack(state, d());
    assert.throws(() => actPack(state, d(), AUTHORED_WORK_ID), /unavailable/);
    state = actPack(state, d(), AUTHORED_GATHER_ID); state = advancePackSettlement(state, o.definitions, 20).state;
    assert.equal(state.packs[AUTHORED_PACK_ID].values.input, 5); state = actPack(state, d(), AUTHORED_WORK_ID);
    assert.equal(state.packs[AUTHORED_PACK_ID].values.input, 2);
});

test('applied authored content and progress survive save file encode/import and fresh registration', () => {
    const o = owners(); let state = applyAuthoredState(emptyPackState(), {...DEFAULT_DRAFT, siteName: 'Kiln Yard'});
    syncAuthoredRegistration(state.authored.draft, o); state = enterPack(state, o.definitions.get(AUTHORED_PACK_ID));
    state = actPack(state, o.definitions.get(AUTHORED_PACK_ID), AUTHORED_WORK_ID);
    const save = nativeSave(packSaveState(state, o.definitions)); save['current location'] = AUTHORED_SITE_ID;
    const imported = decodeSaveFile(encodeSaveFile(JSON.stringify(save)), VERSION);
    // A fresh page registers from the saved draft before preparing the save, as main.load does.
    const fresh = owners(); syncAuthoredRegistration(imported.content_packs.authored.draft, fresh);
    const prepared = preparePackSave(imported, fresh.definitions);
    assert.equal(prepared['current location'], AUTHORED_SITE_ID);
    assert.deepEqual(prepared.content_packs.packs[AUTHORED_PACK_ID], state.packs[AUTHORED_PACK_ID]);
    assert.equal(fresh.locations[AUTHORED_SITE_ID].name, 'Kiln Yard');
    assert.equal(advancePackSettlement(prepared.content_packs, fresh.definitions, 30).pay, 8);
    assert.throws(() => validatePackState({...emptyPackState(), authored: {schema: 2, draft: {}}}), /authored/);
});

test('old saves without authored content load unchanged and register nothing', () => {
    const old = nativeSave(null), withPacks = nativeSave(emptyPackState());
    assert.deepEqual(decodeSaveFile(encodeSaveFile(JSON.stringify(old)), VERSION), old);
    const o = owners(); assert.equal(syncAuthoredRegistration(withPacks.content_packs.authored?.draft ?? null, o), null);
    assert.equal(o.definitions.size, 0); assert.deepEqual(preparePackSave(old, o.definitions), old);
    assert.deepEqual(preparePackSave(decodeSaveFile(encodeSaveFile(JSON.stringify(withPacks)), VERSION), o.definitions).content_packs, {...emptyPackState(), registered: {}});
});
