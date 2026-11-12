// Hogwarts effect world pack (PC5, PC6; packet P1.8). Proposal status (AD32).
// Two things live here, both moved out of the test fixture so a runtime can load them:
//   1. The Hogwarts effect grammar and the labeller that reads the spellbook's
//      "Operation or lead" paraphrase into an effect sentence (chat P proof, EF1).
//   2. `coverageCase(id)` for spellbook rows: a probe scene per row that the generic
//      runner (scripts/coverage_report.mjs) executes.
// A case's sentence comes from the row's own truth, read into the shared vocabulary
// by `sharedEffect`. Its `expect` comes from HP_CASE_SCENES: what a reader of the
// cited scene sees change, in world terms (who, which amount or property or place).
// The two are written apart, so a scene that disagrees with the sentence computes
// blocked instead of passing. Every amount, destination and mark name below is a
// pack default (an original game dial); the books give none of them as numbers.
import {defineEffectGrammar} from '../effect_grammar.js';
import {defineGrammar} from '../procedural_grammar.js';
import {sharedEffect} from '../spell_effects.js';
import {HP_SPELL_ROWS} from '../spell_pack_hogwarts.js';
import {HP_PRIMITIVE_SCENES} from './hp_primitive_case_scenes.js';

// ---------- Effect grammar and labeller (spellbook research records) ----------
// W keys: light is wand light and essence is mana unless a thing names its own.
export const HP_KEYS = Object.freeze({light: 'wand', essence: 'mana'});
export const hpEffects = defineEffectGrammar({
    world: 'hogwarts', carriers: {'spoken-spell': ['stamina'], ward: ['stamina']},
    keys: HP_KEYS,
    limits: ['ward', 'cover', 'distance', 'mass', 'will', 'counter-effect'],
});
// Ordered: the first verb rule that matches wins. Words are the paraphrase's.
const HP_VERBS = [
    ['transform', /repair|\bmend/], ['end', /\bend\b|finite|\bcounter|dismiss/],
    ['block', /barrier|shield|\bward|repel|imped|protect|restrict|prevent|interpose|suppress|interfere|defensive/],
    ['release', /release|\bopen|unlock|\bfree\b|unbind|\bclear/], ['bind', /\bbind|hold|immobili|rigidif|suspend|lock|stick|seal|restrain/],
    ['conceal', /conceal|hide|disillusion|invisib|disguise|muffl|blindfold/], ['copy', /copy|duplicat|record|replica/],
    ['sense', /reveal|detect|\bsee\b|show|identif|locate|\bread|find|sense|point|test|track|inspect|access mental|query|orient/],
    ['move', /move|lift|bring|send|carry|raise|summon|transport|descend|fetch|float|slow|fall|throw|pull|push|banish|away|dance|\bdirect/],
    ['remove', /remove|destroy|vanish|erase|\bcut|\bsever(?!al)|extinguish|damage|harm|kill|wound|explo|blast|break|clean|scour|strike|pain/],
    ['transform', /transform|change|transfigur|\bturn|becom|shrink|enlarg|swell|grow|alter|reshape|harden|set up|restore|animate|impose/],
    ['add', /make|creat|conjur|produc|\blight|illuminat|fire|flame|water|spark|heal|fill|mark|signal|cheer|sound|amplif|manifest/],
    ['alter', /carrier|enchant|charm the|jinx the/],
];
const HP_OBJECTS = [
    ['mind', /\bmind|mental|emotion|confus|cheer|mood|sleep|dream|\bwill\b|thought|laugh|calm|command/],
    ['working', /\bend\b|finite|\bcounter|curse|jinx|\bhex|enchant|working|spell\b|echo/], ['vitality', /harm|wound|heal|kill|pain|injur|blood|airway|choking/],
    ['light', /\blight|illuminat|glow|lumos|spark|\bdark/], ['heat', /\bfire|flame|heat|warm|burn|cold|freez/], ['sound', /sound|voice|noise|silen|muffl|loud|hearers/],
    ['moisture', /\bwater|\bwet\b|\bdry\b|\brain\b/], ['memory', /memor|forget/],
    ['relation', /custody|held implement|access|agreement|\block|unlock|door|oath|passage|key/], ['information', /reveal|detect|identif|locate|signal|show|find|test|track|point|inspect|navigation|eyes/],
    ['form', /shape|transfigur|size|colou?r|\bform\b|repair|mend|grow|shrink|swell|rigid|body|teeth|hair|boils|harden|tent|hole/],
    ['position', /move|lift|bring|send|carry|raise|summon|transport|descend|fetch|float|fall|slow|suspend|immobili|legs|away|route|destination|attack/],
    ['thing', /object|item|luggage|tree|target|thing|guardian|statue|restraints|material/],
];
const HP_TARGET = [['self', /self|caster|oneself|own /], ['area', /ward|perimeter|area|room|camp|group|surround/], ['touched', /touch/],
    ['line', /toward a target|jet|beam|send a/]];
