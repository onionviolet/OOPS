#!/usr/bin/env node
// Artifact ledgers (R6 / PWC16, power-catalogues-2026-11-16): LOTM Sealed Artifacts and named mystical items, Harry Potter
// magical objects, Reverend Insanity non-Gu treasures. One power sheet per row (PWC1), every field with a locator and a
// speaker, scored against the world's own classification (PWC2), blocked rows naming the missing capability (PWC5).
//
//   python3 -I scripts/artifact_packets.py           builds the private packets (wiki text stays private)
//   node scripts/artifact_ledgers.mjs pass [--sync|--dry|--wait] [lotm|hp|ri]   paid pass by batch (AU16), keys from env
//   node scripts/artifact_ledgers.mjs build           writes docs/coverage/<ledger>.jsonl and <ledger>_labels.json
//   node scripts/artifact_ledgers.mjs report          prints the score table
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {runPass} from './label_runner.mjs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES} from '../src/effect_grammar.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const privateDir = process.env.LABEL_PRIVATE ? `${process.env.LABEL_PRIVATE.replace(/\/$/, '')}/` : `${root}docs/research/power-catalogues-2026-11-16/private/`;
const coverage = `${root}docs/coverage/`;
const json = path => JSON.parse(readFileSync(path, 'utf8'));

export const SPEAKER = ['narrator', 'character_claim', 'demonstration', 'wiki', 'unknown'];
// Blocking capabilities (PWC5). Slugs shared with the other power ledgers where the capability is the same.
export const BLOCKED = ['effect-unknown', 'area-field', 'power-interaction', 'mind-binding', 'form-transformation', 'familiar-summon', 'power-transfer',
    'containment-rule', 'negative-effect-drift', 'soul-binding', 'item-state', 'divination', 'spatial-storage', 'material-row', 'formation-field', 'time-stop', 'none'];
export const SHEET_FIELDS = ['cost', 'who_may', 'where_from', 'go_wrong', 'mind', 'left_behind', 'combines', 'counters', 'route_to_player', 'knowledge'];
export const KINDS = ['artifact', 'consumable', 'material', 'formation', 'place-resource', 'phenomenon', 'text-or-record', 'not-a-thing'];

export const CORPORA = {
    lotm: {ledger: 'lotm_artifacts', prefix: 'lotm.item.', owner: 'A', classes: ['0', '1', '2', '3', 'ungraded'], baseline: '2',
        denominator: 'Lord of the Mysteries wiki categories Sealed Artifacts (143), Mystical Items, Beyonder Weapon, Equipment, Items, Destroyed Items and every "<x> Items" category, union by page title (lotm-wiki-current-pages-2026-11-03)',
        what: 'Sealed Artifacts and named mystical items',
        label: 'Sealed Artifact grade 0-3 (the page grade field, hidden); 0 is the most dangerous',
        ask: `The item is a Lord of the Mysteries artifact or mystical item. "class_guess" is your guess of its Sealed Artifact grade from how dangerous and how hard to contain its powers and downsides are: "0" the most dangerous (can threaten a high Sequence or a city), "1" very dangerous, "2" dangerous, "3" the mildest sealed artifacts; "ungraded" for an item that is not a sealed artifact (a plain mystical item, weapon or equipment piece). The grade itself has been removed from the evidence. Sealed Artifacts have negative effects and containment rules: put the negative effect in go_wrong and the containment or handling rule in counters or who_may.`},
    hp: {ledger: 'hp_objects', prefix: 'hp.object.', owner: 'A', classes: ['horcrux', 'hallow', 'cursed', 'dark-artefact', 'amulet', 'broomstick', 'game', 'magical-object', 'object'], baseline: 'magical-object',
        denominator: 'Harry Potter wiki categories Magical objects (340), Cursed objects, Dark Magic artefacts, Broomsticks, Individual broomsticks, Objects, Magical games, Amulets, Deathly Hallows, Horcruxes, union by page title (harrypotter_pages_current)',
        what: 'magical objects',
        label: 'the wiki object category (Horcruxes, Deathly Hallows, Cursed objects, Dark Magic artefacts, Amulets, Broomsticks, Magical games, Magical objects, Objects; first match in that order; hidden)',
        ask: `The item is a Harry Potter object. "class_guess" is the wiki category you think it sits in, the most specific one that fits: horcrux, hallow (a Deathly Hallow), cursed (a cursed object), dark-artefact (a Dark Magic artefact that is not cursed), amulet, broomstick (a broom model or one named broom), game (a magical game or its equipment), magical-object (an ordinary enchanted object), object (a plain or Muggle object with no magic of its own). The categories have been removed from the evidence. A cursed or Dark object's harm goes in go_wrong.`},
    ri: {ledger: 'ri_treasures', prefix: 'ri.treasure.', owner: 'A', classes: ['material', 'immortal-material', 'formation', 'resource-point', 'item', 'phenomenon'], baseline: 'material',
        denominator: 'Reverend Insanity wiki categories Materials and Resources (75), Items, Immortal Materials, Gu Formation(s), Immortal Gu Formation(s), Ancient Battle Formations, Natural Formations, Resource Points, World Objects and Phenomena, minus every page in a Gu category, union by page title (reverendinsanity_pages_current)',
        what: 'non-Gu treasures: heaven-and-earth materials, Immortal materials, formations, resource points and items',
        label: 'the wiki category kind (material, immortal-material, formation, resource-point, item, phenomenon; first match; hidden). Weak: the page rarely hides what it is',
        ask: `The item is a Reverend Insanity treasure that is not a Gu: a heaven-and-earth material, an Immortal material, a formation, a resource point (a place that yields materials), an item or a world phenomenon. "class_guess" is the wiki category kind: material, immortal-material, formation, resource-point, item, phenomenon. Use "kind" "text-or-record" for a list or index page and "not-a-thing" for a concept page that names no object. Note what a Gu Master or Immortal uses it for (refining, feeding, defence, trade) in who_may and route_to_player.`},
};

