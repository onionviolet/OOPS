import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {worldFamily, worldLook, applyWorldLook, WORLD_FLOURISH} from '../src/world_look.js';
import {reportVoice, VOICED_FAMILIES, VOICED_PLACES, VOICE_TEXTS, VOICE_PANELS} from '../src/world_report_voice.js';

test('world ids name their family; unlisted families fall back to no flourish (DSG12)', () => {
    assert.equal(worldFamily('book.lotm.tingen'), 'lotm');
    assert.equal(worldFamily('base.frontier'), 'frontier');
    assert.equal(worldFamily('book.mol.cyoria'), 'mol');
    assert.equal(worldFamily('hp.world'), 'hp');
    assert.equal(worldFamily('lotm.world'), 'lotm');
    assert.equal(worldFamily('pocket.folded_glasshouse'), 'folded_glasshouse');
    assert.equal(worldFamily(undefined), 'unknown');
    assert.deepEqual(worldLook('book.lotm.tingen'), {family: 'lotm', flourish: true, label: 'Tingen'});
    assert.deepEqual(worldLook('base.frontier'), {family: 'frontier', flourish: false, label: null});
});

test('the root hook writes family and flourish, and only when they change', () => {
    const writes = [], dataset = new Proxy({}, {set(t, k, v) { writes.push(k); t[k] = v; return true; }});
    const root = {dataset};
    applyWorldLook(root, 'book.lotm.tingen');
    assert.deepEqual({...dataset}, {worldFamily: 'lotm', worldFlourish: 'on'});
    applyWorldLook(root, 'book.lotm.tingen');
    assert.equal(writes.length, 2, 'a repeat tick writes nothing');
    applyWorldLook(root, 'base.frontier');
    assert.deepEqual({...dataset}, {worldFamily: 'frontier', worldFlourish: 'off'});
});

test('every flourished family has its token block, and the tokens stay in the token file (UR6)', () => {
    const tokens = readFileSync(new URL('../styles/ui_tokens.css', import.meta.url), 'utf8');
    for (const family of Object.keys(WORLD_FLOURISH)) assert.match(tokens, new RegExp(`:root\\[data-world-family="${family}"\\][^{]*\\{[^}]*--world-accent`));
    const rules = readFileSync(new URL('../styles/world_look.css', import.meta.url), 'utf8');
    assert.doesNotMatch(rules, /#[0-9a-f]{3,6}\b|rgb\(/i);
});

test('voices go place row first, then the world row, then the generic line (DSG13)', () => {
    const office = reportVoice({worldId: 'book.lotm.tingen', kind: 'message_travel', text: '[ Entering Tingen supervised workroom ]'});
    assert.match(office.useful, /Tingen workroom panel/);
    const street = reportVoice({worldId: 'book.lotm.tingen', kind: 'message_travel', text: '[ Entering Some Tingen street ]'});
    assert.ok(street.flavour && street.useful, 'unlisted places get the world row');
    assert.deepEqual(reportVoice({worldId: 'book.lotm.tingen', kind: 'message_travel', text: '[ Entering Some Tingen street ]'}), street, 'same place, same words (RPT12)');
    const opened = reportVoice({worldId: 'base.frontier', kind: 'location_unlocked', text: 'Unlocked location "Forest road"'});
    assert.match(opened.useful, /Move somewhere else/, 'a newly opened place learns the route, not the place row');
    assert.equal(reportVoice({worldId: 'base.frontier', kind: 'location_unlocked', text: 'You have learned a new stance: "Guard"'}), null);
    assert.equal(reportVoice({worldId: 'pocket.folded_glasshouse', kind: 'message_travel', text: '[ Entering Elsewhere ]'}), null, 'a world without a general row stays generic');
    assert.equal(reportVoice({worldId: 'feature.other', kind: 'message_travel', text: '[ Entering Tidemark landing ]'}), null, 'generic families never voice a world they were not written for');
    assert.equal(reportVoice({worldId: 'book.lotm.tingen', kind: 'notification', text: 'Notebook is now available in navigation.'}), null);
    assert.equal(reportVoice({worldId: 'book.lotm.tingen', kind: 'message_travel', text: 'not an arrival'}), null);
    assert.equal(reportVoice({family: 'lotm', kind: 'message_travel', text: '[ Entering Tingen docks ]'}).flavour.length > 0, true, 'family alone still finds a world');
    assert.deepEqual(VOICED_FAMILIES, ['frontier', 'lotm', 'mol', 'paradise', 'nested', 'proto23', 'tidemark', 'glasshouse', 'hp']);
});

test('every voiced place is a real place name in its world (no silent fallback after a rename)', async () => {
    const src = f => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
    const names = new Set();
    for (const m of src('data/locations.js').matchAll(/^\s*name: "([^"]+)"/gm)) names.add(m[1]);
    const {LOTM_LOCATIONS} = await import('../src/book_world_lotm_ids.js');
    const {MOL_LOCATIONS} = await import('../src/book_world_mol_ids.js');
    const {PARADISE_LOCATIONS} = await import('../src/book_world_paradise_ids.js');
    const {PROTO23_LOCATIONS} = await import('../src/proto23_world_ids.js');
    const {TIDEMARK_LOCATIONS} = await import('../src/feature_expansion_destination.js');
    const {NESTED_LOCATIONS} = await import('../src/feature_expansion_nested_content.js');
    const {hpSchoolLife} = await import('../src/world_packs/book_hp_life_data.js');
    for (const table of [LOTM_LOCATIONS, MOL_LOCATIONS, PARADISE_LOCATIONS, PROTO23_LOCATIONS, TIDEMARK_LOCATIONS, NESTED_LOCATIONS]) for (const n of Object.values(table)) names.add(n);
    names.add(/POCKET_LOCATION = '([^']+)'/.exec(src('data/pocket_location.js'))[1]);
    for (const l of hpSchoolLife.locations) names.add(l.label);
    for (const [world, places] of Object.entries(VOICED_PLACES)) for (const place of places) assert.ok(names.has(place), `${world}: "${place}" is not a real place`);
});