const HP_TIME = [['sustained', /support|maintain|keep|until|while|ongoing|active/], ['lasting', /permanent|lasting|repair|mend|transfigur|make/],
    ['triggered', /when|trigger/]];
const HP_LIMITS = [['ward', /protected|obstruct|ward/], ['mass', /mass|weight|heavy/], ['distance', /distance|range|far|route/], ['will', /will|resist/],
    ['counter-effect', /eligible|counter/]];
const first = (table, text) => table.find(([, re]) => re.test(text))?.[0] ?? null;
export function labelHpEffect(row) {
    const text = row.lead.toLowerCase();
    const verb = first(HP_VERBS, text);
    if (!verb) return {missing: ['verb']};
    let object = first(HP_OBJECTS, text);
    const defaults = {move: 'position', block: 'working', end: 'working', sense: 'information', conceal: 'information', bind: 'position',
        release: 'working', add: 'thing', remove: 'thing', transform: 'form', copy: 'form', alter: 'working'};
    object ??= defaults[verb];
    const limits = HP_LIMITS.filter(([, re]) => re.test(text)).map(([l]) => l);
    const carrier = row.family === 'Defend, interrupt and end' && /ward|perimeter|repel/.test(text) ? 'ward' : 'spoken-spell';
    return {parts: {verb, object, target: first(HP_TARGET, text) ?? 'bound', time: first(HP_TIME, text) ?? 'instant', carrier, cost: 'stamina', limits},
        truth: {family: row.family}};
}
// Non-circular check: chat S's family headings group records by operation,
// apart from the lead text the labeller reads.
const FAMILY_VERBS = {
    'Move, stop and position': ['move', 'bind', 'block', 'release'],
    'Defend, interrupt and end': ['block', 'end', 'release', 'conceal', 'move', 'alter'],
    'Make, change and repair': ['add', 'transform', 'remove', 'copy', 'alter'],
    'See, know, signal and conceal': ['sense', 'conceal', 'add', 'copy', 'block'],
    'Change a creature, mind or ongoing condition': ['transform', 'bind', 'alter', 'add', 'remove', 'move', 'sense'],
    'Access, agreements and named attempts': ['release', 'bind', 'alter', 'sense', 'add'],
};
export function compareHpEffect(value, truth) {
    const allowed = FAMILY_VERBS[truth.family] ?? [];
    return allowed.includes(value.parts.verb) ? [] : [{field: 'verb', rule: 'family', cause: `${value.parts.verb} outside "${truth.family}"`, expected: allowed.join('|'), got: value.parts.verb}];
}
// One world law as data (proposal): no shown Hogwarts spell rewrites a law of
// the place. A pack can add an exception with its in-world reason and cost.
export const HP_FORBID = [{law: 'alter|law', reason: 'no shown spell rewrites a law of the place; wards act on what enters, not on the law'}];

// GL2: the effect predicted from identity. The identity layer (chat S's family
// heading) goes first and the verb is conditioned on it.
function withIdentity(effects, identitySlots, verbGiven) {
    const spec = effects.spec;
    return defineGrammar({...spec, id: `${spec.id}.gl2`, slots: [...identitySlots,
        ...spec.slots.map(s => s.id === 'verb' ? {...s, given: verbGiven} : s)]});
}
export const hpEffectsGl2 = withIdentity(hpEffects, [{id: 'family', type: 'one', open: true}], 'family');
export function labelHpEffectGl2(row) {
    const out = labelHpEffect(row);
    return out.parts ? {...out, parts: {...out.parts, family: row.family}} : out;
}

