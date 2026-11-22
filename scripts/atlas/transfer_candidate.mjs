#!/usr/bin/env node
// Atlas-to-game transfer chain: placement picks in, CANDIDATE cast pack plus diff out.
// Never writes private_packs/ or src/. Adopting a candidate is a separate step that needs Weibao's yes.
//
//   node scripts/atlas/transfer_candidate.mjs --world lotm --picks <picks.json> --out <dir>
//
// Chain: validate picks -> overlay to authored base rows -> build_cast_pack (--base, whole book)
//        -> topic talks, journeys and place acts passes -> keep-keys merge -> diff against the live pack.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const L = 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/';

// Places known to be wrong for a walk (atlas proposal F9, F13). Picks on them, or on anything inside them, are refused.
export const FLAGGED_PLACES = Object.freeze({
    'lotm.place.cast-6a6e1898afb60ad8415a': 'Sunia Sea: a sea, not a Tingen walk place (F9)',
    'lotm.place.west-bailang': 'West Bailang: a foreign region (F9)',
    'lotm.place.cast-c1bafe62c7769c219e82': 'Jinwutong District: reads like an untranslated name, chain unverified (F13)',
    'lotm.place.cast-d1c8e7f9965953436d13': 'East Bailang Dockyard: Bailang matches the foreign region, chain unverified (F13)',
});
// Keys the passes own. They are recompiled and reported always; adopted into the candidate only with --recompile-derived.
export const DERIVED_KEYS = Object.freeze(['topicTalks', 'journeys', 'householdActs']);
// Fields that move on every rebuild and are not a content change.
const NOISE_KEYS = new Set(['revision', 'revisionNote', 'buildSourceIdentity']);

const s = v => JSON.stringify(v);
const list = v => Array.isArray(v) ? v : [];

export function readPicks(raw) {
    const picks = Array.isArray(raw) ? raw : raw?.picks;
    if (!Array.isArray(picks)) throw new Error('picks file must be {"picks":[...]} or an array');
    return picks;
}

// Ancestor chain by parent links, cycle-safe.
function chainOf(id, byId) {
    const out = [], seen = new Set();
    for (let at = byId.get(id)?.parent; at && !seen.has(at); at = byId.get(at)?.parent) { seen.add(at); out.push(at); }
    return out;
}

// Returns {errors, flagged, picks}. errors: hard problems. flagged: picks on known-bad places (errors unless allowFlagged).
export function validatePicks(picks, pack, districts, {allowFlagged = false, flagged = FLAGGED_PLACES} = {}) {
    const errors = [], flaggedHits = [], byId = new Map(list(pack.places).map(r => [r.id, r]));
    const seen = new Set();
    picks.forEach((p, i) => {
        const tag = `pick ${i + 1}`;
        if (!p || typeof p.place !== 'string' || typeof p.district !== 'string') { errors.push(`${tag}: needs string place and district`); return; }
        if (!byId.has(p.place)) errors.push(`${tag}: unknown place ${p.place}`);
        if (!districts.includes(p.district)) errors.push(`${tag}: unknown district ${p.district} (game districts: ${districts.join(', ')})`);
        if (seen.has(p.place)) errors.push(`${tag}: place ${p.place} picked twice`);
        seen.add(p.place);
        if (byId.has(p.place)) {
            const hit = [p.place, ...chainOf(p.place, byId)].find(id => flagged[id]);
            if (hit) {
                const why = hit === p.place ? flagged[hit] : `inside flagged place (${flagged[hit]})`;
                flaggedHits.push({place: p.place, name: byId.get(p.place).name, why});
                if (!allowFlagged) errors.push(`${tag}: ${p.place} (${byId.get(p.place).name}) is flagged: ${why}. Pass --allow-flagged to override.`);
            }
        }
    });
    return {errors, flagged: flaggedHits};
}

// Overlay -> authored base rows. `built` is a pack that already has the full place rows (the live pack, or an
// earlier zero-pick rebuild). Copies placeAliases too, or the promoted row loses them (F11). Mutates and returns base.
export function applyPicksToBase(base, built, picks) {
    const byId = new Map(list(built.places).map(r => [r.id, r]));
    base.places ||= [];
    base.placeAliases ||= [];
    for (const {place, district} of picks) {
        const src = byId.get(place);
        if (!src) throw new Error('unknown place ' + place);
        const row = {...structuredClone(src), district, travel: {...(structuredClone(src.travel) || {minutes: 2, minutesProvenance: 'fill'}), district, provenance: 'authored', basis: 'Placed in the world atlas.'}};
        const i = base.places.findIndex(r => r.id === place);
        if (i >= 0) base.places[i] = row; else base.places.push(row);
        for (const a of list(built.placeAliases)) if (a.place === place && !base.placeAliases.some(b => s(b) === s(a))) base.placeAliases.push(a);
    }
    return base;
}