test('general lines vary by time of day and day, and repeat for the same moment (RPT12)', () => {
    const at = (band, day) => reportVoice({worldId: 'base.frontier', kind: 'message_travel', text: '[ Entering Wild willow stand ]', band, day}).flavour;
    assert.equal(at('night', 'Y999-4-1'), at('night', 'Y999-4-1'));
    const days = new Set(Array.from({length: 12}, (_, d) => at('day', `999-4-${d + 1}`)));
    assert.ok(days.size > 1, 'different days read differently');
    const nights = new Set(Array.from({length: 12}, (_, d) => at('night', `999-4-${d + 1}`)));
    assert.ok([...nights].every(line => !days.has(line)), 'night draws its own pool');
});

test('titles speak in every voiced world; frontier unlocks say where the new thing is used', () => {
    for (const worldId of ['base.frontier', 'book.lotm.tingen', 'book.mol.cyoria', 'pocket.folded_glasshouse']) {
        const v = reportVoice({worldId, kind: 'level_up', text: 'Title earned: Wanderer. Walked a long way.'});
        assert.match(v.useful, /Naming and achievements/, worldId);
    }
    assert.equal(reportVoice({worldId: 'base.frontier', kind: 'level_up', text: 'Reached level 3'}), null, 'level-ups that are not titles stay generic');
    const act = reportVoice({worldId: 'base.frontier', kind: 'activity_unlocked', text: 'The elder shows you:\nUnlocked activity "Woodcutting" in location "Village"'});
    assert.equal(act.useful, 'Woodcutting is in Local actions while you are at Village.');
    assert.match(reportVoice({worldId: 'base.frontier', kind: 'activity_unlocked', text: 'Unlocked action "Spar" with "village elder"'}).useful, /Talk to someone/);
    assert.equal(reportVoice({worldId: 'book.mol.cyoria', kind: 'activity_unlocked', text: 'Unlocked activity "X" in location "Y"'}), null);
});