// ---------- Coverage cases for spellbook rows (PC5) ----------
// Spell target and time words on the shared grammar's. Default reading; a world
// may narrow it. Reason: the shared grammar names how a target is reached, not
// what kind of thing it is, and has no word for "a while, then it lets go".
export const HP_TARGET_OF = Object.freeze({self: 'self', area: 'area', place: 'area'});
export const HP_TIME_OF = Object.freeze({timed: 'sustained'});
// Scene defaults (dials). Reason for each: the books show the change and give no figure.
export const HP_CASE_DEFAULTS = Object.freeze({
    wound: 5,        // vitality a cutting curse takes from a body that starts at `body`
    body: 12,        // vitality of a probe body
    small: 3,        // vitality of a small creature; a killing curse takes all of it
    glow: 40,        // light grade a lit wand tip gives
    pour: 30,        // humidity a jet of water adds to a room that starts at `damp`
    damp: 40,
    voice: 20,       // loudness an ordinary speaker carries
    louder: 50,      // loudness the amplifying charm adds
    shieldMinutes: 1, // enough to intercept a blow in the probe
    silenceMinutes: 2, // enough to stop a reply in the probe
    muffleMinutes: 3, // enough to cover a short conversation in the probe
});
const D = HP_CASE_DEFAULTS;

// Scene builders: plain data in world terms. None of them reads a sentence.
const at = id => ({shape: 'holder', id});
const room = id => ({id, kind: 'place', quantities: {humidity: D.damp, noise: 0}});
// A holder leaves one place and is found in another.
const carried = (seen, id, from, to, kind = 'thing') => ({seen,
    holders: [room(from), room(to), {id, kind, place: from}],
    details: {target: at(id), to}, expect: [{holder: id, position: true, direction: 'changed', to}]});
// A holder comes to bear a mark it did not bear (a binding, a seal, a sign).
const marked = (seen, id, mark, place, kind = 'body') => ({seen,
    holders: [room(place), {id, kind, place, properties: {marks: []}}],
    details: {target: at(id), mark}, expect: [{holder: id, property: 'marks', direction: 'changed', to: [mark]}]});
// A holder loses a mark it bore.
const unmarked = (seen, id, mark, place) => ({seen,
    holders: [room(place), {id, kind: 'thing', place, properties: {marks: [mark]}}],
    details: {target: at(id), mark}, expect: [{holder: id, property: 'marks', direction: 'changed', to: []}]});
// A holder wears a different shape afterwards.
const reshaped = (seen, id, before, after, place, kind = 'thing') => ({seen,
    holders: [room(place), {id, kind, place, properties: {form: before}}],
    details: {target: at(id), value: after}, expect: [{holder: id, property: 'form', direction: 'changed', to: after}]});
// A holder carries more or less of an amount.
const measured = (seen, id, quantity, start, amount, direction, place, kind = 'body') => ({seen,
    holders: [room(place), {id, kind, place, quantities: {[quantity]: start}}],
    details: {target: at(id), amount}, expect: [{holder: id, quantity, direction, amount}]});

// Independently observed fields, scoped to the protected holder or place.
const fieldChanged = (lawField, scope, kind, params, until) => ({lawField, direction: 'changed',
    to: {scope, kind, params, ...(until === undefined ? {} : {until})}});

/** One scene per spellbook row that honestly executes: what the cited pages show, as a probe world.
 * A row absent here has no case; HP_CASE_LEFT_OUT says why. */