const f = {type: 'object', additionalProperties: false, required: ['value', 'locator', 'speaker'],
    properties: {value: {type: 'string'}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKER}}};
const strictObject = props => ({type: 'object', additionalProperties: false, required: Object.keys(props), properties: props});
export const schemaFor = corpus => strictObject({
    kind: {type: 'string', enum: KINDS},
    kind_note: {type: 'string'},
    effect: strictObject({verb: {type: 'string', enum: [...EFFECT_VERBS, 'none']}, object: {type: 'string', enum: [...Object.keys(EFFECT_OBJECTS), 'none']},
        target: {type: 'string', enum: [...EFFECT_TARGETS, 'none']}, time: {type: 'string', enum: [...EFFECT_TIMES, 'none']},
        summary: {type: 'string'}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKER}}),
    ...Object.fromEntries(SHEET_FIELDS.map(k => [k, f])),
    class_guess: {type: 'string', enum: CORPORA[corpus].classes},
    blocked: {type: 'string', enum: BLOCKED},
    blocked_reason: {type: 'string'},
});

export const SYSTEM = `Use only the evidence lines given. Each line starts with its locator in square brackets; copy that bracket's content exactly into "locator". Write values as short paraphrases in your own words, never quotations. If the evidence does not state something, set value and locator to "" and speaker to "unknown": an empty field is correct, a guess is wrong. "speaker" says who states it: narrator, a character's claim (which may be wrong), a demonstration (shown happening), or the wiki.
Fill one power sheet for the named object of a fictional world. "effect" is its main effect as one grammar sentence: verb, object, target and time chosen from the lists, "none" when no effect is stated; "summary" a short paraphrase. cost: what using or holding it costs or its price. who_may: who can hold or use it. where_from: how it is made, found or acquired. go_wrong: negative effects, backlash, curses or containment failures. mind: its effect on the holder's mind. left_behind: what happens on the holder's death or when it is passed on or destroyed. combines: how it interacts with other objects or powers. counters: what stops it, contains it or protects against it. route_to_player: how a newcomer could plausibly come to hold or meet it, with the cost. knowledge: who in the world knows how it works (public, the holder, an institution, or no one). "blocked" names the capability a game engine would need to run it, from the list, "none" if the effect fits the grammar and nothing else is needed, "effect-unknown" when the evidence does not say what it does.`;

const sha1 = s => createHash('sha1').update(s).digest('hex');
export const SPLIT_RULE = 'Rows are ordered by sha1 of "artifacts-v1:<id>" and the first quarter (first hex byte below 0x40) are the tuning sample, the only rows the prompt or normaliser was adjusted on; every other row is held out and reported (GKM429). Dial: seed and fraction; the fixed seed is the reported one.';
export const split = id => (parseInt(sha1(`artifacts-v1:${id}`).slice(0, 2), 16) < 0x40 ? 'tuned' : 'held-out');

const packetsOf = corpus => json(`${privateDir}artifacts_${corpus}_packets.json`);
const passItem = p => ({id: p.id, user: `Object: ${p.name}\n${CORPORA_ASK(p)}\n\nEvidence:\n${p.evidence.join('\n')}`});
const CORPORA_ASK = p => CORPORA[p.id.startsWith('lotm') ? 'lotm' : p.id.startsWith('hp') ? 'hp' : 'ri'].ask;
const replyFile = corpus => `${privateDir}artifacts_${corpus}_luna.json`;

export async function pass(corpus, argv) {
    const c = CORPORA[corpus];
    return runPass({name: `artifacts_${corpus}`, dir: privateDir, system: SYSTEM, schema: schemaFor(corpus), items: packetsOf(corpus).map(passItem),
        model: 'gpt-6-luna', effort: 'low', maxTokens: 4000, maxUsd: 2}, argv);
}

const slug = s => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'unspecified';
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);