// Predicted changed places: the picks plus unplaced descendants that will inherit the district.
export function predictChanges(built, picks) {
    const kids = new Map();
    for (const r of list(built.places)) if (r.parent) (kids.get(r.parent) || kids.set(r.parent, []).get(r.parent)).push(r);
    const exp = new Set(picks.map(p => p.place));
    const walk = id => { for (const k of kids.get(id) || []) { if (k.travel?.district) continue; if (!['region', 'sub-place'].includes(k.kind)) exp.add(k.id); walk(k.id); } };
    for (const p of picks) walk(p.place);
    return [...exp].sort();
}

// Compiled output plus every live top-level key the compilers did not produce. Derived keys keep the live value
// unless recompileDerived. Returns {pack, carried (keys copied from live), lost (live keys still missing)}.
export function mergeKeepingKeys(live, compiled, {recompileDerived = false, derived = DERIVED_KEYS} = {}) {
    const pack = {...compiled}, carried = [];
    for (const k of Object.keys(live)) {
        if (!(k in pack)) { pack[k] = structuredClone(live[k]); carried.push(k); }
        else if (!recompileDerived && derived.includes(k)) pack[k] = structuredClone(live[k]);
    }
    const lost = Object.keys(live).filter(k => !(k in pack));
    return {pack, carried, lost};
}

// Row-level diff of an id-keyed array section.
function diffRows(a, b) {
    const A = new Map(list(a).map(r => [r.id, r])), B = new Map(list(b).map(r => [r.id, r]));
    const added = [], removed = [], changed = [], fields = {};
    for (const [id, r] of B) {
        if (!A.has(id)) { added.push(id); continue; }
        if (s(A.get(id)) === s(r)) continue;
        changed.push(id);
        const x = A.get(id);
        for (const k of new Set([...Object.keys(x), ...Object.keys(r)])) {
            if (s(x[k]) === s(r[k])) continue;
            if (k === 'travel' && x.travel && r.travel && typeof x.travel === 'object') {
                for (const t of new Set([...Object.keys(x.travel), ...Object.keys(r.travel)])) if (s(x.travel[t]) !== s(r.travel[t])) fields[`travel.${t}`] = (fields[`travel.${t}`] || 0) + 1;
            } else fields[k] = (fields[k] || 0) + 1;
        }
    }
    for (const id of A.keys()) if (!B.has(id)) removed.push(id);
    return {before: A.size, after: B.size, added, removed, changed, fields};
}

export function diffPacks(live, candidate) {
    const keys = {}, lostKeys = [], newKeys = [];
    for (const k of new Set([...Object.keys(live), ...Object.keys(candidate)])) {
        keys[k] = !(k in candidate) ? 'only-live' : !(k in live) ? 'only-candidate' : s(live[k]) === s(candidate[k]) ? 'same' : NOISE_KEYS.has(k) ? 'differs (rebuild noise)' : 'differs';
        if (!(k in candidate)) lostKeys.push(k);
        if (!(k in live)) newKeys.push(k);
    }
    const places = diffRows(live.places, candidate.places);
    const section = name => { const d = diffRows(live[name], candidate[name]); return {before: d.before, after: d.after, added: d.added.length, removed: d.removed.length, changed: d.changed.length}; };
    return {
        everyLiveKeyPresent: lostKeys.length === 0, lostKeys, newKeys, keys,
        places: {before: places.before, after: places.after, added: places.added, removed: places.removed, changed: places.changed, fieldCounts: places.fields},
        sections: {people: section('people'), placeAliases: section('placeAliases')},
    };
}

const readJsonl = p => fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(l => l.trim()).map(JSON.parse);