export const HP_CASE_SCENES = Object.freeze({
    ...HP_PRIMITIVE_SCENES,
    // An object or a body is somewhere else afterwards.
    levitation: carried('a feather leaves the desk and hangs overhead', 'feather', 'desk', 'overhead'),
    hover: carried('a pudding leaves the counter and hangs near the ceiling', 'pudding', 'counter', 'ceiling'),
    summoning: carried('a called object leaves where it lay and arrives where the caster stands', 'called-object', 'far-end', 'caster-side'),
    locomotion: carried('a trunk leaves the bedroom floor and is steered to the landing', 'trunk', 'bedroom', 'landing'),
    mobilicorpus: carried('a limp body leaves the floor of the room and is borne into the passage', 'limp-body', 'room', 'passage', 'body'),
    mobiliarbus: carried('a small tree leaves its spot and sets down in front of the table', 'tree', 'corner', 'by-the-table'),
    dangling: carried('a person leaves the ground and hangs upside down in the air', 'person', 'ground', 'midair', 'body'),
    descend: carried('stacked objects leave their height and come to the floor', 'stack', 'high-shelf', 'floor'),
    banishing: carried('a cushion leaves the caster and lands across the room', 'cushion', 'caster-side', 'across-the-room'),
    project: carried('a wad of gum leaves the keyhole and ends up elsewhere', 'gum', 'keyhole', 'elsewhere'),
    apparition: carried('a person leaves one spot and stands in the place they fixed on', 'traveller', 'starting-spot', 'destination', 'body'),
    // A body or thing is held fast.
    impediment: marked('an advancing creature stops where it is for a while', 'creature', 'impeded', 'path'),
    'leg-lock': marked('a body\'s legs spring together and stay locked', 'walker', 'legs-locked', 'corridor'),
    'body-bind': marked('a body goes rigid and falls flat', 'body', 'body-bound', 'common-room'),
    'tongue-lock': marked('a tongue sticks to the roof of the mouth', 'speaker', 'tongue-locked', 'corridor'),
    rope: marked('ropes wrap a body and stay on it', 'body', 'roped', 'tower-top'),
    freezing: marked('a pixie stops dead in the air', 'pixie', 'frozen-still', 'classroom'),
    sticking: marked('a portrait cannot be taken off its wall', 'portrait', 'stuck-fast', 'hall', 'thing'),
    // A seal or a sign is written or wiped.
    lock: marked('a door seals shut behind the caster', 'door', 'sealed', 'corridor', 'thing'),
    mark: marked('a fiery cross sits on a door', 'door', 'fiery-cross', 'round-room', 'thing'),
    'dark-mark': marked('a sign hangs in the sky over the wood', 'sky', 'skull-sign', 'wood', 'thing'),
    unlock: unmarked('a locked door swings open', 'door', 'locked', 'corridor'),
    'statue-passage': unmarked('a statue\'s hump opens onto a passage', 'statue', 'closed', 'corridor'),
    // A thing or a body wears a different shape.
    mend: reshaped('a broken thing is whole again', 'broken-thing', 'broken', 'whole', 'room'),
    glisseo: reshaped('a staircase flattens into a chute', 'staircase', 'steps', 'chute', 'stairwell'),
    engorge: reshaped('a spider swells to several times its size', 'spider', 'small', 'swollen', 'tent', 'body'),
    reduce: reshaped('a swollen spider shrinks back', 'spider', 'swollen', 'small', 'classroom', 'body'),
    teeth: reshaped('front teeth grow down past the chin', 'struck-person', 'ordinary-teeth', 'overgrown-teeth', 'corridor', 'body'),
    boils: reshaped('a face breaks out in boils', 'struck-person', 'clear-skin', 'boils', 'corridor', 'body'),
    'bat-bogey': reshaped('a face is covered in flapping growths', 'struck-person', 'ordinary-face', 'bat-bogeys', 'office', 'body'),
    boggart: reshaped('a feared shape turns into a silly one', 'boggart', 'feared-shape', 'silly-shape', 'staffroom', 'body'),
    // Scoped fields. Page locators are those of the existing spell truths.
    // B6 pp3058–3059, B7 p4018: one protective binding and one modeled way to intercept harm.
    shield: {seen: 'a barrier is interposed to protect the caster',
        modelNote: 'Probe records a temporary block on vitality loss for one protected holder.',
        holders: [room('practice-room'), {id: 'caster', kind: 'body', place: 'practice-room'}],
        details: {target: at('caster'), field: 'shield-barrier', minutes: D.shieldMinutes},
        expect: [fieldChanged('shield-barrier', 'caster', 'block', {verb: 'remove', object: 'vitality'}, D.shieldMinutes)]},
    // B7 pp3916, 3936: scope one inferred access condition. Individual reactions remain open.
    'muggle-repelling': {seen: 'a repelling ward is laid around the camp',
        modelNote: 'Probe records a scoped access field; individual reactions are outside this observation.',
        holders: [room('camp')],
        details: {target: at('camp'), field: 'repelling-ward', kind: 'access', params: {discourages: 'muggle-entry'}},
        expect: [fieldChanged('repelling-ward', 'camp', 'access', {discourages: 'muggle-entry'})]},
    // B5 pp2771–2772: the restriction is reported. Record its transport mode, without blocking mundane movement.
    'anti-apparition': {seen: 'a place bears a restriction on magical departure',
        modelNote: 'Probe records a scoped departure restriction; transport enforcement is outside this observation.',
        holders: [room('hall')],
        details: {target: at('hall'), field: 'departure-ward', kind: 'access', params: {restricts: 'disapparition'}},
        expect: [fieldChanged('departure-ward', 'hall', 'access', {restricts: 'disapparition'})]},
    // B5 p2742: suppress the voice account on this speaker while other actions remain available.
    silence: {seen: 'the speaker is silenced and can still act',
        modelNote: 'Probe models voice suppression as a temporary block on adding noise to the speaker.',
        holders: [room('chamber'), {id: 'speaker', kind: 'body', place: 'chamber', quantities: {noise: 0}}],
        details: {target: at('speaker'), field: 'silenced-voice', params: {verb: 'add', object: 'noise'}, minutes: D.silenceMinutes},
        expect: [fieldChanged('silenced-voice', 'speaker', 'block', {verb: 'add', object: 'noise'}, D.silenceMinutes)]},
    // B6 p3131: the listener-side effect is modeled as a scoped block on adding audible sound.
    muffle: {seen: 'nearby listeners cannot make out the conversation',
        modelNote: 'Probe models listener-side interference as a temporary block on adding noise in the area.',
        holders: [room('listening-area')],
        details: {target: at('listening-area'), field: 'muffled-sound', params: {verb: 'add', object: 'noise'}, minutes: D.muffleMinutes},
        expect: [fieldChanged('muffled-sound', 'listening-area', 'block', {verb: 'add', object: 'noise'}, D.muffleMinutes)]},
    // More or less of an amount.
    water: {seen: 'a jet of water wets the room',
        holders: [room('burning-room')], details: {target: at('burning-room'), amount: D.pour},
        expect: [{holder: 'burning-room', quantity: 'humidity', direction: 'up', amount: D.pour}]},
    light: measured('a dark wand tip glows', 'wand', 'light:wand', 0, D.glow, 'up', 'dark-lane', 'thing'),
    extinguish: measured('a glowing wand tip goes dark', 'wand', 'light:wand', D.glow, D.glow, 'down', 'dark-lane', 'thing'),
    amplify: measured('a speaker\'s voice fills the stadium', 'speaker', 'noise', D.voice, D.louder, 'up', 'stadium'),
    sectum: measured('a body is slashed and bleeds', 'struck-body', 'vitality', D.body, D.wound, 'down', 'bathroom'),
    dolohov: measured('a body is struck across the chest and collapses hurt', 'struck-body', 'vitality', D.body, D.wound, 'down', 'chamber'),
    kill: measured('a spider is dead at once, unmarked', 'spider', 'vitality', D.small, D.small, 'down', 'classroom'),
});