/** One ledger row plus its full sheet from a packet and a reply. */
export function rowOf(corpus, packet, reply0) {
    const c = CORPORA[corpus];
    // The model sometimes copies the brackets around a locator; the normaliser strips them, and a locator that is not an
    // evidence tag of this packet falls back to the page (wiki:<title>) so every kept locator can be followed.
    const tags = new Set([...packet.evidence.join('\n').matchAll(/\[(wiki:[^\]]+)\]/g)].map(m => m[1]));
    const fix = fld => { const locator = String(fld.locator ?? '').replace(/^\[|\]$/g, ''); return {...fld, locator: tags.has(locator) ? locator : (fld.value ?? fld.summary) ? `wiki:${packet.name}` : ''}; };
    const reply = {...reply0, effect: fix(reply0.effect), ...Object.fromEntries(SHEET_FIELDS.map(k => [k, fix(reply0[k])]))};
    const why = String(reply.kind_note).toLowerCase();
    const short = /list|index|listing|collection|several/.test(why) ? 'list-page' : /character|person|people/.test(why) ? 'person'
        : /process|activity|event|competition|game|race|mission|practice|method/.test(why) ? 'activity' : 'concept';
    const sheet = {kind: reply.kind, effect: reply.effect, ...Object.fromEntries(SHEET_FIELDS.map(k => [k, reply[k]])), class_guess: reply.class_guess};
    let state;
    if (reply.kind === 'not-a-thing') state = `not-a-thing:${short}`;
    else if (reply.blocked === 'none') state = 'catalogued';
    else state = `blocked:${reply.blocked}`;
    const effect = reply.effect.verb === 'none' ? 'effect not stated' : `${reply.effect.verb}.${reply.effect.object}/${reply.effect.target}/${reply.effect.time}`;
    const note = `${packet.name}. ${reply.kind}. Effect ${effect} (wiki tier, Luna, unchecked): ${clip(reply.effect.summary, 120)}.`
        + (state.startsWith('blocked:') ? ` Blocked: ${clip(reply.blocked_reason || reply.blocked, 140)}.` : '') + ` Full sheet in ${c.ledger}_labels.json.`;
    return {row: {id: packet.id, source: `${packet.locator}; wiki:${packet.name}`, state, mechanisms: [c.owner], test: null, note}, sheet,
        label: packet.label, split: split(packet.id)};
}

export function score(corpus, entries) {
    const c = CORPORA[corpus];
    const rows = entries.filter(e => e.label != null && c.classes.includes(String(e.label)));
    const by = part => {
        const r = rows.filter(e => e.split === part);
        const hit = r.filter(e => e.sheet.class_guess === String(e.label)).length;
        const base = r.filter(e => String(e.label) === c.baseline).length;
        const within1 = corpus === 'lotm' ? r.filter(e => Math.abs(Number(e.sheet.class_guess) - Number(e.label)) <= 1).length : null;
        return {n: r.length, hit, baseline: base, within1};
    };
    return {label: c.label, baseline_class: c.baseline, tuned: by('tuned'), held_out: by('held-out')};
}

export function build() {
    const out = {};
    for (const corpus of Object.keys(CORPORA)) {
        const c = CORPORA[corpus], replies = json(replyFile(corpus)), packets = packetsOf(corpus);
        const entries = packets.map(p => {
            const r = replies[p.id]?.reply;
            if (!r) throw Error(`${p.id}: no reply; run the pass first`);
            return {...rowOf(corpus, p, r), packet: p};
        });
        const s = score(corpus, entries);
        // Fold rule (PWC2): the guessed class becomes a sheet field only where the held-out score beats the baseline class.
        const folded = s.held_out.hit > s.held_out.baseline;
        writeFileSync(`${coverage}${c.ledger}.jsonl`, entries.map(e => JSON.stringify(e.row)).join('\n') + '\n');
        writeFileSync(`${coverage}${c.ledger}_labels.json`, JSON.stringify({
            ledger: c.ledger, what: c.what, denominator: c.denominator, count: entries.length, split_rule: SPLIT_RULE, score: s,
            fold: {class_guess: folded ? 'folded' : 'not folded (does not beat the baseline class on held-out rows)'},
            sheets: Object.fromEntries(entries.map(e => [e.row.id, {name: e.packet.name, split: e.split, label: e.label ?? null, locator: e.packet.locator,
                sheet: {...e.sheet, class_guess: folded ? e.sheet.class_guess : undefined}}])),
        }, null, 1) + '\n');
        out[corpus] = {count: entries.length, score: s, folded};
    }
    return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [cmd, ...rest] = process.argv.slice(2);
    const corpora = rest.filter(a => CORPORA[a]);
    if (cmd === 'pass') for (const corpus of corpora.length ? corpora : Object.keys(CORPORA)) await pass(corpus, rest);
    else if (cmd === 'build' || cmd === 'report') console.log(JSON.stringify(build(), null, 1));
    else console.log('usage: artifact_ledgers.mjs pass|build|report');
}