test('RPT13: every world with a places table has a voice for at least one of its places', () => {
    // A new `*_LOCATIONS` table makes a world enterable; it ships with its voice rows in the same change.
    const dir = new URL('../src/', import.meta.url), voiced = new Set(Object.values(VOICED_PLACES).flat());
    for (const file of readdirSync(dir).filter(f => f.endsWith('.js'))) {
        const text = readFileSync(new URL(file, dir), 'utf8');
        for (const m of text.matchAll(/export const ([A-Z0-9_]+_LOCATIONS) ?= ?Object\.freeze\(\{([^}]*)\}/g)) {
            const names = [...m[2].matchAll(/:\s*'([^']+)'/g)].map(x => x[1]);
            assert.ok(names.some(n => voiced.has(n)), `${file} ${m[1]}: add a place or world row in src/world_report_voice.js (RPT13)`);
        }
    }
});

test('voice text carries no canon labels, ids or developer words (RPT7, RPT11)', () => {
    const ids = {frontier: 'base.frontier', lotm: 'book.lotm.tingen', mol: 'book.mol.cyoria', paradise: 'book.paradise.goa', nested: 'nested.archive',
        proto23: 'reference.proto23.village', tidemark: 'feature.tidemark', glasshouse: 'pocket.folded_glasshouse', hp: 'book.hp.school.world'};
    assert.deepEqual(Object.keys(ids), Object.keys(VOICE_TEXTS));
    for (const [world, lines] of Object.entries(VOICE_TEXTS)) for (const line of lines)
        assert.doesNotMatch(line, /\bbook\.|canon|chapter|the book|proposal|\bid\b|sealed|fire|will /i, `${world}: ${line}`);
});

test('a voiced useful line opens the panel it names, and every panel id is a registered module', () => {
    // Registered modules only: layout_spec surfaces also list proposals that never mount. Here (local-actions)
    // is a center mode that expandWorkspaceModule opens itself.
    const dir = new URL('../src/', import.meta.url), modules = new Set();
    for (const file of readdirSync(dir, {recursive: true}).filter(f => f.endsWith('.js')))
        for (const m of readFileSync(new URL(file, dir), 'utf8').matchAll(/(?:definePanel|registerWorkspaceModule)\(\{ ?id: ?'([^']+)'/g)) modules.add(m[1]);
    assert.match(readFileSync(new URL('workspace_layout.js', dir), 'utf8'), /if\(id==='local-actions'\)\{centerModes\(\)\.showHere\(\)/);
    modules.add('local-actions');
    const titles = [reportVoice({worldId: 'base.frontier', kind: 'level_up', text: 'Title earned: Wanderer.'}),
        reportVoice({worldId: 'base.frontier', kind: 'activity_unlocked', text: 'Unlocked activity "Woodcutting" in location "Village"'})];
    const rows = [...VOICE_PANELS, ...titles.map(v => ({world: 'shared', useful: v.useful, panel: v.panel}))];
    for (const {world, useful, panel} of rows) {
        if (panel) assert.ok(modules.has(panel), `${world}: "${panel}" is not a registered workspace module`);
        // A line that names an openable panel carries its id, so a new row cannot silently lose its link.
        if (/Notebook|Local actions|Actions list|Places and walks|Tingen workroom|Naming and achievements|Your beginning|Move somewhere else/.test(useful))
            assert.ok(panel, `${world}: "${useful}" names a panel but has no panel id`);
    }
    assert.equal(reportVoice({worldId: 'book.lotm.tingen', kind: 'message_travel', text: '[ Entering Tingen supervised workroom ]'}).panel, 'lotm');
    assert.equal(reportVoice({worldId: 'book.lotm.tingen', kind: 'message_travel', text: '[ Entering Some Tingen street ]'}).panel, 'lotm', 'world rows carry the panel too');
    assert.equal(reportVoice({worldId: 'base.frontier', kind: 'message_travel', text: '[ Entering Forest road ]'}).panel, undefined, 'Combat only exists during a fight, so that line stays plain');
});