// Rows with no case, by reason (data for the report; nothing here is forced to pass).
export const HP_CASE_LEFT_OUT = Object.freeze({
    'publishes-only': 'the shared reading lowers to no W act; it waits as a publish for the mind, knowledge or working owner',
    'act-and-publish': 'one W act plus a publish for another owner; left until that owner answers so the case shows the whole effect',
    'no-shared-reading': 'the spell verb has no reading in the shared vocabulary',
});

const ROWS = new Map(HP_SPELL_ROWS.map(r => [r.id, r]));
/** The row's truth as a sentence of the shared grammar, in this world's carrier and cost. */
export function caseSentence(row) {
    const shared = sharedEffect(row.truth);
    if (shared.gap) throw Error(`${row.id}: ${shared.gap} has no shared reading`);
    return {verb: shared.verb, object: shared.object, target: HP_TARGET_OF[row.truth.target] ?? 'bound', time: HP_TIME_OF[shared.time] ?? shared.time,
        carrier: 'spoken-spell', cost: 'stamina', limits: []};
}
/** Coverage case for a spellbook row id (shape: scripts/coverage_report.mjs header). */
export function coverageCase(id) {
    const row = ROWS.get(id), scene = HP_CASE_SCENES[id];
    if (!row) throw Error(`hp_effect_pack: ${id} is not a Hogwarts spell row`);
    if (!scene) throw Error(`hp_effect_pack: ${id} has no case scene`);
    return {basis: 'authored', world: {clock: 0, holders: structuredClone(scene.holders)}, sentence: caseSentence(row),
        details: structuredClone(scene.details), keys: {...HP_KEYS},
        cause: `hp-case:${id}`, expect: structuredClone(scene.expect)};
}
export const HP_CASE_MODULE = 'src/world_packs/hp_effect_pack.js';