// Runs the three passes on a pack, seeded with the live householdActs so existing sequences survive.
async function runPasses(pack, liveActs, inputs) {
    const R = rel => import(pathToFileURL(path.join(ROOT, 'scripts/lead_run', rel)).href);
    const [{buildTopicTalks}, {buildJourneys}, {buildPlaceActs, readPlaceActAnnotations}, {shardIndex}] =
        await Promise.all([R('build_topic_talks.mjs'), R('build_journeys.mjs'), R('build_place_acts.mjs'), R('cite_paragraphs.mjs')]);
    const input = structuredClone(pack);
    delete input.topicTalks; delete input.journeys;
    if (liveActs) input.householdActs = structuredClone(liveActs);
    const {scenes, registry, crosswalk, sourceDir} = inputs, paragraphIndex = shardIndex(sourceDir);
    const talks = buildTopicTalks({scenes, crosswalk, registry, pack: input, paragraphIndex});
    const journeys = buildJourneys({scenes, crosswalk, registry, pack: input, paragraphIndex});
    const annotations = readPlaceActAnnotations(input);
    const acts = buildPlaceActs({scenes, crosswalk, registry, pack: input, annotations});
    return {topicTalks: {talks: talks.rows}, journeys: {journeys: journeys.rows}, householdActs: acts.data,
        rejected: {topicTalks: talks.rejected, journeys: journeys.rejected, acts: acts.rejected}};
}

function arg(argv, k, dflt) { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt; }

