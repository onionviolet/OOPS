// What the batch readers found, per world, deduplicated: census entities (items, creatures, groups, gods,
// documents, prices...), rules (crafts, potions, rites, spells, abilities, laws), and texture rows (services,
// customs, news). One canonical file per shard and pass, the same choice the library uses (merged `m_` census
// and scenes; plain then Luna prefix), so re-reads, m13 passes and A/B runs never count twice.
// Ids, labels and locators plus bounded reader summaries. Raw source, census notes and scene knowledge prose stay out.
//   node prototypes/world-atlas/reader-findings.mjs [--out-dir work/atlas-snapshot/readers]
// Prints the coverage matrix as JSON; with --out-dir also writes one digest per world.
import {existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {bookShards} from '../../scripts/lead_run/make_book_plans.mjs';
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
import {chosenFile, readerDirectory, REGISTRY} from './library-reading.mjs';
import {mergePersonReaderDetails} from './people-details.mjs';
import {coverageFor} from './mechanics.mjs';
import {lifeIdentity, mergeLifeSources, projectLifeRow, publicLifeRow} from './texture-life.mjs';
import {createHash} from 'node:crypto';
import {mergePlaceDetails} from './place-details.mjs';
import {mergeCensusDetails} from './census-details.mjs';
import {proposalSafety, projectReaderFill, projectReaderNote, mergeReaderFill} from './reader-proposals.mjs';
import {legacyReaderSlices,orphanReaderSlices} from './reader-slices.mjs';
import {selectCollectedOutput} from './batch-output-index.mjs';
import {acquisitionDetails, appendEvidence, resetDetails, sourceEvidence} from './rule-details.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
// Matrix columns: what a reader row is about. `census` kinds map to columns; rule kinds split making from the rest.
export const COLUMNS = [
    {id: 'people', label: 'People', census: ['person']},
    {id: 'places', label: 'Places', census: ['place']},
    {id: 'items', label: 'Items and materials', census: ['item']},
    {id: 'creatures', label: 'Creatures', census: ['creature']},
    {id: 'groups', label: 'Groups and gods', census: ['organization', 'org', 'deity']},
    {id: 'documents', label: 'Documents and languages', census: ['document', 'language']},
    {id: 'money', label: 'Prices and measures', census: ['price', 'measure']},
    {id: 'time', label: 'Clocks, calendars, events', census: ['clock', 'calendar', 'event']},
    {id: 'making', label: 'Making (craft, potion, rite, spell)', rules: ['craft', 'potion', 'rite', 'spell']},
    {id: 'abilities', label: 'Abilities', rules: ['ability']},
    {id: 'order', label: 'Laws, customs, institutions', rules: ['law', 'custom', 'institution', 'other', 'reset']},
    {id: 'life', label: 'Services, customs, news', texture: ['services', 'customs', 'news']},
    {id: 'ties', label: 'People pass (routines, ties, knowledge)', people: true},
    {id: 'notes', label: '"Other" rows', other: true},
    {id: 'fills', label: 'Fills (authored proposals)', fills: true},
    {id: 'scenes', label: 'Scenes', scenes: true},
];
export const MAKING_KINDS = ['craft', 'potion', 'rite', 'spell'];
const isPower = r => r.kind === 'ability' || r.kind === 'spell';
const CENSUS_KIND = new Map(COLUMNS.flatMap(c => (c.census || []).map(k => [k, c.id])));
const RULE_KIND = new Map(COLUMNS.flatMap(c => (c.rules || []).map(k => [k, c.id])));
const SCENE_LINK_KINDS = new Set(['item', 'creature']);

const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const arr = x => Array.isArray(x) ? x : x ? [x] : [];
const short = (s, n = 160) => {s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s;};
const stated = (s, n) => typeof s === 'string' && s.trim() && !/^(?:unstated|not stated|not mentioned|none stated)$/i.test(s.trim()) ? short(s, n) : null;
const priceAmount = a => publicLifeRow(a) && Number.isFinite(a.value) ? {value: a.value, unit: stated(a.unit, 30), per: stated(a.per, 40), ...(Number.isFinite(a.cap)?{cap:a.cap}:{})} : null;
const openRows = values => arr(values).filter(publicLifeRow);
const sourceLocator = value => parseLocator(value) ? value.trim() : null;

function sceneSummary(scene, withheld) {
    const terms = values => arr(values).map(v => stated(v, 140)).filter(v => v &&
        !(v.match(/[\w-]+(?:\.[\w-]+)+/g) || []).some(id => withheld.has(id)));
    const actions = openRows(scene.steps).filter(row => stated(row.verb)).map(row => ({text: stated(row.verb, 120), actor: withheld.has(row.actor) ? null : stated(row.actor),
        label: row.label || null, locator: sourceLocator(row.locator), minutes: publicLifeRow(row.time) && Number.isFinite(row.time.minutes) ? row.time.minutes : null,
        kind: stated(row.kind, 32), habit: stated(row.habit, 32), class: stated(row.class, 48),
        means: Object.fromEntries(['requires','inputs','using','target','outputs','gains','results','witnesses']
            .map(key => [key, terms(row[key])]).filter(([, values]) => values.length))}));
    const choices = openRows(scene.choices).filter(c => stated(c.taken)).map(c => ({text: stated(c.taken, 120),
        alternatives: arr(c.options).map(text => stated(text, 100)).filter(Boolean), label: c.label || null, locator: sourceLocator(c.locator)}));
    const options = openRows(scene.options).filter(o => stated(o.action)).map(o => ({text: stated(o.action, 120),
        needs: arr(o.needs).map(text => stated(text, 100)).filter(Boolean), taken: typeof o.taken === 'boolean' ? o.taken : null,
        label: o.label || null, locator: sourceLocator(o.locator)}));
    const outcomes = openRows(scene.outcomes).filter(row => stated(row.fact)).map(row => ({fact: stated(row.fact, 100), value: typeof row.value === 'boolean' || Number.isFinite(row.value) ? String(row.value) : stated(row.value, 120),
        kind: stated(row.class, 30)}));
    const related = openRows(scene.deps).filter(row => stated(row.id) && (row.kind === 'after' || row.kind === 'needs'))
        .map(row => ({id: row.id, kind: row.kind}));
    const date = publicLifeRow(scene.date) && stated(scene.date?.value) ? {text: stated(scene.date.value, 80), label: scene.date.label || null} : null;
    const anchors = openRows(scene.anchors).filter(row => Number.isFinite(row.value) && terms(row.fact).length)
        .map(row => ({fact: stated(row.fact, 100), value: row.value, unit: stated(row.unit, 40),
            scope: stated(row.scope, 40), approx: row.approx === true, locator: sourceLocator(row.locator)}));
    if (date || actions.length || choices.length || options.length || outcomes.length || related.length || anchors.length) {
        return {date, actions, choices, options, outcomes, related, anchors};
    }
    return null;
}
// An input or product names a census id ("lotm.item.silver-sheet") or plain words ("silver hunter bullet").
export function itemRef(world, v) {
    const raw = typeof v === 'string' ? v : v?.item ?? v?.id ?? v?.what ?? '';
    if (/^[a-z0-9]+\.[a-z-]+\.[\w-]+$/i.test(raw)) return {id: raw, label: null};
    return {id: `${world}.item~${slug(raw)}`, label: short(raw, 80)};
}
// Some census rows put the evidence letter (S shown, T told, I inferred) in `label`; that is not a name.
const realLabel = l => l && !/^[STIP]$/.test(String(l).trim()) ? l : null;
const identified = row => typeof row?.id === 'string' && row.id.trim().length > 0;
const labelFromId = id => id.split(/[.~]/).at(-1).replace(/-/g, ' ').replace(/^./, c => c.toUpperCase());

// Pure fold over rows already read, so a test can check deduplication without files.
// input: {world, shards: [{prefix, census: [], rules: [], texture: {services: [], customs: [], news: []}, scenes: []}]}
export function digestWorld({world, shards, makingFill = []}) {
    const withheld = new Set(shards.flatMap(s => [...s.census || [], ...s.rules || [], ...s.people || [], ...s.scenes || [], ...s.places || []]
        .filter(r => !publicLifeRow(r)).map(r => r.id || r.beat)));
    const entities = new Map(), rules = new Map(), life = [], people = new Map(), places = new Map(), notes = [], fills = new Map();
    const sceneRows = new Map(), sealedBeats = new Set();
    const sealedRules = new Set(), sealedGroups = new Set(), powerIds = new Set();
    const creatureIds = new Set(), personIds = new Set(), itemIds = new Set(), groupIds = new Set(), profileFacts = new Map(), creatureSightings = new Map();
    for (const s of shards) {
        for (const r of s.census || []) if (identified(r)) {
            const kind = CENSUS_KIND.get(r.kind);
            if (kind === 'groups') (!publicLifeRow(r) ? sealedGroups : groupIds).add(r.id);
            if (!publicLifeRow(r) || withheld.has(r.id)) continue;
            if (kind === 'people') personIds.add(r.id);
            if (kind === 'creatures') creatureIds.add(r.id);
            if (kind === 'items') itemIds.add(r.id);
        }
        for (const r of s.people || []) if (identified(r) && publicLifeRow(r) && !withheld.has(r.id)) personIds.add(r.id);
        for (const r of s.rules || []) if (identified(r)) {
            if (!publicLifeRow(r) || withheld.has(r.id)) sealedRules.add(r.id);
            if (isPower(r) && !withheld.has(r.id)) powerIds.add(r.id);
            if (r.kind === 'institution' && publicLifeRow(r) && !withheld.has(r.id)) groupIds.add(r.id);
        }
    }
    for (const id of sealedGroups) groupIds.delete(id);
    const noteSeen = new Map();
    const proposalGuard = proposalSafety(shards);
    const counts = Object.fromEntries(COLUMNS.map(c => [c.id, {rows: 0, distinct: 0}]));
    const lifeSeen = new Map();
    const hiddenPeople = new Set(shards.flatMap(s => [...(s.people || []), ...(s.census || []).filter(r => r.kind === 'person')]).filter(r => !publicLifeRow(r)).map(r => r.id));
    for (const s of shards) {
        for (const r of s.census || []) {
            const col = CENSUS_KIND.get(r.kind);
            if (!col || !identified(r) || withheld.has(r.id) || !publicLifeRow(r) || (col === 'groups' && sealedGroups.has(r.id))) continue;
            counts[col].rows++;
            if (col === 'creatures') for (const w of openRows(r.whereabouts)) {
                if (typeof w?.place !== 'string' || !w.place || withheld.has(w.place) || /^unstated$/i.test(w.place)) continue;
                const sightings = creatureSightings.get(r.id) ?? [];
                if (!sightings.some(x => x.place === w.place && x.status === w.status)) {
                    sightings.push({place: w.place, status: w.status || null, locator: parseLocator(w.locator) ? w.locator : null});
                    creatureSightings.set(r.id, sightings);
                }
            }
            const e = entities.get(r.id);
            if (e) {
                if (!e.shards.includes(s.prefix)) e.shards.push(s.prefix);
                if (e.fallback && realLabel(r.label)) {e.label = short(r.label, 80); e.fallback = false;}
                if (r.touchedByLead) e.lead = true;
                if (r.kind === 'price') e.amount ||= priceAmount(r.amount);
                for (const w of r.whereabouts || []) if (w.place && !withheld.has(w.place) && publicLifeRow(w) && !e.places.includes(w.place)) e.places.push(w.place);
                for(const alias of arr(r.aliases).map(a=>stated(a,60)).filter(Boolean)) if(!e.aliases.includes(alias))e.aliases.push(alias);
            } else entities.set(r.id, {id: r.id, label: short(realLabel(r.label) || labelFromId(r.id), 80), fallback: !realLabel(r.label), kind: r.kind, col, first: r.firstMention || null, lead: !!r.touchedByLead,
                aliases: arr(r.aliases).map(a=>stated(a,60)).filter(Boolean), places: [...new Set(arr(r.whereabouts).filter(w=>publicLifeRow(w)&&!withheld.has(w.place)).map(w => w.place).filter(Boolean))],
                ...(r.kind === 'price' ? {amount: priceAmount(r.amount)} : {}), shards: [s.prefix]});
            const entity=entities.get(r.id);Object.assign(entity,mergeCensusDetails(entity,r,withheld));
        }
        for (const r of s.rules || []) {
            const col = RULE_KIND.get(r.kind) || 'order';
            if (!identified(r) || sealedRules.has(r.id) || withheld.has(r.id)) continue;
            counts[col].rows++;
            const refs = list => openRows(list).flatMap(value => {
                const ref = itemRef(world, value);
                if (withheld.has(ref.id) || ref.id.endsWith('~')) return [];
                return [{...ref, qty:value?.qty ?? null, unit:value?.unit ? short(value.unit,20) : null,
                    role:value?.role || null, sources:sourceEvidence(value)}];
            });
            const creatures = arr(r.who).filter(id => creatureIds.has(id));
            const persons = arr(r.who).filter(id => personIds.has(id));
            const groups = [...new Set([...arr(r.who), publicLifeRow(r.enforcement) ? r.enforcement?.enforcer : null,
                ...arr(r.consequences).filter(c => publicLifeRow(c)).map(c => c?.by)])]
                .filter(id => groupIds.has(id) && !sealedRules.has(id));
            const statements = list => arr(list).filter(s => s?.what && publicLifeRow(s)).map(s => ({
                what: short(s.what, 140), when: s.when || null, label: s.label || null, locator: s.locator || null,
                minutes: Number.isFinite(s.minutes) ? s.minutes : null,
            }));
            const procedure = statements(r.steps), results = statements(r.results), conditions = arr(r.conditions).map(x => stated(x, 100)).filter(Boolean);
            const limits = arr(r.limits).map(x => stated(x, 120)).filter(Boolean);
            const enforcement = r.enforcement && publicLifeRow(r.enforcement) && !sealedGroups.has(r.enforcement.enforcer) && !sealedRules.has(r.enforcement.enforcer) ? Object.fromEntries(
                ['penalty', 'enforcer', 'detection', 'label', 'locator'].map(k => [k, stated(r.enforcement[k], 120)]).filter(([, value]) => value)) : null;
            const enforcementRows = enforcement && Object.keys(enforcement).length ? [enforcement] : [];
            const consequences = arr(r.consequences).filter(c => publicLifeRow(c) && !sealedGroups.has(c.by) && !sealedRules.has(c.by) && (c.trigger || c.response)).map(c => ({
                trigger: stated(c.trigger, 120), response: stated(c.response, 140), by: stated(c.by), label: c.label || null, locator: c.locator || null,
            }));
            const costs = arr(r.costs).filter(c => publicLifeRow(c) && c.amount != null).map(c => ({
                amount: c.amount, unit: short(c.unit, 20), what: stated(c.what, 80), label: c.label || null, locator: c.locator || null,
            }));
            const acquire = r.acquire?.private === true || r.acquire?.scope === 'private' ? null : acquisitionDetails(r.acquire), resets = resetDetails(r.reset);
            if (acquire && (withheld.has(acquire.teacher) || hiddenPeople.has(acquire.teacher))) delete acquire.teacher;
            const sources = sourceEvidence(r);
            const prev = rules.get(r.id);
            if (prev) {
                appendEvidence(prev, sources);
                prev.label ||= sources[0]?.label || null;
                if (!prev.shards.includes(s.prefix)) prev.shards.push(s.prefix);
                for (const [k, list] of [['inputs', refs(r.inputs)], ['products', refs(r.products)]]) for (const x of list) {
                    const existing = prev[k].find(y => y.id === x.id);
                    if (existing) appendEvidence(existing, x.sources); else prev[k].push(x);
                }
                for (const id of creatures) if (!prev.creatures.includes(id)) prev.creatures.push(id);
                for (const id of persons) if (!prev.people.includes(id)) prev.people.push(id);
                for (const id of groups) if (!prev.groups.includes(id)) prev.groups.push(id);
                for (const [key, rows] of [['procedure', procedure], ['results', results], ['consequences', consequences], ['enforcement', enforcementRows]]) for (const row of rows) {
                    if (!prev[key].some(x => JSON.stringify(x) === JSON.stringify(row))) prev[key].push(row);
                }
                for (const value of conditions) if (!prev.conditions.includes(value)) prev.conditions.push(value);
                for (const value of limits) if (!prev.limits.includes(value)) prev.limits.push(value);
                for (const cost of costs) if (!prev.costs.some(c => c.amount === cost.amount && c.unit === cost.unit && c.what === cost.what && c.locator === cost.locator)) prev.costs.push(cost);
                if (acquire && Object.keys(acquire).length && !prev.acquisition.some(row => JSON.stringify(row) === JSON.stringify(acquire))) prev.acquisition.push(acquire);
                for (const reset of resets) if (!prev.resets.some(row => JSON.stringify(row) === JSON.stringify(reset))) prev.resets.push(reset);
                prev.place ||= stated(r.place);
                if (!prev.costStated || prev.costStated === 'not-mentioned') prev.costStated = r.costStated || prev.costStated;
                continue;
            }
            rules.set(r.id, {id: r.id, name: short(realLabel(r.name) || labelFromId(r.id), 80), kind: r.kind || 'other', col, worldKind: r.worldKind ? short(r.worldKind, 40) : null,
                label: sources[0]?.label || null, sources, inputs: refs(r.inputs), products: refs(r.products),
                costs, costStated: r.costStated || null,
                minutes: r.minutes ?? null, ritual: !!r.ritual?.needed, steps: arr(r.steps).length, who: arr(r.who).length,
                creatures: [...new Set(creatures)], people: [...new Set(persons)], groups, locator: r.locator || null, shards: [s.prefix],
                procedure, results, conditions, limits, acquisition: acquire && Object.keys(acquire).length ? [acquire] : [], place: stated(r.place),
                enforcement: enforcementRows, consequences, resets});
        }
        for (const [key, rows] of Object.entries(s.texture || {})) for (const r of rows) {
            const row = projectLifeRow(key, r, s.prefix);
            if (!row) continue;
            counts.life.rows++;
            const k = lifeIdentity(row), existing = lifeSeen.get(k);
            if (existing) {mergeLifeSources(existing, row); continue;}
            lifeSeen.set(k, row);
            life.push(row);
        }
        // People pass: routines, ties and what each person knows, folded per person id.
        for (const r of s.people || []) {
            if (!identified(r) || !publicLifeRow(r) || withheld.has(r.id) || hiddenPeople.has(r.id)) continue;
            counts.ties.rows++;
            counts.people.rows++;
            const p = people.get(r.id) || people.set(r.id, {routine: [], relations: new Map(), knows: 0, first: r.locator || null, shards: []}).get(r.id);
            if (!p.shards.includes(s.prefix)) p.shards.push(s.prefix);
            mergePersonReaderDetails(p, r, {blockedIds: new Set([...hiddenPeople, ...sealedGroups, ...sealedRules])});
            for (const x of arr(r.routine)) {
                if (!publicLifeRow(x)) continue;
                const slot = {what: stated(x.what, 100), place: stated(x.place), days: stated(x.days, 30), from: stated(x.from, 30), to: stated(x.to, 30), recurrence: stated(x.recurrence, 20), ...(stated(x.until, 80) ? {until: stated(x.until, 80)} : {})};
                if ((slot.what || slot.place) && !p.routine.some(y => Object.keys(slot).every(k => slot[k] === y[k]) && y.label === (x.label || null) && y.locator === (x.locator || null))) {
                    p.routine.push({...slot, label: x.label || null, locator: x.locator || null});
                }
            }
            for (const x of arr(r.relations)) if (x.with && publicLifeRow(x) && !hiddenPeople.has(x.with) && !sealedGroups.has(x.with) && !sealedRules.has(x.with)) {
                const tie = {with: x.with, kind: stated(x.kind, 60), attitude: stated(x.attitude, 30), since: stated(x.since, 60), ...(stated(x.basis, 160) ? {basis: stated(x.basis, 160)} : {})};
                const key = JSON.stringify({...tie, label: x.label || null, locator: x.locator || null});
                if (!p.relations.has(key)) p.relations.set(key, {...tie, label: x.label || null, locator: x.locator || null});
            }
            p.knows += arr(r.knows).length;
        }
        // Places pass: what a place lets you do, its hours and access.
        for (const r of s.places || []) {
            if (!identified(r) || withheld.has(r.id) || !publicLifeRow(r)) continue;
            counts.places.rows++;
            const p = places.get(r.id) || places.set(r.id, {affordances: [], hours: null, hourRecords: [], access: [], within: null, placeLocator: null, placeShards: []}).get(r.id);
            Object.assign(p, mergePlaceDetails(p, r, withheld));
            if (!p.placeShards.includes(s.prefix)) p.placeShards.push(s.prefix);
            if (!withheld.has(r.within)) p.within ||= stated(r.within);
            p.placeLocator ||= r.locator || null;
            const hours = stated(r.hours, 80);
            if (hours && !p.hourRecords.some(h => h.hours === hours)) p.hourRecords.push({hours, label: r.label || null, locator: r.locator || null});
            p.hours ||= hours;
            for (const a of arr(r.access)) if (a && a !== 'unstated' && p.access.length < 3 && !p.access.includes(a)) p.access.push(short(a, 80));
            for (const a of openRows(r.affordances)) if (a?.what) {
                const what = short(a.what, 100), needs = arr(a.needs).map(n => stated(n, 80)).filter(Boolean);
                if (!p.affordances.some(y => y.what === what && y.needs.join('|') === needs.join('|'))) {
                    p.affordances.push({class: a.class || 'other', what, needs, label: r.label || null, locator: r.locator || null});
                }
            }
        }
        // "Other" rows from the rules, people and texture passes: loose facts tied to ids by `about`.
        for (const [pass, rows] of Object.entries(s.other || {})) for (const r of rows) {
            if (!r.what || !publicLifeRow(r) || arr(r.about).some(id => sealedGroups.has(id) || sealedRules.has(id))) continue;
            const projected = projectReaderNote(r, pass, s.prefix, proposalGuard);
            if (!projected) continue;
            counts.notes.rows++;
            const k = projected.what.toLocaleLowerCase();
            if ((r.label === 'S' || r.label === 'T') && parseLocator(r.locator)) {
                for (const id of arr(r.about)) {
                    if ((!creatureIds.has(id) && !personIds.has(id) && !itemIds.has(id) && !groupIds.has(id)) || sealedRules.has(id)) continue;
                    const facts = profileFacts.get(id) ?? [];
                    if (!facts.some(f => f.what === short(r.what))) {
                        facts.push({what: short(r.what), locator: r.locator, label: r.label});
                        profileFacts.set(id, facts);
                    }
                }
            }
            if (noteSeen.has(k)) {
                const previous = noteSeen.get(k);
                if (previous) {
                    previous.about = [...new Set([...previous.about, ...projected.about])];
                    for (const source of projected.sources) if (!previous.sources.some(value => JSON.stringify(value) === JSON.stringify(source))) previous.sources.push(source);
                }
                continue;
            }
            noteSeen.set(k, projected);
            notes.push(projected);
        }
        // Fills: authored proposals for gaps (invented or implied), never source facts.
        for (const r of s.fills || []) {
            const projected = projectReaderFill(r, s.prefix, proposalGuard);
            if (!projected) continue;
            counts.fills.rows++;
            if (!fills.has(r.id)) fills.set(r.id, projected);
            else mergeReaderFill(fills.get(r.id), projected);
        }
        for (const scene of arr(s.scenes)) {
            if (typeof scene?.beat !== 'string' || !scene.beat.trim()) continue;
            counts.scenes.rows++;
            if (!publicLifeRow(scene) || withheld.has(scene.beat)) {
                sealedBeats.add(scene.beat);
                sceneRows.delete(scene.beat);
                continue;
            }
            if (sealedBeats.has(scene.beat)) continue;
            const prior = sceneRows.get(scene.beat);
            if (prior) {
                if (!prior.shards.includes(s.prefix)) prior.shards.push(s.prefix);
                continue;
            }
            const locators = [...new Set(openRows(scene.evidence).map(e => e?.locator?.trim?.()).filter(l => parseLocator(l)))];
            const ids = values => [...new Set(values.filter(v => typeof v === 'string' && v && !withheld.has(v)))];
            const powers = ids([...openRows(scene.touched).filter(t => t?.status !== 'missing').map(t => t?.id),
                ...openRows(scene.steps).flatMap(step => arr(step?.using))])
                .filter(id => powerIds.has(id) && !sealedRules.has(id));
            const groups = ids(openRows(scene.touched).filter(t => t?.status !== 'missing').map(t => t?.id))
                .filter(id => groupIds.has(id) && !sealedRules.has(id));
            const detail = sceneSummary(scene, withheld);
            sceneRows.set(scene.beat, {
                id: scene.beat, place: typeof scene.place === 'string' && !withheld.has(scene.place) ? scene.place.trim() || null : null,
                locator: locators[0] ?? null, locators, shards: [s.prefix],
                refs: ids(openRows(scene.touched).filter(t => SCENE_LINK_KINDS.has(t?.kind) && t.status !== 'missing').map(t => t.id)),
                people: ids([...arr(scene.present), scene.pov]),
                ...(powers.length ? {powers} : {}),
                ...(groups.length ? {groups} : {}),
                ...(publicLifeRow(scene.timeOfDay) && stated(scene.timeOfDay?.value, 50) ? {time: stated(scene.timeOfDay.value, 50)} : {}),
                ...(publicLifeRow(scene.timeOfDay) && stated(scene.timeOfDay?.value,50) && !/^(?:unstated|unknown|unsettled)\b/i.test(scene.timeOfDay.value.trim()) &&
                    ['day','band','hour','minute'].includes(scene.timeOfDay?.precision) ? {timePrecision:scene.timeOfDay.precision} : {}),
                steps: openRows(scene.steps).length, options: openRows(scene.options).length, outcomes: openRows(scene.outcomes).length,
                ...(detail ? {detail} : {}),
            });
        }
    }
    // Agent-filled inputs and products (work from the readers' own steps), applied before the census join so they match too.
    for (const f of makingFill) {
        const r = rules.get(f.id);
        if (!r) continue;
        for (const [k, list] of [['inputs', f.inputs], ['products', f.products]]) for (const v of arr(list)) {
            const x = {...itemRef(world, v), qty: null, unit: null, role: v?.role || null, fill: v?.confidence || f.confidence || 'implied'};
            if (x.id.split('~')[1] !== '' && !r[k].some(y => y.id === x.id)) r[k].push(x);
        }
        if (f.outcome) r.outcome = short(f.outcome, 100);
        r.filled = true;
    }
    for (const [id, p] of people) {
        const e = entities.get(id) ?? {id, label: labelFromId(id), kind: 'person', col: 'people', first: p.first,
            aliases: [], places: [], lead: false, shards: []};
        if (e.col !== 'people') continue;
        for (const prefix of p.shards) if (!e.shards.includes(prefix)) e.shards.push(prefix);
        entities.set(id, Object.assign(e, {routine: p.routine, relations: [...p.relations.values()], knows: p.knows, wants: p.wants, reacts: p.reacts}));
    }
    for (const [id, {placeShards, ...p}] of places) {
        const e = entities.get(id) ?? {id, label: labelFromId(id), kind: 'place', col: 'places', first: p.placeLocator,
            aliases: [], places: [], lead: false, shards: []};
        for (const prefix of placeShards) if (!e.shards.includes(prefix)) e.shards.push(prefix);
        entities.set(id, Object.assign(e, p));
    }
    for (const id of creatureIds) Object.assign(entities.get(id), {
        facts: profileFacts.get(id) ?? [], sightings: creatureSightings.get(id) ?? [],
    });
    for (const id of personIds) if (entities.get(id)?.col === 'people') entities.get(id).facts = profileFacts.get(id) ?? [];
    for (const id of itemIds) if (entities.get(id)?.col === 'items') entities.get(id).facts = profileFacts.get(id) ?? [];
    for (const id of groupIds) if (!sealedRules.has(id)) {
        if (entities.get(id)?.col === 'groups') entities.get(id).facts = profileFacts.get(id) ?? [];
        if (rules.get(id)?.kind === 'institution') rules.get(id).facts = profileFacts.get(id) ?? [];
    }
    const noteCount = new Map();
    for (const n of notes) for (const id of n.about) noteCount.set(id, (noteCount.get(id) || 0) + 1);
    for (const [id, n] of noteCount) {const e = entities.get(id); if (e) e.notes = n;}
    counts.ties.distinct = people.size; counts.notes.distinct = notes.length; counts.fills.distinct = fills.size;
    for (const e of entities.values()) counts[e.col].distinct++;
    for (const r of rules.values()) counts[r.col].distinct++;
    counts.life.distinct = life.length;
    counts.scenes.distinct = sceneRows.size + sealedBeats.size;
    // Join rule items to census labels; ids the census never named stay, marked unmatched.
    const byName = new Map();
    for (const e of entities.values()) for (const n of [e.label, ...e.aliases]) {const k = slug(n); if (k && !byName.has(k)) byName.set(k, e.id);}
    for (const r of rules.values()) for (const x of [...r.inputs, ...r.products]) {
        if (!entities.has(x.id)) {
            // Plain words, or an id the census spelled differently: try the census label, then the id's own tail.
            const tail = x.id.split(/[.~]/).at(-1), hit = byName.get(slug(x.label || '')) || byName.get(tail);
            if (hit) x.id = hit;
        }
        const e = entities.get(x.id);
        x.label = e?.label || x.label || labelFromId(x.id);
        x.matched = !!e;
    }
    const byShards = (a, b) => b.shards.length - a.shards.length || a.label?.localeCompare?.(b.label);
    const scenes = [...sceneRows.values()].map(row => {
        if (row.detail) row.detail.related = row.detail.related.filter(dep => sceneRows.has(dep.id));
        return {row, position: parseLocator(row.locator)};
    })
        .sort((a, b) => a.position && b.position
            ? (a.position.book || 1) - (b.position.book || 1) || a.position.ch - b.position.ch || a.position.p - b.position.p
            : Number(!!b.position) - Number(!!a.position)).map(s => s.row);
    // Reading references are saved outside the Atlas. New shards can change row ordering.
    for (const row of life) row.focusKey = 'life:ref-' + createHash('sha256').update(lifeIdentity(row)).digest('hex');
    for (const row of notes) row.focusKey = 'note:ref-' + createHash('sha256').update(row.what.toLowerCase()).digest('hex');
    return {world, shards: shards.length, counts,
        entities: [...entities.values()].map(e => ({...e, seen: e.shards.length, shards: undefined, fallback: undefined})).sort((a, b) => b.seen - a.seen || a.label.localeCompare(b.label)),
        rules: [...rules.values()].sort(byShards).map(r => ({...r, seen: r.shards.length, shards: undefined})), life,
        scenes, sealedScenes: sealedBeats.size,
        notes, notesTotal: notes.length, fills: [...fills.values()], fillsTotal: fills.size};
}

const readRows = file => {
    if (!file || !existsSync(file)) return [];
    const out = [];
    for (const line of readFileSync(file, 'utf8').split('\n')) {
        if (!line.trim()) continue;
        try {out.push(JSON.parse(line));} catch {/* a torn line in a partial file: skip */}
    }
    return out;
};
// Agent fill of missing recipe inputs and products, kept beside the world's private reader rows (gitignored).
export const FILL_DIR = world => join(root, 'work/atlas-fill', world);
function readMakingFill(world) {
    const dir = FILL_DIR(world);
    return existsSync(dir) ? readdirSync(dir).filter(f => /^making_fill.*\.jsonl$/.test(f)).flatMap(f => readRows(join(dir, f))) : [];
}

export function readFindings({registry = join(root, REGISTRY), onRules = null, world: onlyWorld = null} = {}) {
    const books = JSON.parse(readFileSync(registry, 'utf8')).books;
    const worlds = new Map(), dirsDone = new Set();
    for (const book of books) {
        if (onlyWorld && book.world !== onlyWorld) {dirsDone.add(readerDirectory(book));continue;}
        const dir = readerDirectory(book), names = existsSync(dir) ? readdirSync(dir) : [], files = new Set(names);
        const shards = bookShards(book, names);
        const w = worlds.get(book.world) || worlds.set(book.world, {keys: [], shards: [], planned: 0, extra: 0, registryRead: 0}).get(book.world);
        w.keys.push(book.key);
        w.planned += shards.length;
        const orphans=orphanReaderSlices(book,books,names,shards);
        // Lead-run slices read before the registry existed (LOTM's b4s42, c5s12, w6s3...): base stems only, so
        // reruns (x2), probes and model trials stay out. Ids dedupe any overlap with registry shards.
        if (!dirsDone.has(dir)) {
            dirsDone.add(dir);
            const legacy = legacyReaderSlices(book, books, names);
            if (legacy.ambiguousWorlds.length) (w.legacyAmbiguities ||= []).push({ownerKey: legacy.ownerKey, worlds: legacy.ambiguousWorlds});
            for (const slice of legacy.slices) {shards.push(slice); w.extra++;}
        }
        shards.push(...orphans);
        for (const s of shards) {
            if(s.family==='graded-stage'&&!s.admitted)continue;
            const restricted=s.scope==='orphan'||s.family==='graded-stage';
            const admitted=[],orphanRows=new Map();
            const at = (pass, key) => {
                if(restricted) {
                    const selected=selectCollectedOutput(files,s.prefix,pass,key||pass);
                    if(!selected.name||selected.partial||!selected.migrated)return null;
                    const path=join(dir,selected.name);
                    if(orphanRows.has(path))return path;
                    let bytes,rows;
                    try {
                        bytes=readFileSync(path);
                        rows=bytes.toString('utf8').split(/\r?\n/).filter(line=>line.trim()).map(line=>{
                            const row=JSON.parse(line);if(!row||typeof row!=='object'||Array.isArray(row))throw Error('Invalid row');return row;
                        });
                    } catch {return null;}
                    orphanRows.set(path,rows);
                    admitted.push({key:book.key,prefix:s.prefix,pass,kind:key||pass,source:selected.source,
                        contentHash:'sha256:'+createHash('sha256').update(bytes).digest('hex')});return path;
                }
                const f = chosenFile(files, s.prefix, pass, key); return f ? join(dir, f) : null;
            };
            const rows=(pass,key)=>{const path=at(pass,key);return restricted?orphanRows.get(path)||[]:readRows(path);};
            const census = rows('census'), rules = rows('rules', 'rules');
            if (onRules && rules.length) onRules(book.world, s.prefix, rules);
            const texture = {services: rows('texture', 'services'), customs: rows('texture', 'customs'), news: rows('texture', 'news')};
            const scenes = rows('scenes');
            const people = rows('people', 'people'), places = rows('texture', 'places');
            const other = {rules: rows('rules', 'other'), people: rows('people', 'other'), texture: rows('texture', 'other')};
            const fillFile = [`${s.prefix}m_fills.jsonl`, `${s.prefix}_fills.jsonl`, `${s.prefix}L_fills.jsonl`].find(f => files.has(f));
            const fills = restricted?rows('scenes','fills'):fillFile ? readRows(join(dir, fillFile)) : [];
            if(s.scope==='orphan') (w.orphanInputs||=[]).push(...admitted);
            else if(s.family==='graded-stage')(w.legacyInputs||=[]).push(...admitted);
            if (census.length || rules.length || scenes.length || people.length || places.length || fills.length ||
                [...Object.values(texture), ...Object.values(other)].some(r => r.length)) {
                w.shards.push({prefix: s.prefix, census, rules, texture, scenes, people, places, other, fills});
                if(s.scope==='orphan')w.orphanRead=(w.orphanRead||0)+1;
                else if (!s.extra) w.registryRead++;
            }
        }
    }
    const digests = [...worlds].map(([world, w]) => ({...digestWorld({world, shards: w.shards, makingFill: readMakingFill(world)}), keys: w.keys, planned: w.planned, registryRead: w.registryRead, extraSlices: w.shards.length - w.registryRead-(w.orphanRead||0),orphanSlices:w.orphanRead||0,
        ...(w.orphanInputs?.length?{orphanInputs:w.orphanInputs}:{}),
        ...(w.legacyInputs?.length?{legacyInputs:w.legacyInputs}:{}),
        ...(w.legacyAmbiguities?.length ? {legacyAmbiguities: w.legacyAmbiguities} : {})}));
    const covered = digests.flatMap(d => [...d.rules.filter(r => isPower(r) || r.col === 'order'), ...d.entities.filter(e => e.col === 'groups')]);
    // Unqualified ids such as a spell's short name can collide across books.
    const coverage = coverageFor(new Set(covered.map(r => r.id).filter(id => id.includes('.'))));
    for (const r of covered) if (coverage.has(r.id)) r.coverage = coverage.get(r.id);
    return digests;
}

// The matrix the snapshot keeps: counts only. Digests are written per world for the Things and Making views.
export function findingsMatrix(digests) {
    return {columns: COLUMNS.map(({id, label}) => ({id, label})),
        worlds: digests.map(d => ({world: d.world, keys: d.keys, planned: d.planned, extraSlices: d.extraSlices || 0,orphanSlices:d.orphanSlices||0, registryRead: d.registryRead ?? d.shards, read: d.shards, counts: d.counts,
            making: d.rules.filter(r => MAKING_KINDS.includes(r.kind)).length, powers: d.rules.filter(isPower).length,
            groups: new Set([...d.entities.filter(e => e.col === 'groups'), ...d.rules.filter(r => r.kind === 'institution')].map(r => r.id)).size,
            sceneIndex: d.scenes.length + d.sealedScenes,
            sceneRanges: [...new Set(d.scenes.flatMap(scene => scene.shards || []))]}))};
}

// The archive can be much larger than one world. Separate workers release raw
// parsed inputs before the next world; the parent retains only the public matrix.
export function buildReaderDigests({registry = join(root, REGISTRY), outDir} = {}) {
    const worlds = [...new Set(JSON.parse(readFileSync(registry,'utf8')).books.map(book=>book.world))];
    const matrix = {...findingsMatrix([]),buildStats:{isolatedWorlds:worlds.length,maxRssKiB:0}};
    for (const world of worlds) {
        const result = JSON.parse(execFileSync(process.execPath,[fileURLToPath(import.meta.url),'--world',world,'--registry',registry,...(outDir?['--out-dir',outDir]:[])],
            {encoding:'utf8',maxBuffer:16*1024*1024,windowsHide:true}));
        matrix.columns = result.columns;matrix.worlds.push(...result.worlds);
        matrix.buildStats.maxRssKiB = Math.max(matrix.buildStats.maxRssKiB,result.buildStats.maxRssKiB);
    }
    return matrix;
}

if (import.meta.main) {
    const i = process.argv.indexOf('--out-dir'), outDir = i > 0 ? process.argv[i + 1] : null;
    const r = process.argv.indexOf('--registry'), registry = r > 0 ? process.argv[r + 1] : join(root,REGISTRY);
    const w = process.argv.indexOf('--world'), world = w > 0 ? process.argv[w + 1] : null;
    if (!world) process.stdout.write(JSON.stringify(buildReaderDigests({registry,outDir})));
    else {
      const digests = readFindings({registry,world});
      if (outDir) {
        mkdirSync(outDir, {recursive: true});
        for (const d of digests) {
            const file = join(outDir, d.world + '.json');
            const temporary = file + '.' + process.pid + '.tmp';
            writeFileSync(temporary, JSON.stringify(d));
            renameSync(temporary, file);
        }
      }
      process.stdout.write(JSON.stringify({...findingsMatrix(digests),buildStats:{maxRssKiB:process.resourceUsage().maxRSS}}));
    }
}