export async function main(argv) {
    const world = arg(argv, '--world');
    if (world !== 'lotm') throw new Error('--world lotm is the only world wired so far');
    const picksFile = arg(argv, '--picks');
    if (!picksFile) throw new Error('Missing --picks <picks.json>');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const out = path.resolve(ROOT, arg(argv, '--out', `work/atlas-transfer/${stamp}`));
    const rel = path.relative(ROOT, out);
    if (rel === 'src' || rel.startsWith('src/') || rel === 'private_packs' || rel.startsWith('private_packs/') || rel === '') throw new Error('Refusing to write into src/, private_packs/ or the repo root');
    const allowFlagged = argv.includes('--allow-flagged'), recompileDerived = argv.includes('--recompile-derived');
    const livePath = path.resolve(ROOT, arg(argv, '--live', 'private_packs/lotm-cast/cast.json'));
    const mergedDir = path.resolve(ROOT, arg(argv, '--merged', L + 'm4-whole-book-2026-10-29/merged'));
    const basePath = path.resolve(ROOT, arg(argv, '--base-pack', L + 'pack-backups/cast-r1r2-candidate-2026-10-29.json'));
    const sourceDir = path.resolve(ROOT, arg(argv, '--source-dir', L));
    const slice = {from: arg(argv, '--from', 'zh 第1章 p1'), to: arg(argv, '--to', 'zh b8 第99999章 p99999')};

    const live = JSON.parse(fs.readFileSync(livePath, 'utf8'));
    const picks = readPicks(JSON.parse(fs.readFileSync(path.resolve(picksFile), 'utf8')));
    const {LOTM_DISTRICTS} = await import(pathToFileURL(path.join(ROOT, 'src/book_world_lotm_districts.js')).href);
    const districts = LOTM_DISTRICTS.map(d => d.id);

    // 1. validate
    const v = validatePicks(picks, live, districts, {allowFlagged});
    if (v.errors.length) { console.error('Picks refused:\n  ' + v.errors.join('\n  ')); process.exitCode = 2; return null; }
    fs.mkdirSync(out, {recursive: true});

    // 2. overlay -> authored base rows (the live pack supplies the built rows; it equals a zero-pick rebuild)
    const base = applyPicksToBase(JSON.parse(fs.readFileSync(basePath, 'utf8')), live, picks);
    const predicted = predictChanges(live, picks);

    // 3. build_cast_pack with --base (in-process; the CLI refuses output outside private storage)
    const {buildCastPack} = await import(pathToFileURL(path.join(ROOT, 'scripts/lead_run/build_cast_pack.mjs')).href);
    const registry = readJsonl(path.join(mergedDir, 'registry.jsonl')), scenes = readJsonl(path.join(mergedDir, 'scenes.jsonl')), extras = readJsonl(path.join(mergedDir, 'extras.jsonl'));
    const crosswalk = JSON.parse(fs.readFileSync(path.join(mergedDir, 'crosswalk.json'), 'utf8'));
    console.error('building cast pack (about two minutes)...');
    const built = buildCastPack({book: 'lotm', slice, registry, scenes, extras, crosswalk, base, wholeBook: true});

    // 4. passes on the candidate, and on the live pack as the baseline, so the pick effect is separable from builder drift
    const inputs = {scenes, registry, crosswalk, sourceDir};
    const onCandidate = await runPasses(built.pack, live.householdActs, inputs);
    const onLive = await runPasses(live, live.householdActs, inputs);
    const passes = {};
    for (const k of DERIVED_KEYS) {
        const rowsOf = x => k === 'householdActs' ? list(x.acts) : list(x[k === 'topicTalks' ? 'talks' : 'journeys']);
        const d = diffRows(rowsOf(live[k] || {}), rowsOf(onCandidate[k]));
        const pickEffect = diffRows(rowsOf(onLive[k]), rowsOf(onCandidate[k]));
        passes[k] = {liveRows: d.before, recompiledRows: d.after, driftVsLive: {added: d.added.length, removed: d.removed.length, changed: d.changed.length},
            pickEffect: {added: pickEffect.added.length, removed: pickEffect.removed.length, changed: pickEffect.changed.length}, adoptedFrom: recompileDerived ? 'recompiled' : 'live'};
    }
    passes.rejected = onCandidate.rejected;

    // 5. merge back every live key the compilers do not produce
    const compiled = {...built.pack};
    for (const k of DERIVED_KEYS) compiled[k] = onCandidate[k];
    const merged = mergeKeepingKeys(live, compiled, {recompileDerived});

    // 6. diff
    const diff = diffPacks(live, merged.pack);
    const actual = diff.places.changed.slice().sort(), added = diff.places.added;
    const expectedSet = new Set(predicted);
    const prediction = {predicted: predicted.length, actualChanged: actual.length,
        missingFromActual: predicted.filter(id => !actual.includes(id)), unexpectedInActual: actual.filter(id => !expectedSet.has(id)),
        matches: predicted.length === actual.length && predicted.every(id => actual.includes(id))};
    const report = {schema: 'atlas-transfer-diff/1', world, picks, flaggedPicksAllowed: v.flagged, recompileDerived, carriedKeys: merged.carried, lostKeys: merged.lost,
        diff, prediction, passes};

    // 7. write
    const candPath = path.join(out, 'candidate-cast.json');
    fs.writeFileSync(candPath, JSON.stringify(merged.pack, null, 2) + '\n');
    fs.writeFileSync(path.join(out, 'diff.json'), JSON.stringify(report, null, 2) + '\n');
    fs.writeFileSync(path.join(out, 'README.txt'), [
        `Atlas transfer candidate (${world})`, '',
        `Picks: ${picks.length}${v.flagged.length ? ` (${v.flagged.length} on flagged places, allowed by --allow-flagged)` : ''}`,
        `Places: ${diff.places.before} live -> ${diff.places.after} candidate; added ${added.length}, removed ${diff.places.removed.length}, changed ${actual.length}`,
        `Every live top-level key present in candidate: ${diff.everyLiveKeyPresent}${merged.lost.length ? ' LOST: ' + merged.lost.join(', ') : ''}`,
        `Derived keys (${DERIVED_KEYS.join(', ')}): ${recompileDerived ? 'recompiled by the current builders' : 'kept from the live pack; recompiled output is only reported in diff.json'}`, '',
        'The live pack was NOT touched. To adopt this candidate, back up and copy it over the live pack:', '',
        `  cp ${path.relative(ROOT, livePath)} ${path.relative(ROOT, livePath)}.bak-before-atlas-transfer`,
        `  cp ${path.relative(ROOT, candPath)} ${path.relative(ROOT, livePath)}`, '',
        'Adoption needs Weibao\'s yes. Do not run the copy without it.', '',
        'Then rebuild and prove it in the browser (AD43 floor): load the pack, walk the changed places, save, reload, export and import.', ''].join('\n'));
    console.log(JSON.stringify({out, places: {added: added.length, removed: diff.places.removed.length, changed: actual.length}, lostKeys: merged.lost, carriedKeys: merged.carried, prediction: {predicted: prediction.predicted, actual: prediction.actualChanged, matches: prediction.matches}, passes: Object.fromEntries(DERIVED_KEYS.map(k => [k, passes[k].pickEffect]))}));
    return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main(process.argv.slice(2)).catch(e => { console.error(e.message); process.exitCode = 1; });
}
