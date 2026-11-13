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
import {AIRWAY_OBSTRUCTION, sentenceFromIntent, sharedEffect, speechObstruction} from '../spell_effects.js';
import {voiceBlocker} from '../world_effects.js';
import {labelSpellRow} from '../spell_grammar.js';
import {HP_SPELL_ROWS, HP_SPELL_WORLD} from '../spell_pack_hogwarts.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../world_quantities.js';
import {applyEngineOps, fireEngineStored, storeEngineWorking} from '../engine_world.js';
import {linkExits, linkNeighbours, worldLinks} from '../world_substrate.js';
import {KNOWLEDGE_KINDS, recordsOf} from '../knowledge_record.js';
import {brewDoseQuantity} from '../engine_brew_stock.js';
import {latestEmptyAssay} from '../spell_law.js';
import {HP_PRIMITIVE_SCENES} from './hp_primitive_case_scenes.js';
import {HP_MIND_SCENES} from './hp_mind_case_scenes.js';
import {HP_WORKING_INFO_SCENES, HP_WORKING_END_SCENES} from './hp_working_info_case_scenes.js';
import {BREATHING_PACK} from '../world_substrate_packs/breathing.js';

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
    ...HP_MIND_SCENES,
    ...HP_WORKING_INFO_SCENES,
    ...HP_WORKING_END_SCENES,
    anapneo: {seen: 'the patient can speak again after the obstruction clears', build: anapneoCase},
    portkey: {seen: 'the kettle acquires a destination without moving anyone', build: portkeyCase},
    perimeter: {seen: 'the shield covers people currently inside the camp', build: perimeterCase},
    salvio: {seen: 'the camp ward intercepts a mind-binding spell aimed at an occupant', build: campWardsCase},
    cave: {seen: 'an uninvited arrival sounds a warning inside the camp', build: campWardsCase},
    aparecium: {seen: 'ordinary hidden ink becomes readable while the diary stays closed', build: apareciumCase},
    bedazzling: {seen: 'a watcher can no longer see the person wearing the enchanted cloak', build: bedazzlingCase},
    'jelly-legs': {seen: 'the unsteady target cannot complete a cast that needs planted footing', build: jellyLegsCase},
    waterproof: {seen: 'the treated lenses shed water while ordinary lenses collect it', build: waterproofCase},
    fire: {seen: 'the hearth warms enough to trip the heat signal', build: incendioCase},
    brake: {seen: 'the fall slows and the falling person lands safely', build: brakingCase},
    'flame-freezing': {seen: 'the protected caster crosses flames without accumulating burns', build: flameFreezingCase},
    erecto: {seen: 'the canvas becomes a standing tent at the campsite', build: erectoCase},
    extension: {seen: 'the bag gains usable interior space', build: extensionCase},
    fidelius: {seen: 'a keeper becomes responsible for disclosing the refuge', build: fideliusCase},
    taboo: {seen: 'the spoken name exposes the camp and breaks its selected protection', build: tabooCase},
    trace: {seen: 'the official receives a report of magic near a monitored pupil', build: traceCase},
    protean: {seen: 'linked coins copy a changed meeting inscription', build: proteanCase},
    'properties-reveal': {seen: 'the caster learns the ingredients of the sample', build: inspectCompositionCase},
    'obliterate-trace': {seen: 'the selected snow trail disappears', build: obliterateTraceCase},
    oppugno: {seen: 'the commanded bird flies at and strikes the chosen victim', build: oppugnoCase},
    patronus: {seen: 'a formed guardian drives the approaching Dementor away', build: patronusCase},
    'bubble-head': {seen: 'the diver keeps a breath reserve underwater until the bubble expires', build: bubbleHeadCase},
    fiendfyre: {seen: 'cursed fire spreads into the next fuel pile and destroys a crossing', build: fiendfyreCase},
    'wand-history': {seen: 'a wand projects a visible echo of its earlier spell', build: wandHistoryCase},
    alarm: {seen: 'an arrival in the protected place after dark triggers an audible alarm', build: alarmCase},
    point: {seen: 'the wand turns to point north',
        holders: [room('maze'), {id: 'wand', kind: 'thing', place: 'maze', properties: {bearing: 'west'}}],
        engine: {shared: {properties: [{id: 'bearing', type: 'label'}]}},
        details: {target: at('wand'), properties: {bearing: 'north'}},
        expect: [{holder: 'wand', property: 'bearing', direction: 'changed', to: 'north'}]},
    revive: {
        seen: 'a stunned person becomes responsive when that stun is ended',
        holders: [room('arena'), {id: 'subject', kind: 'body', place: 'arena', properties: {mind_awake: false},
            state: {'a.mind': {mind_awake: {base: true, layers: [{
                key: 'stun-hold', working: 'stun-hold', until: 3, change: {value: false},
            }]}}}}],
        engine: {packs: ['a.mind']},
        details: {target: at('subject'), place: 'arena', working: 'stun-hold', mind: {faculty: 'awareness'}},
        expect: [{holder: 'subject', property: 'mind_awake', direction: 'changed', to: true}],
    },
    // B5 p2106: the potion disappears from the cauldron.
    vanish: {
        seen: 'the cauldron is emptied of potion',
        holders: [room('classroom'), {id: 'cauldron', kind: 'thing', place: 'classroom', quantities: {'stock:potion': 20}}],
        details: {target: at('cauldron'), quantity: 'stock:potion', amount: 20},
        expect: [{holder: 'cauldron', quantity: 'stock:potion', direction: 'down', amount: 20, to: 0}],
    },
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
export const HP_CASE_LEFT_OUT = Object.freeze({});

const ROWS = new Map(HP_SPELL_ROWS.map(r => [r.id, r]));
/** The row's truth as a sentence of the shared grammar, in this world's carrier and cost. */
export function caseSentence(row) {
    const shared = sharedEffect(row.truth);
    if (shared.gap) throw Error(`${row.id}: ${shared.gap} has no shared reading`);
    return {verb: shared.verb, object: shared.object, target: HP_TARGET_OF[row.truth.target] ?? 'bound', time: HP_TIME_OF[shared.time] ?? shared.time,
        carrier: 'spoken-spell', cost: 'stamina', limits: []};
}

const portkeyMark = 'portkey:';
const timedPortkeyMark = 'timed-portkey:';
const portkeyId = carrier => `hp.portkey.${carrier}`;
const portkeyGripPrefix = 'portkey-grip:';

export const HP_PORTKEY_GRIPS = {
    id: 'hp.portkey_grips', revision: 1,
    reads: ['marks'], writes: ['marks'], hears: ['departed', 'arrived'],
    reactors: [{
        id: 'separated', on: ['departed', 'arrived'], appliesTo: holder => holder.kind === 'body',
        react(view, id, event) {
            const marks = view.property(id, 'marks') ?? [];
            // React at both ends. A moving body receives its arrival, while
            // the people left behind receive the carrier's departure.
            const remaining = marks.filter(mark => !mark.startsWith(portkeyGripPrefix) ||
                (event.by !== id && event.by !== mark.slice(portkeyGripPrefix.length)));
            return remaining.length === marks.length ? [] :
                [{op: 'property', holder: id, property: 'marks', value: remaining}];
        },
    }],
};

export function portkeyCast({caster, wand, carrier, destination, departure}) {
    if (departure !== undefined && (!Number.isSafeInteger(departure) || departure < 0))
        throw Error('A Portkey departure needs a whole world minute.');
    const mark = departure === undefined ? portkeyMark + destination
        : timedPortkeyMark + JSON.stringify([destination, departure]);
    return {sentence: sentenceFromIntent(labelSpellRow(ROWS.get('portkey'), HP_SPELL_WORLD).parts),
        target: {id: carrier}, grip: {caster, implement: wand}, contact: {links: 0},
        requiresSpeech: true, minutes: 1, details: {mark, cost: 2}};
}

function portkeyDestination(object) {
    const marks = object?.properties.marks?.filter(mark =>
        mark.startsWith(portkeyMark) || mark.startsWith(timedPortkeyMark)) ?? [];
    if (marks.length !== 1) return [];
    const [mark] = marks;
    if (mark.startsWith(portkeyMark)) return [mark.slice(portkeyMark.length)];
    try {
        const value = JSON.parse(mark.slice(timedPortkeyMark.length));
        if (Array.isArray(value) && typeof value[0] === 'string' && Number.isSafeInteger(value[1]) && value[1] >= 0)
            return value;
    } catch {
        // A malformed mark does not arm the carrier.
    }
    return [];
}

function portkeyGrip(engine, traveler, carrier, holding) {
    const mark = portkeyGripPrefix + carrier;
    const marks = traveler.properties.marks ?? [];
    if (marks.includes(mark) === holding) return engine;
    return applyEngineOps(engine, [{op: 'property', holder: traveler.id, property: 'marks',
        value: holding ? [...marks, mark] : marks.filter(entry => entry !== mark)}], 'portkey-grip');
}

/** The scene calls this when a body grasps the object. The stored working
 * checks reach and owns the spent state. A timed departure reads live grips. */
export function touchPortkey(engine, {carrier, actor}) {
    const object = engine.world.holders[carrier];
    const traveler = engine.world.holders[actor];
    if (object?.kind !== 'thing' || traveler?.kind !== 'body') return engine;
    const [destination, departure] = portkeyDestination(object);
    if (engine.world.holders[destination]?.kind !== 'place') return engine;
    const id = portkeyId(carrier);
    const timed = departure !== undefined;
    if (timed && (engine.world.clock >= departure || traveler.place !== object.place)) return engine;
    if (timed && !engine.rules.packs.includes(HP_PORTKEY_GRIPS.id))
        throw Error('Timed Portkeys require the Hogwarts grip pack.');
    if (!Object.hasOwn(engine.records.stored, id)) {
        engine = storeEngineWorking(engine, {carrier, pulse: timed ? departure - engine.world.clock : 1, mode: 'once',
            trigger: timed ? {kind: 'time', at: departure} : {kind: 'touch'},
            effects: [{sentence: {verb: 'move', object: 'position'}, details: {to: destination,
                target: timed ? {shape: 'marked', mark: portkeyGripPrefix + carrier, place: '$place'} : at('$trigger')}}],
        }, {id, by: carrier});
    }
    if (timed) return portkeyGrip(engine, traveler, carrier, true);
    return fireEngineStored(engine, id, {stimulus: {kind: 'touch', by: actor}});
}

export function releasePortkey(engine, {carrier, actor}) {
    const traveler = engine.world.holders[actor];
    return traveler?.kind === 'body' ? portkeyGrip(engine, traveler, carrier, false) : engine;
}

function portkeyCase() {
    const armed = {holder: 'kettle', property: 'marks', direction: 'changed', to: ['portkey:office']};
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 3};
    const stayed = {holder: 'caster', position: true, direction: 'unchanged', to: 'hall'};
    return {basis: 'authored', world: {clock: 0, holders: [room('hall'), room('office'),
        {id: 'caster', kind: 'body', place: 'hall', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'hall', properties: {marks: ['grip:caster']}},
        {id: 'kettle', kind: 'thing', place: 'hall', as: ['object'], properties: {marks: []}},
    ]}, engine: {shared: {quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
        host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'enchant', working: {family: 'spell', id: 'enchant', payer: 'caster', spells: [
            portkeyCast({caster: 'caster', wand: 'wand', carrier: 'kettle', destination: 'office'}),
        ]}},
        {id: 'restore', restore: true},
        {id: 'arm', advanceTo: 1, expect: [armed, paid, stayed]},
    ], expect: [armed, paid, stayed]};
}

/** Use the shelter at this site if its covering is pitched and present. */
export function enterTent(engine, {actor, canvas, interior}) {
    const traveler = engine.world.holders[actor];
    const cover = engine.world.holders[canvas];
    if (traveler?.kind !== 'body' || cover?.kind !== 'thing' || cover.place !== traveler.place ||
        cover.properties.form !== 'pitched-tent' || !linkExits(worldLinks(engine.world), traveler.place,
            {kinds: ['tent-entry']}).some(exit => exit.link === `tent-entry.${canvas}` && exit.to === interior)) return engine;
    return applyEngineOps(engine, [{op: 'move', holder: actor, to: interior}], 'enter-tent');
}

function containerAccess(engine, {actor, container, item}) {
    const holders = engine.world.holders;
    const body = holders[actor], bag = holders[container], cargo = holders[item];
    if (body?.kind !== 'body' || bag?.kind !== 'thing' || cargo?.kind !== 'thing' || container === item ||
        bag.place !== body.place || bag.properties.interior_closed) return null;
    // Earlier fixture saves describe the interior with a link. Its origin
    // does not determine access once the bag itself has moved.
    const oldEntry = worldLinks(engine.world).find(link => link.id === 'container-entry.' + container &&
        link.kind === 'container-entry');
    const interior = bag.properties.interior_place ?? (oldEntry?.state === 'open' ? oldEntry.to : null);
    if (holders[interior]?.kind !== 'place' || interior === bag.place) return null;
    return {bag, cargo, interior};
}

/** Stow a reachable item through the opening at the container's current place. */
export function stowInExtendedContainer(engine, selection) {
    const access = containerAccess(engine, selection);
    if (!access) return engine;
    const {bag, cargo, interior} = access;
    const size = cargo.properties.bulk;
    if (cargo.place !== bag.place || !Number.isSafeInteger(size) || size <= 0 ||
        !Number.isSafeInteger(bag.properties.interior_capacity)) return engine;
    const used = Object.values(engine.world.holders).filter(holder => holder.place === interior)
        .reduce((total, holder) => total + (holder.properties.bulk ?? 0), 0);
    if (used + size > bag.properties.interior_capacity) return engine;
    return applyEngineOps(engine, [{op: 'move', holder: cargo.id, to: interior}], 'stow-in-container');
}

export function retrieveFromExtendedContainer(engine, selection) {
    const access = containerAccess(engine, selection);
    if (!access || access.cargo.place !== access.interior) return engine;
    return applyEngineOps(engine, [{op: 'move', holder: access.cargo.id, to: access.bag.place}], 'retrieve-from-container');
}

const refugeRecord = place => `refuge:${place}`;
const refugeWard = (engine, place) => engine.world.laws.find(field => field.scope === place && field.kind === 'secret-refuge');
function knowsRefuge(engine, actor, place, keeper) {
    const record = recordsOf(engine.world, actor)[refugeRecord(place)];
    return record?.believed.value === place &&
        (actor === keeper || record.source.kind === 'instruction' && record.source.by === keeper);
}

export function discloseRefuge(engine, {actor, listener, place}) {
    const ward = refugeWard(engine, place);
    const keeper = engine.world.holders[actor], student = engine.world.holders[listener];
    if (ward?.params.keeper !== actor || keeper?.kind !== 'body' || keeper.properties.mind_awake !== true ||
        student?.kind !== 'body' || student.place !== keeper.place || !knowsRefuge(engine, actor, place, actor)) return engine;
    return applyEngineOps(engine, [{op: 'publish', kind: KNOWLEDGE_KINDS.teach, place: keeper.place, by: actor,
        detail: {knowledge: {from: actor, to: listener, record: refugeRecord(place), at: engine.world.clock}}}], 'disclose-refuge');
}

export function approachRefuge(engine, {actor, place}) {
    const traveler = engine.world.holders[actor];
    const ward = refugeWard(engine, place);
    if (traveler?.kind !== 'body' || (ward && !knowsRefuge(engine, actor, place, ward.params.keeper)) ||
        !linkNeighbours(worldLinks(engine.world), traveler.place, {kinds: ['path']}).includes(place)) return engine;
    return applyEngineOps(engine, [{op: 'move', holder: actor, to: place}], 'approach-refuge');
}

const inscription = 'coin_inscription';
const inscriptionLink = 'linked-inscription';
const warmUntil = 'coin_warm_until';

export const HP_PROTEAN_COINS = {
    id: 'hp.protean_coins', revision: 1, reads: [inscription], writes: [inscription, warmUntil],
    properties: [{id: warmUntil, type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER}],
    laws: [{
        id: 'copy-source', appliesTo: holder => holder.kind === 'thing' && holder.as.includes('coin'),
        decide(view, id) {
            const link = view.lawFields(id, inscriptionLink).find(field => field.scope === id);
            const source = link?.params.source;
            if (!source || source === id || !view.holder(source)?.as.includes('coin') ||
                view.lawFields(source, inscriptionLink).some(field => field.scope === source)) return [];
            const value = view.property(source, inscription);
            return value === view.property(id, inscription) ? [] :
                [{op: 'property', holder: id, property: inscription, value},
                    {op: 'property', holder: id, property: warmUntil, value: view.clock + 2}];
        },
    }],
};

/** The warmth is a tactile cue. The inscription is read separately. */
export function feelsMeetingCoin(engine, {actor, coin}) {
    const body = engine.world.holders[actor], token = engine.world.holders[coin];
    return body?.kind === 'body' && token?.kind === 'thing' && token.as.includes('coin') &&
        body.place === token.place && (token.properties.marks ?? []).includes(`grip:${actor}`) &&
        (token.properties[warmUntil] ?? 0) > engine.world.clock;
}

/** Read a local coin, then use its meeting code to take a known route. */
export function answerMeetingCoin(engine, {actor, coin, meetings}) {
    const traveler = engine.world.holders[actor], token = engine.world.holders[coin];
    if (traveler?.kind !== 'body' || token?.kind !== 'thing' || !token.as.includes('coin') ||
        traveler.place !== token.place) return engine;
    const destination = meetings.find(meeting => meeting.code === token.properties[inscription])?.place;
    if (!linkNeighbours(worldLinks(engine.world), traveler.place, {kinds: ['path']}).includes(destination)) return engine;
    return applyEngineOps(engine, [{op: 'move', holder: actor, to: destination}], 'answer-meeting-coin');
}

function proteanCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('protean'), HP_SPELL_WORLD).parts);
    const coin = (id, place) => ({id, kind: 'thing', as: ['object', 'coin'], place, properties: {[inscription]: 'old'}});
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 3};
    const inscriptionAt = (holder, direction, to) => ({holder, property: inscription, direction, to});
    const copy = inscriptionAt('copy', 'changed', 'tonight');
    const plain = inscriptionAt('plain', 'unchanged', 'old');
    const linked = fieldChanged('meeting-link', 'copy', inscriptionLink, {source: 'master'});
    return {basis: 'authored', world: {clock: 0, holders: [room('hall'), room('dormitory'), room('meeting'),
        coin('master', 'hall'), coin('copy', 'hall'), coin('plain', 'dormitory'),
        {id: 'member', kind: 'body', place: 'dormitory'},
        {id: 'caster', kind: 'body', place: 'hall', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'hall', properties: {marks: ['grip:caster']}},
    ], links: [{id: 'meeting-path', kind: 'path', from: 'dormitory', to: 'meeting'}]},
    engine: {packs: [HP_PROTEAN_COINS.id], shared: {
        properties: [...Object.values(WORLD_PROPERTIES), {id: inscription, type: 'label'}],
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}],
    }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}}, timeline: [
        {id: 'link-coin', working: {family: 'spell', id: 'link-coin', payer: 'caster', spells: [{sentence,
            target: {id: 'copy'}, grip: {caster: 'caster', implement: 'wand'}, contact: {links: 0},
            minutes: 1, details: {field: 'meeting-link', kind: inscriptionLink, params: {source: 'master'}, cost: 2},
        }]}},
        {id: 'restore-cast', restore: true},
        {id: 'bind', advanceTo: 1, expect: [linked, paid]},
        {id: 'distribute', ops: [{op: 'move', holder: 'copy', to: 'dormitory'},
            {op: 'property', holder: 'copy', property: 'marks', value: ['grip:member']}]},
        {id: 'announce', ops: [{op: 'property', holder: 'master', property: inscription, value: 'tonight'}]},
        {id: 'restore-announcement', restore: true},
        {id: 'relay', advanceTo: 2, expect: [copy, plain, {holder: 'copy', property: warmUntil, direction: 'changed', to: 4}]},
    ], expect: [linked, paid, copy, plain]};
}

const spokenName = 'hp.name-spoken';

function canSpeak(world, body) {
    return body?.kind === 'body' && body.properties.mind_awake === true &&
        !speechObstruction(body.properties, !!voiceBlocker(world, body.id));
}

const passageRequest = 'hp.passage-request';

export const HP_LANGUAGE_PASSAGE = {
    id: 'hp.language_passage', revision: 1, hears: [passageRequest], publishes: [passageRequest],
    reactors: [{
        id: 'hear-request', on: [passageRequest], appliesTo: holder => holder.as.includes('language-receiver'),
        react(view, id, event) {
            const {receiver, language, phrase, clarity} = event.detail ?? {};
            if (id !== receiver || view.holder(event.by)?.kind !== 'body' || view.placeOf(event.by) !== event.place) return [];
            const key = view.lawFields(id, 'language-key').find(field => field.scope === id);
            if (!key || key.params.language !== language || key.params.phrase !== phrase ||
                !Number.isSafeInteger(clarity) || clarity < key.params.minClarity || clarity > 100) return [];
            const link = view.links().find(link => link.id === key.params.link && link.from === event.place);
            return link?.state === 'closed' ? [{op: 'link_set', id: link.id, state: 'open'}] : [];
        },
    }],
};

/** The caller supplies the utterance the speaker actually produced. */
export function requestLanguagePassage(engine, {actor, receiver, language, phrase, clarity}) {
    const body = engine.world.holders[actor];
    if (!canSpeak(engine.world, body) || engine.world.holders[receiver]?.place !== body.place ||
        typeof language !== 'string' || typeof phrase !== 'string' ||
        !Number.isSafeInteger(clarity) || clarity < 0 || clarity > 100) return engine;
    return applyEngineOps(engine, [{op: 'publish', kind: passageRequest, place: body.place, by: actor,
        detail: {receiver, language, phrase, clarity}}], 'ask-passage-to-open');
}

export function enterLanguagePassage(engine, {actor, destination}) {
    const body = engine.world.holders[actor];
    if (body?.kind !== 'body' ||
        !linkNeighbours(worldLinks(engine.world), body.place, {kinds: ['language-passage']}).includes(destination)) return engine;
    return applyEngineOps(engine, [{op: 'move', holder: actor, to: destination}], 'cross-language-passage');
}

export const HP_TABOO = {
    id: 'hp.taboo', revision: 1, hears: [spokenName], publishes: [spokenName, KNOWLEDGE_KINDS.learn],
    reactors: [{
        id: 'detect-name', on: [spokenName], appliesTo: holder => holder.kind === 'place',
        react(view, id, event) {
            const taboo = view.lawFields(id, 'name-taboo').find(field => field.scope === id &&
                field.params.name === event.detail?.name);
            if (!taboo) return [];
            const {listener, protection} = taboo.params;
            const ops = [];
            if (view.lawFields(id, 'conceal').some(field => field.scope === id && field.id === protection))
                ops.push({op: 'law_remove', id: protection});
            if (view.holder(listener)?.kind === 'body') {
                const record = `taboo:${id}:${event.seq}`;
                ops.push({op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: view.placeOf(listener), by: listener,
                    detail: {knowledge: {to: listener, record: {id: record, subject: {kind: 'fact', id: record},
                        true: {holder: id, property: 'name_location'}, believed: {value: id},
                        source: {kind: 'observation', by: listener, at: view.clock}}}}});
            }
            return ops;
        },
    }],
};

export function speakTabooName(engine, {actor, name}) {
    const body = engine.world.holders[actor];
    if (!canSpeak(engine.world, body) || typeof name !== 'string' || !name) return engine;
    return applyEngineOps(engine, [{op: 'publish', kind: spokenName, place: body.place, by: actor,
        detail: {name}}], 'say-name');
}

export function followTabooReport(engine, {actor, record}) {
    if (typeof record !== 'string' || !record.startsWith('taboo:')) return engine;
    const report = recordsOf(engine.world, actor)[record];
    const destination = report?.believed.value;
    const body = engine.world.holders[actor];
    if (body?.kind !== 'body' || report?.true.property !== 'name_location' ||
        !linkNeighbours(worldLinks(engine.world), body.place, {kinds: ['path']}).includes(destination)) return engine;
    return applyEngineOps(engine, [{op: 'move', holder: actor, to: destination}], 'follow-taboo-report');
}

export const HP_TRACE = {
    id: 'hp.trace', revision: 1, hears: ['effect.move'], publishes: [KNOWLEDGE_KINDS.learn],
    reactors: [{
        id: 'detect-hover', on: ['effect.move'], appliesTo: holder => holder.kind === 'body',
        react(view, pupil, event) {
            if (typeof event.cause !== 'string' || !event.cause.startsWith('working:') ||
                event.detail?.object !== 'position') return [];
            const trace = view.lawFields(pupil, 'underage-trace').find(field => field.scope === pupil &&
                (field.until == null || field.until > view.clock));
            const official = trace?.params.official;
            if (!official || view.holder(official)?.kind !== 'body') return [];
            const id = `trace:${pupil}:${event.seq}`;
            return [{op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: view.placeOf(official), by: official,
                detail: {knowledge: {to: official, record: {id, subject: {kind: 'fact', id},
                    true: {holder: event.place, property: 'trace_location'}, believed: {value: event.place},
                    source: {kind: 'observation', by: official, at: view.clock}}}}}];
        },
    }],
};

/** The official can request a visit using the report without assigning blame. */
export function investigateTrace(engine, {official, report}) {
    if (typeof report !== 'string' || !report.startsWith('trace:')) return engine;
    const record = recordsOf(engine.world, official)[report];
    const body = engine.world.holders[official];
    const destination = record?.believed.value;
    if (body?.kind !== 'body' || record?.true.property !== 'trace_location' ||
        !linkNeighbours(worldLinks(engine.world), body.place, {kinds: ['path']}).includes(destination)) return engine;
    return applyEngineOps(engine, [{op: 'move', holder: official, to: destination}], 'investigate-trace');
}

function traceCase() {
    const sentence = id => sentenceFromIntent(labelSpellRow(ROWS.get(id), HP_SPELL_WORLD).parts);
    const params = {official: 'official'};
    const paid = {holder: 'installer', quantity: 'stamina', direction: 'down', to: 3};
    const monitored = fieldChanged('trace', 'pupil', 'underage-trace', params, 5);
    const moved = {holder: 'dish', position: true, direction: 'changed', to: 'ledge'};
    const notice = {holder: 'official', property: 'mind_memory', direction: 'changed'};
    return {basis: 'authored', world: {clock: 0, holders: [
        {...room('kitchen'), properties: {trace_location: 'kitchen'}}, room('office'), room('ledge'),
        {id: 'installer', kind: 'body', place: 'kitchen', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'kitchen', properties: {marks: ['grip:installer']}},
        {id: 'pupil', kind: 'body', place: 'kitchen'},
        {id: 'official', kind: 'body', place: 'office', properties: {mind_awake: true, mind_memory: []}},
        {id: 'visitor', kind: 'body', place: 'kitchen'},
        {id: 'dish', kind: 'thing', as: ['object'], place: 'kitchen'},
    ], links: [{id: 'visit', kind: 'path', from: 'office', to: 'kitchen'}]},
    engine: {packs: ['a.mind', 'n.knowledge', HP_TRACE.id], shared: {
        properties: [...Object.values(WORLD_PROPERTIES).filter(p => !['senses', 'concealed'].includes(p.id)),
            {id: 'trace_location', type: 'label'}],
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}],
    }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}}, timeline: [
        {id: 'install', working: {family: 'spell', payer: 'installer', spells: [{
            sentence: sentence('trace'), target: {id: 'pupil'}, grip: {caster: 'installer', implement: 'wand'},
            contact: {links: 0}, minutes: 1, details: {field: 'trace', kind: 'underage-trace', params, minutes: 4, cost: 2},
        }]}},
        {id: 'arm', advanceTo: 1, expect: [paid, monitored]},
        {id: 'restore-trace', restore: true},
        {id: 'hover', working: {family: 'spell', payer: 'visitor', spells: [{
            sentence: sentence('levitation'), target: {id: 'dish'}, minutes: 1, details: {target: at('dish'), to: 'ledge'},
        }]}},
        {id: 'restore-hover', restore: true},
        {id: 'detect', advanceTo: 2, expect: [moved, notice]},
    ], expect: [paid, monitored, moved, notice]};
}

function tabooCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('taboo'), HP_SPELL_WORLD).parts);
    const params = {name: 'Voldemort', listener: 'watcher', protection: 'camp-screen'};
    const field = fieldChanged('taboo', 'camp', 'name-taboo', params);
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 3};
    const broken = {lawField: 'camp-screen', direction: 'changed', to: null};
    return {basis: 'authored', world: {clock: 0, holders: [
        {...room('camp'), properties: {name_location: 'camp'}}, room('lookout'),
        {id: 'caster', kind: 'body', place: 'camp', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'camp', properties: {marks: ['grip:caster']}},
        {id: 'speaker', kind: 'body', place: 'camp', properties: {mind_awake: true}},
        {id: 'watcher', kind: 'body', place: 'lookout', properties: {mind_awake: true, mind_memory: []}},
    ], lawFields: [{id: 'camp-screen', scope: 'camp', kind: 'conceal', params: {channel: 'sight'}},
        {id: 'sound-screen', scope: 'camp', kind: 'conceal', params: {channel: 'sound'}}],
    links: [{id: 'track', kind: 'path', from: 'lookout', to: 'camp'}]},
    engine: {packs: ['a.mind', 'n.knowledge', HP_TABOO.id], shared: {
        properties: [...Object.values(WORLD_PROPERTIES).filter(p => !['senses', 'concealed'].includes(p.id)),
            {id: 'name_location', type: 'label'}],
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}],
    }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}}, timeline: [
        {id: 'cast', working: {family: 'spell', id: 'taboo', payer: 'caster', spells: [{sentence,
            target: {id: 'camp'}, grip: {caster: 'caster', implement: 'wand'}, contact: {links: 0}, minutes: 1,
            details: {field: 'taboo', kind: 'name-taboo', params, cost: 2},
        }]}},
        {id: 'restore-cast', restore: true},
        {id: 'arm', advanceTo: 1, expect: [field, paid]},
        {id: 'restore-taboo', restore: true},
        {id: 'name', ops: [{op: 'publish', kind: spokenName, place: 'camp', by: 'speaker', detail: {name: params.name}}],
            expect: [broken, {holder: 'watcher', property: 'mind_memory', direction: 'changed'}]},
    ], expect: [field, paid, broken]};
}

function fideliusCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('fidelius'), HP_SPELL_WORLD).parts);
    const record = refugeRecord('refuge');
    const paid = {holder: 'keeper', quantity: 'stamina', direction: 'down', to: 3};
    const protectedPlace = fieldChanged('refuge-ward', 'refuge', 'secret-refuge', {keeper: 'keeper'});
    return {basis: 'authored', world: {clock: 0, holders: [room('approach'),
        {...room('refuge'), properties: {refuge_address: 'refuge'}}, room('lane'),
        {id: 'keeper', kind: 'body', place: 'approach', quantities: {stamina: 5},
            properties: {mind_awake: true, mind_memory: [record]}, state: {'n.knowledge': {records: {[record]: {
                id: record, subject: {kind: 'fact', id: record}, true: {holder: 'refuge', property: 'refuge_address'},
                believed: {value: 'refuge'}, source: {kind: 'recollection'}, doubts: [], checks: [],
            }}}}},
        {id: 'guest', kind: 'body', place: 'approach', properties: {mind_awake: true, mind_memory: []}},
        {id: 'stranger', kind: 'body', place: 'approach', properties: {mind_awake: true, mind_memory: []}},
        {id: 'wand', kind: 'thing', place: 'approach', properties: {marks: ['grip:keeper']}},
    ], links: [{id: 'path', kind: 'path', from: 'approach', to: 'refuge'}]},
    engine: {packs: ['a.mind', 'n.knowledge'], shared: {
        properties: [...Object.values(WORLD_PROPERTIES).filter(p => !['senses', 'concealed'].includes(p.id)),
            {id: 'refuge_address', type: 'label'}],
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}],
    }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}}, timeline: [
        {id: 'conceal', working: {family: 'spell', id: 'conceal', payer: 'keeper', spells: [{sentence,
            target: {id: 'refuge'}, grip: {caster: 'keeper', implement: 'wand'}, contact: {links: 1, kinds: ['path']},
            minutes: 1, details: {field: 'refuge-ward', kind: 'secret-refuge', params: {keeper: 'keeper'}, cost: 2},
        }]}},
        {id: 'restore-cast', restore: true},
        {id: 'settle', advanceTo: 1, expect: [protectedPlace, paid]},
    ], expect: [protectedPlace, paid]};
}

function extensionCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('extension'), HP_SPELL_WORLD).parts);
    const expanded = {holder: 'bag', property: 'interior_capacity', direction: 'changed', to: 7};
    const exterior = {holder: 'bag', property: 'bulk', direction: 'unchanged', to: 2};
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 3};
    return {basis: 'authored', world: {clock: 0, holders: [room('camp'), room('bag-interior'), room('corridor'),
        {id: 'bag', kind: 'thing', as: ['object'], place: 'camp',
            properties: {interior_capacity: 2, interior_place: 'bag-interior', bulk: 2}},
        {id: 'books', kind: 'thing', place: 'camp', properties: {bulk: 4}},
        {id: 'blanket', kind: 'thing', place: 'camp', properties: {bulk: 4}},
        {id: 'caster', kind: 'body', place: 'camp', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'camp', properties: {marks: ['grip:caster']}},
    ]},
    engine: {shared: {properties: [...Object.values(WORLD_PROPERTIES),
        {id: 'interior_place', type: 'label'}, {id: 'interior_closed', type: 'flag'},
        {id: 'interior_capacity', type: 'level', min: 0, max: 100}, {id: 'bulk', type: 'level', min: 0, max: 100}],
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
    host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'extend', working: {family: 'spell', id: 'extend', payer: 'caster', spells: [{sentence,
            target: {id: 'bag'}, grip: {caster: 'caster', implement: 'wand'}, contact: {links: 0}, minutes: 1,
            requiresSpeech: true, details: {properties: {interior_capacity: 7}, cost: 2},
        }]}},
        {id: 'restore-cast', restore: true},
        {id: 'release', advanceTo: 1, expect: [expanded, exterior, paid]},
    ], expect: [expanded, exterior, paid]};
}

function erectoCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('erecto'), HP_SPELL_WORLD).parts);
    const pitched = {holder: 'canvas', property: 'form', direction: 'changed', to: 'pitched-tent'};
    const grounded = {holder: 'canvas', position: true, direction: 'unchanged', to: 'clearing'};
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 4};
    return {basis: 'authored', world: {clock: 0, holders: [room('clearing'), room('tent-interior'),
        {id: 'canvas', kind: 'thing', as: ['object'], place: 'clearing', properties: {form: 'folded-canvas'}},
        {id: 'caster', kind: 'body', place: 'clearing', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'clearing', properties: {marks: ['grip:caster']}},
    ], links: [{id: 'tent-entry.canvas', kind: 'tent-entry', from: 'clearing', to: 'tent-interior'}]},
    engine: {packs: ['w.sky'], shared: {quantities: [...Object.values(WORLD_QUANTITIES),
        {id: 'stamina', unit: 'effort', min: 0, max: 5}]}, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'pitch', working: {family: 'spell', id: 'pitch', payer: 'caster', spells: [{sentence,
            target: {id: 'canvas'}, grip: {caster: 'caster', implement: 'wand'}, contact: {links: 0},
            requiresSpeech: true, minutes: 1, details: {value: 'pitched-tent', cost: 1},
        }]}},
        {id: 'restore', restore: true},
        {id: 'release', advanceTo: 1, expect: [pitched, grounded, paid]},
    ], expect: [pitched, grounded, paid]};
}

function descentRate(view, id) {
    const rates = view.lawFields(id, 'braked-descent').filter(field => field.scope === id)
        .map(field => field.params.rate).filter(rate => Number.isSafeInteger(rate) && rate > 0);
    return Math.min(4, ...rates);
}

function bedazzlingCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('bedazzling'), HP_SPELL_WORLD).parts);
    const contact = (direction, to) => ({holder: 'watcher', property: 'sensed-presence', direction, to});
    const cost = {holder: 'enchanter', quantity: 'stamina', direction: 'down', to: 3};
    const lookout = {holder: 'watcher', property: 'sensed-presence', direction: 'changed', to: ['hall:sight']};
    const look = (id, channel, expect) => ({id, by: 'watcher', sentence: {verb: 'sense', object: 'information'},
        details: {target: at('traveller'), channel, presence: true, place: 'hall'}, expect});
    const wearer = value => ({op: 'property', holder: 'traveller', property: 'worn_cloak', value});
    return {basis: 'authored', world: {holders: [room('hall'), room('stairs'),
        {id: 'enchanter', kind: 'body', place: 'hall', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'hall', properties: {marks: ['grip:enchanter']}},
        {id: 'cloak', kind: 'thing', as: ['object'], place: 'hall'},
        {id: 'traveller', kind: 'body', place: 'hall', properties: {worn_cloak: 'cloak'}},
        {id: 'watcher', kind: 'body', place: 'hall', properties: {senses: ['sight', 'presence']}},
    ]}, engine: {packs: ['n.presence'], shared: {
        properties: [...Object.values(WORLD_PROPERTIES), {id: 'worn_cloak', type: 'label'}],
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}],
    }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}}, timeline: [
        {id: 'enchant', working: {family: 'spell', payer: 'enchanter', spells: [{
            sentence, target: {id: 'cloak'}, grip: {caster: 'enchanter', implement: 'wand'},
            contact: {links: 0}, minutes: 1,
            details: {field: 'cloak-hex', kind: 'wearer-conceal', params: {channel: 'sight'}, cost: 2, minutes: 4},
        }]}},
        {id: 'release', advanceTo: 1, expect: [cost]},
        {id: 'restore-cloak', restore: true},
        look('hidden', 'sight', [contact('unchanged', null)]),
        look('sense-presence', 'presence', [contact('changed', ['hall:presence'])]),
        {id: 'take-off-cloak', ops: [wearer(null)]},
        look('uncovered', 'sight', [contact('changed', ['hall:presence', 'hall:sight'])]),
        {id: 'clear-observations', ops: [{op: 'move', holder: 'watcher', to: 'stairs'}, {op: 'move', holder: 'watcher', to: 'hall'}]},
        {id: 'wear-again', ops: [wearer('cloak')]},
        look('hidden-again', 'sight', [contact('unchanged', [])]),
        {id: 'fade', advanceTo: 5, expect: [{lawField: 'cloak-hex', direction: 'changed', to: null}]},
        look('visible-again', 'sight', [lookout]),
    ], expect: [cost, lookout]};
}

function apareciumCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('aparecium'), HP_SPELL_WORLD).parts);
    const page = id => ({id, kind: 'thing', as: ['object'], place: 'library', properties: {concealed: ['ink', 'other']}});
    const concealed = (holder, direction, to) => ({holder, property: 'concealed', direction, to});
    const cost = to => ({holder: 'reader', quantity: 'stamina', direction: 'down', to});
    const cast = target => ({id: `try-${target}`, working: {family: 'spell', payer: 'reader', spells: [{
        sentence, target: {id: target}, grip: {caster: 'reader', implement: 'wand'},
        contact: {links: 0}, requiresSpeech: true, minutes: 1, details: {cost: 2},
    }]}});
    const unchanged = concealed('diary', 'unchanged', ['ink', 'other']);
    const revealed = concealed('note', 'changed', ['other']);
    return {basis: 'authored', world: {holders: [room('library'), page('diary'), page('note'),
        {id: 'reader', kind: 'body', place: 'library', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'library', properties: {marks: ['grip:reader']}},
    ], lawFields: [{id: 'diary-resistance', scope: 'diary', kind: 'block',
        params: {verb: 'release', object: 'spell-contact'}}]},
    engine: {shared: {quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
        host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        cast('diary'), {id: 'restore-diary-attempt', restore: true},
        {id: 'resisted', advanceTo: 1, expect: [unchanged, cost(3)]},
        cast('note'), {id: 'restore-note-attempt', restore: true},
        {id: 'released', advanceTo: 2, expect: [revealed, cost(1)]},
    ], expect: [unchanged, revealed, cost(1)]};
}

export const HP_CAMP_WARNING = {
    id: 'hp.camp-warning', revision: 1, reads: ['camp_invited'], writes: ['noise'],
    reactors: [{
        id: 'warn', on: ['arrived'], appliesTo: holder => holder.kind === 'place',
        react(view, id, event) {
            if (id !== event.place || view.holder(event.by)?.kind !== 'body' ||
                view.property(event.by, 'camp_invited') === true || !view.has(id, 'noise')) return [];
            if (!view.lawFields(id, 'camp-warning').some(field => field.scope === id)) return [];
            return [{op: 'add', holder: id, quantity: 'noise', amount: 3}];
        },
    }],
};

function campWardsCase() {
    const read = id => sentenceFromIntent(labelSpellRow(ROWS.get(id), HP_SPELL_WORLD).parts);
    const cast = (id, actor, spell, target, details, links = 0) => ({id, working: {family: 'spell', id, payer: actor,
        spells: [{sentence: read(spell), target: {id: target}, grip: {caster: actor, implement: `${actor}-wand`},
            requiresSpeech: true, minutes: 1, contact: {links}, details}]}});
    const body = (id, place, invited = false) => ({id, kind: 'body', as: ['creature'], place,
        properties: {camp_invited: invited, mind_awake: true}, quantities: {stamina: 8, vitality: 10}});
    const wand = (id, place) => ({id: `${id}-wand`, kind: 'thing', place, properties: {marks: [`grip:${id}`]}});
    const spent = (holder, to) => ({holder, quantity: 'stamina', direction: 'down', to});
    const warning = (direction, to) => ({holder: 'camp', quantity: 'noise', direction, to});
    const footing = (direction, to) => ({holder: 'keeper', property: 'mind_unsteady_footing', direction, to});
    const enter = (id, holder, place, expect) => ({id, ops: [
        {op: 'move', holder, to: place},
        ...(holder === 'intruder' ? [{op: 'move', holder: 'intruder-wand', to: place}] : []),
    ], expect});
    const jinx = id => cast(id, 'intruder', 'jelly-legs', 'keeper',
        {cost: 1, minutes: 4, mind: {faculty: 'footing'}}, 1);
    return {basis: 'authored', world: {holders: [
        room('camp'), room('trail'), body('keeper', 'camp', true), body('guest', 'trail', true),
        body('intruder', 'trail'), wand('keeper', 'camp'), wand('intruder', 'trail'),
    ], links: [{id: 'camp-edge', kind: 'path', from: 'trail', to: 'camp'}]},
    engine: {packs: ['a.mind', HP_CAMP_WARNING.id], shared: {
        properties: [{id: 'camp_invited', type: 'flag'}, WORLD_PROPERTIES.marks],
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 8}],
    }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}}, timeline: [
        cast('salvio', 'keeper', 'salvio', 'camp', {field: 'mind-screen', cost: 2, minutes: 5,
            params: {verb: 'bind', object: 'spell-contact', spellObject: 'mind'}}),
        {id: 'screen-up', advanceTo: 1, expect: [spent('keeper', 6)]},
        cast('cave', 'keeper', 'cave', 'camp', {field: 'camp-watch', kind: 'camp-warning', cost: 2, minutes: 4}),
        {id: 'watch-up', advanceTo: 2, expect: [spent('keeper', 4)]},
        {id: 'restore-warded-camp', restore: true},
        enter('guest-enters', 'guest', 'camp', [warning('unchanged', 0)]),
        enter('intruder-enters', 'intruder', 'camp', [warning('up', 3)]),
        jinx('first-jinx'),
        {id: 'intercept', advanceTo: 3, expect: [footing('unchanged', null), spent('intruder', 7)]},
        cast('cut', 'intruder', 'sectum', 'keeper', {amount: 2, cost: 1}, 1),
        {id: 'cut-lands', advanceTo: 4, expect: [{holder: 'keeper', quantity: 'vitality', direction: 'down', to: 8}]},
        enter('intruder-leaves', 'intruder', 'trail', [warning('unchanged', 3)]),
        {id: 'wards-expire', advanceTo: 6, expect: [
            {lawField: 'mind-screen', direction: 'changed', to: null}, {lawField: 'camp-watch', direction: 'changed', to: null},
        ]},
        {id: 'restore-unwarded-camp', restore: true},
        enter('intruder-returns', 'intruder', 'camp', [warning('unchanged', 3)]),
        jinx('second-jinx'),
        {id: 'jinx-lands', advanceTo: 7, expect: [footing('changed', true), spent('intruder', 5)]},
    ], expect: [spent('keeper', 4), spent('intruder', 5), warning('up', 3), footing('changed', true)]};
}

function perimeterCase() {
    const read = id => sentenceFromIntent(labelSpellRow(ROWS.get(id), HP_SPELL_WORLD).parts);
    const health = (holder, direction, to) => ({holder, quantity: 'vitality', direction, to});
    const stamina = (holder, to) => ({holder, quantity: 'stamina', direction: 'down', to});
    const body = (id, place) => ({id, kind: 'body', as: ['creature', 'self'], place,
        quantities: {vitality: 10, stamina: 8}});
    const wand = (actor, place) => ({id: `${actor}-wand`, kind: 'thing', place, properties: {marks: [`grip:${actor}`]}});
    const cast = (id, actor, spell, target, details, extra = {}) => ({id, working: {family: 'spell', id, payer: actor,
        spells: [{sentence: read(spell), target: {id: target}, grip: {caster: actor, implement: `${actor}-wand`},
            requiresSpeech: true, minutes: 1, details, ...extra}]}});
    const strike = (id, target) => cast(id, 'intruder', 'sectum', target, {amount: 2, cost: 1},
        {contact: {links: 1, kinds: ['sightline']}});
    return {basis: 'authored', world: {holders: [
        room('camp'), room('trail'), body('keeper', 'camp'), body('guest', 'trail'), body('intruder', 'trail'),
        wand('keeper', 'camp'), wand('intruder', 'trail'),
    ], links: [{id: 'edge', kind: 'sightline', from: 'trail', to: 'camp'}]},
    engine: {shared: {quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 8}]},
        host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        cast('ward', 'keeper', 'perimeter', 'camp', {field: 'camp-shield', cost: 2, minutes: 4,
            params: {verb: 'remove', object: 'spell-contact'}}),
        {id: 'restore-ward-cast', restore: true},
        {id: 'establish', advanceTo: 1, expect: [stamina('keeper', 6)]},
        {id: 'trade-places', ops: [{op: 'move', holder: 'keeper', to: 'trail'}, {op: 'move', holder: 'guest', to: 'camp'}]},
        {id: 'restore-occupants', restore: true},
        strike('at-guest', 'guest'),
        {id: 'inside', advanceTo: 2, expect: [health('guest', 'unchanged', 10), stamina('intruder', 7)]},
        strike('at-keeper', 'keeper'),
        {id: 'outside', advanceTo: 3, expect: [health('keeper', 'down', 8), stamina('intruder', 6)]},
        {id: 'lapse', advanceTo: 5, expect: [{lawField: 'camp-shield', direction: 'changed', to: null}]},
        strike('after-lapse', 'guest'),
        {id: 'uncovered', advanceTo: 6, expect: [health('guest', 'down', 8), stamina('intruder', 5)]},
    ], expect: [stamina('keeper', 6), stamina('intruder', 5), health('guest', 'down', 8), health('keeper', 'down', 8)]};
}

function jellyLegsCase() {
    const read = id => sentenceFromIntent(labelSpellRow(ROWS.get(id), HP_SPELL_WORLD).parts);
    const paid = (holder, to) => ({holder, quantity: 'stamina', direction: 'down', to});
    const footing = to => ({holder: 'student', property: 'mind_unsteady_footing', direction: 'changed', to});
    const guard = (id, planted) => ({id, working: {family: 'spell', id, payer: 'student', spells: [{
        sentence: read('shield'), target: {id: 'student'}, grip: {caster: 'student', implement: 'student-wand'},
        requiresFooting: planted, minutes: 1, details: {field: id, cost: 1, minutes: 2},
    }]}});
    const lamp = {holder: 'student-wand', quantity: 'light:wand', direction: 'up', to: 2};
    const body = id => ({id, kind: 'body', as: ['creature', 'self'], place: 'hall',
        properties: {mind_awake: true}, quantities: {stamina: 5}});
    return {basis: 'authored', world: {holders: [room('hall'), body('caster'), body('student'),
        {id: 'caster-wand', kind: 'thing', place: 'hall', properties: {marks: ['grip:caster']}},
        {id: 'student-wand', kind: 'thing', as: ['implement'], place: 'hall',
            properties: {marks: ['grip:student']}, quantities: {'light:wand': 0}},
    ]}, engine: {packs: ['a.mind'], shared: {
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}],
    }, host: {keys: HP_KEYS, costs: {accounts: {stamina: {quantity: 'stamina'}}}}}, timeline: [
        {id: 'jinx', working: {family: 'spell', id: 'jinx', payer: 'caster', spells: [{
            sentence: read('jelly-legs'), target: {id: 'student'}, grip: {caster: 'caster', implement: 'caster-wand'},
            contact: {links: 0}, requiresSpeech: true, minutes: 1, details: {minutes: 4, cost: 1, mind: {faculty: 'footing'}},
        }]}},
        {id: 'wobble', advanceTo: 1, expect: [footing(true), paid('caster', 4)]},
        {id: 'restore-jinx', restore: true},
        guard('planted', true),
        {id: 'stumble', advanceTo: 2, interruption: {working: 'planted', reason: 'The caster cannot plant their feet.'},
            expect: [{holder: 'student', quantity: 'stamina', direction: 'unchanged', to: 5}]},
        {id: 'light', working: {family: 'spell', id: 'light', payer: 'student', spells: [{
            sentence: read('light'), target: {id: 'student-wand'}, grip: {caster: 'student', implement: 'student-wand'},
            requiresSpeech: true, minutes: 1, details: {amount: 2, cost: 1},
        }]}},
        {id: 'can-light', advanceTo: 3, expect: [lamp, paid('student', 4)]},
        {id: 'recover', advanceTo: 5, expect: [footing(null)]},
        guard('recovered-shield', true),
        {id: 'can-guard', advanceTo: 6, expect: [paid('student', 3)]},
    ], expect: [lamp, paid('caster', 4), paid('student', 3)]};
}

function bubbleHeadCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('bubble-head'), HP_SPELL_WORLD).parts);
    const reserve = (direction, to) => ({holder: 'diver', quantity: 'breath', direction, to});
    const health = (direction, to) => ({holder: 'diver', quantity: 'vitality', direction, to});
    const paid = {holder: 'diver', quantity: 'stamina', direction: 'down', to: 3};
    return {basis: 'authored', world: {holders: [room('bank'), {...room('lake'), properties: {submerged: true}},
        {id: 'diver', kind: 'body', as: ['self'], place: 'bank', quantities: {breath: 3, vitality: 10, stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'bank', properties: {marks: ['grip:diver']}},
    ], links: [{id: 'shore', kind: 'path', from: 'bank', to: 'lake'}]},
    engine: {packs: [BREATHING_PACK.id, 'a.mind'],
        shared: {quantities: [...Object.values(WORLD_QUANTITIES),
            {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
        host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'cast', working: {family: 'spell', id: 'bubble', payer: 'diver', spells: [{
            sentence, target: {id: 'diver'}, grip: {caster: 'diver', implement: 'wand'}, minutes: 1,
            details: {field: 'bubble', kind: 'breathing-air', params: {}, minutes: 4, cost: 2},
        }]}},
        {id: 'restore-preparation', restore: true},
        {id: 'release', advanceTo: 1, expect: [paid, fieldChanged('bubble', 'diver', 'breathing-air', {}, 5)]},
        {id: 'dive', ops: [{op: 'property', holder: 'diver', property: 'agency_goal', value: 'lake'}]},
        {id: 'underwater', advanceTo: 2, expect: [{holder: 'diver', position: true, direction: 'changed', to: 'lake'}]},
        {id: 'restore-dive', restore: true},
        {id: 'expiry', advanceTo: 5, expect: [reserve('unchanged', 3), health('unchanged', 10),
            {lawField: 'bubble', direction: 'changed', to: null}]},
        {id: 'last-breath', advanceTo: 8, expect: [reserve('down', 0), health('unchanged', 10)]},
        {id: 'restore-no-air', restore: true},
        {id: 'stay-under', advanceTo: 9, expect: [health('down', 9)]},
        {id: 'return', ops: [{op: 'property', holder: 'diver', property: 'agency_goal', value: 'bank'}]},
        {id: 'surface', advanceTo: 12, expect: [reserve('up', 2),
            {holder: 'diver', position: true, direction: 'changed', to: 'bank'}]},
    ], expect: [paid, reserve('down', 2), health('down', 8)]};
}

export const HP_DESCENT = {
    id: 'hp.descent', revision: 1, reads: ['height', 'vitality'], writes: ['height', 'vitality'],
    laws: [{
        id: 'fall', appliesTo: holder => holder.kind === 'body' && holder.as.includes('falling') &&
            Object.hasOwn(holder.quantities, 'height') && Object.hasOwn(holder.quantities, 'vitality'),
        rates: (view, id) => view.placeOf(id) === 'air' && view.amount(id, 'height') > 0
            ? [{holder: id, quantity: 'height', perMinute: -descentRate(view, id)}] : [],
        watches: (_view, id) => [{holder: id, quantity: 'height', op: 'lte', value: 0}],
        horizon: () => Infinity,
        advance(view, id, minutes) {
            const height = view.amount(id, 'height');
            const rate = descentRate(view, id);
            return view.placeOf(id) === 'air' && height > 0 && height <= rate * minutes && rate > 1
                ? [{op: 'add', holder: id, quantity: 'vitality', amount: 1 - rate}] : [];
        },
        decide: (view, id) => view.placeOf(id) === 'air' && view.amount(id, 'height') === 0
            ? [{op: 'move', holder: id, to: 'ground'}] : [],
    }],
};

function brakingCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('brake'), HP_SPELL_WORLD).parts);
    const height = (direction, to) => ({holder: 'rider', quantity: 'height', direction, to});
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 4};
    const landed = {holder: 'rider', position: true, direction: 'changed', to: 'ground'};
    const safe = {holder: 'rider', quantity: 'vitality', direction: 'unchanged', to: 10};
    return {basis: 'authored', world: {clock: 0, holders: [room('air'), room('ground'),
        {id: 'rider', kind: 'body', as: ['falling'], place: 'air', quantities: {height: 8, vitality: 10}},
        {id: 'caster', kind: 'body', place: 'ground', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'ground', properties: {marks: ['grip:caster']}},
    ], links: [{id: 'aim', kind: 'sightline', from: 'ground', to: 'air'}]},
    engine: {packs: [HP_DESCENT.id], shared: {quantities: [...Object.values(WORLD_QUANTITIES),
        {id: 'height', unit: 'height unit', min: 0, max: 100}, {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
        host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'brake', working: {family: 'spell', id: 'brake', payer: 'caster', spells: [{sentence,
            target: {id: 'rider'}, grip: {caster: 'caster', implement: 'wand'}, contact: {links: 1, kinds: ['sightline']},
            minutes: 1, details: {field: 'brake', kind: 'braked-descent', params: {rate: 1}, minutes: 5, cost: 1},
        }]}},
        {id: 'restore-cast', restore: true},
        {id: 'release', advanceTo: 1, expect: [height('down', 4), paid]},
        {id: 'restore-fall', restore: true},
        {id: 'slow-descent', advanceTo: 2, expect: [height('down', 3)]},
        {id: 'landing', advanceTo: 5, expect: [landed, safe]},
    ], expect: [paid, landed, safe, height('down', 0)]};
}

function fiendfyreCase() {
    const read = id => sentenceFromIntent(labelSpellRow(ROWS.get(id), HP_SPELL_WORLD).parts);
    const pile = id => ({id: `${id}-fuel`, kind: 'thing', place: id,
        properties: {flammable: true}, quantities: {condition: 3}});
    const site = id => ({...room(id), as: ['fiendfyre-site']});
    const place = (direction, to) => ({holder: 'runner', position: true, direction, to});
    const condition = (holder, direction, to) => ({holder, quantity: 'condition', direction, to});
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 2};
    return {basis: 'authored', world: {holders: [
        site('origin'), site('aisle'), room('landing'), room('balcony'),
        pile('origin'), pile('aisle'),
        {id: 'caster', kind: 'body', place: 'origin', quantities: {stamina: 5, vitality: 10}},
        {id: 'runner', kind: 'body', place: 'landing', quantities: {vitality: 10}},
        {id: 'wand', kind: 'thing', place: 'origin', properties: {marks: ['grip:caster']}},
    ], links: [
        {id: 'fuel-line', kind: 'fuel-contact', from: 'origin', to: 'aisle'},
        {id: 'crossing', kind: 'wooden-crossing', from: 'landing', to: 'aisle'},
        {id: 'balcony-path', kind: 'path', from: 'landing', to: 'balcony'},
    ]}, engine: {packs: ['hp.fiendfyre', 'a.mind'], settings: {'a.mind': {linkKinds: ['wooden-crossing', 'path']}},
        shared: {quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
        host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'ignite', working: {family: 'spell', id: 'ignite', payer: 'caster', spells: [{
            sentence: read('fiendfyre'), target: {id: 'origin'}, grip: {caster: 'caster', implement: 'wand'},
            contact: {links: 0}, minutes: 1, details: {field: 'fiendfyre:origin', kind: 'fiendfyre-front', params: {}, cost: 3},
        }]}},
        {id: 'release', advanceTo: 1, expect: [paid]},
        {id: 'restore-front', restore: true},
        {id: 'try-water', working: {family: 'spell', id: 'water', payer: 'caster', spells: [{
            sentence: read('water'), target: {id: 'origin'}, grip: {caster: 'caster', implement: 'wand'},
            contact: {links: 0}, minutes: 0, details: {amount: 30, cost: 1},
        }]}, expect: [{holder: 'origin', quantity: 'humidity', direction: 'up', to: 70}]},
        {id: 'lose-wand', ops: [{op: 'property', holder: 'wand', property: 'marks', value: []}]},
        {id: 'spread', advanceTo: 2, expect: [fieldChanged('fiendfyre:aisle', 'aisle', 'fiendfyre-front', {ignitedAt: 2}),
            condition('aisle-fuel', 'unchanged', 3)]},
        {id: 'try-crossing', ops: [{op: 'property', holder: 'runner', property: 'agency_goal', value: 'aisle'}]},
        {id: 'restore-crossing', restore: true},
        {id: 'crossing-lost', advanceTo: 3, expect: [place('unchanged', 'landing'), condition('aisle-fuel', 'down', 2)]},
        {id: 'take-balcony', ops: [{op: 'property', holder: 'runner', property: 'agency_goal', value: 'balcony'}]},
        {id: 'escape', advanceTo: 7, expect: [place('changed', 'balcony'), condition('aisle-fuel', 'down', 0)]},
    ], expect: [{...paid, to: 1}, place('changed', 'balcony'), condition('aisle-fuel', 'down', 0),
        {holder: 'caster', quantity: 'vitality', direction: 'down', to: 7},
        {holder: 'runner', quantity: 'vitality', direction: 'unchanged', to: 10}]};
}

function flameFreezingCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('flame-freezing'), HP_SPELL_WORLD).parts);
    const body = (id, quantities = {}) => ({id, kind: 'body', as: ['self'], place: 'threshold',
        quantities: {burn: 0, vitality: 10, ...quantities}});
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 4};
    const burns = (holder, direction, to) => ({holder, quantity: 'burn', direction, to});
    const warm = {holder: 'fire', quantity: 'temperature', direction: 'unchanged', to: 80};
    return {basis: 'authored', world: {clock: 0, holders: [room('threshold'),
        {id: 'fire', kind: 'place', quantities: {temperature: 80}},
        body('caster', {stamina: 5}), body('companion'),
        {id: 'wand', kind: 'thing', place: 'threshold', properties: {marks: ['grip:caster']}},
    ]}, engine: {shared: {quantities: [...Object.values(WORLD_QUANTITIES),
        {id: 'burn', unit: 'burden', min: 0, max: 20}, {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
        host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'protect', working: {family: 'spell', id: 'protect', payer: 'caster', spells: [{sentence,
            target: {id: 'caster'}, grip: {caster: 'caster', implement: 'wand'}, minutes: 1,
            details: {field: 'flame-protection', params: {verb: 'add', object: 'burn'}, minutes: 3, cost: 1},
        }]}},
        {id: 'release', advanceTo: 1, expect: [paid]},
        {id: 'restore', restore: true},
        {id: 'cross', ops: ['caster', 'companion'].map(holder => ({op: 'move', holder, to: 'fire'}))},
        {id: 'fire-exposure', by: 'fire', store: {carrier: 'fire', mode: 'repeating', pulse: 1,
            trigger: {kind: 'quantity', holder: '$carrier', quantity: 'temperature', op: '>=', value: 60, again: 'pulse'},
            effects: [{sentence: {verb: 'add', object: 'vitality'},
                details: {target: {shape: 'present', place: '$place'}, object: 'burn', amount: 3}}],
        }},
        {id: 'exposure', advanceTo: 2,
            expect: [burns('caster', 'unchanged', 0), burns('companion', 'up', 3)]},
    ], expect: [paid, warm, burns('caster', 'unchanged', 0), burns('companion', 'up', 3)]};
}

function incendioCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('fire'), HP_SPELL_WORLD).parts);
    const warmth = {holder: 'hearth', quantity: 'temperature', direction: 'up', to: 28};
    const signal = {holder: 'hearth', quantity: 'noise', direction: 'up', to: 3};
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 4};
    return {basis: 'authored', world: {clock: 0, holders: [
        {id: 'hearth', kind: 'place', quantities: {temperature: 18, noise: 0}}, room('corridor'),
        {id: 'caster', kind: 'body', place: 'hearth', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'hearth', properties: {marks: ['grip:caster']}},
    ]}, engine: {shared: {quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
        host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'heat-signal', by: 'caretaker', store: {carrier: 'hearth', mode: 'once', pulse: 2,
            trigger: {kind: 'quantity', holder: '$carrier', quantity: 'temperature', op: '>=', value: 25},
            effects: [{sentence: {verb: 'add', object: 'sound'}, details: {target: at('$carrier'), amount: 3}}],
        }},
        {id: 'kindle', working: {family: 'spell', id: 'kindle', payer: 'caster', spells: [{sentence,
            target: {id: 'hearth'}, grip: {caster: 'caster', implement: 'wand'}, contact: {links: 0},
            requiresSpeech: true, minutes: 1, details: {amount: 10, cost: 1},
        }]}},
        {id: 'restore-cast', restore: true},
        {id: 'release', advanceTo: 1, expect: [warmth, paid]},
        {id: 'restore-hearth', restore: true},
        {id: 'threshold', advanceTo: 2, expect: [signal]},
    ], expect: [warmth, signal, paid]};
}

function waterproofCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('waterproof'), HP_SPELL_WORLD).parts);
    const lenses = id => ({id, kind: 'thing', as: ['object'], place: 'pitch', quantities: {humidity: 0}});
    const wetness = (holder, direction, to) => ({holder, quantity: 'humidity', direction, to});
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 4};
    const dry = wetness('glasses', 'unchanged', 0);
    const wet = wetness('spare-glasses', 'up', 3);
    const splash = {sentence: {verb: 'add', object: 'moisture'},
        details: {target: {shape: 'holders', ids: ['glasses', 'spare-glasses']}, amount: 3}};
    return {basis: 'authored', world: {clock: 0, holders: [room('pitch'), lenses('glasses'), lenses('spare-glasses'),
        {id: 'caster', kind: 'body', place: 'pitch', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'pitch', properties: {marks: ['grip:caster']}},
    ]}, engine: {shared: {quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
        host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'ward', working: {family: 'spell', id: 'impervius', payer: 'caster', spells: [{sentence,
            target: {id: 'glasses'}, grip: {caster: 'caster', implement: 'wand'}, contact: {links: 0},
            requiresSpeech: true, minutes: 1, details: {field: 'lens-ward', minutes: 3, cost: 1},
        }]}},
        {id: 'release', advanceTo: 1, expect: [paid]},
        {id: 'restore', restore: true},
        {id: 'splash', ...splash, expect: [dry, wet]},
    ], expect: [paid, dry, wet]};
}

const footprint = destination => `snow-trail:${destination}`;

export const HP_SNOW_TRAILS = {
    id: 'hp.snow_trails', revision: 1, reads: ['marks'], writes: ['marks'], hears: ['departed'],
    reactors: [{
        id: 'leave-footprints', on: ['departed'],
        appliesTo: holder => holder.kind === 'place' && holder.tags.includes('trackable-snow'),
        react(view, id, event) {
            const destination = event.detail.to;
            if (view.holder(event.by)?.kind !== 'body' || !view.neighbours(id, {kinds: ['path']}).includes(destination)) return [];
            const marks = view.property(id, 'marks') ?? [];
            const mark = footprint(destination);
            return marks.includes(mark) ? [] : [{op: 'property', holder: id, property: 'marks', value: [...marks, mark]}];
        },
    }],
};

/** Inspect the local snow and queue a step along an observed trail. */
export function followSnowTrail(engine, {actor, destination}) {
    const tracker = engine.world.holders[actor];
    const snow = engine.world.holders[tracker?.place];
    if (tracker?.kind !== 'body' || !snow?.properties.marks?.includes(footprint(destination)) ||
        !linkNeighbours(worldLinks(engine.world), snow.id, {kinds: ['path']}).includes(destination)) return engine;
    return applyEngineOps(engine, [{op: 'property', holder: actor, property: 'agency_goal', value: destination}], 'follow-snow-trail');
}

function obliterateTraceCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('obliterate-trace'), HP_SPELL_WORLD).parts);
    const erased = {holder: 'snow', property: 'marks', direction: 'changed', to: [footprint('shed')]};
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 4};
    return {basis: 'authored', world: {clock: 0, holders: [
        {...room('snow'), properties: {marks: [footprint('cabin'), footprint('shed')]}}, room('cabin'), room('shed'),
        {id: 'caster', kind: 'body', place: 'snow', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'snow', properties: {marks: ['grip:caster']}},
    ], links: ['cabin', 'shed'].map(to => ({id: to, kind: 'path', from: 'snow', to}))},
    engine: {packs: ['a.mind'], shared: {
        properties: Object.values(WORLD_PROPERTIES).filter(property => !['senses', 'concealed'].includes(property.id)),
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}],
    }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'erase', working: {family: 'spell', id: 'erase', payer: 'caster', spells: [{sentence,
            target: {id: 'snow'}, grip: {caster: 'caster', implement: 'wand'}, contact: {links: 0},
            minutes: 1, details: {mark: footprint('cabin'), cost: 1},
        }]}},
        {id: 'restore', restore: true},
        {id: 'release', advanceTo: 1, expect: [erased, paid]},
    ], expect: [erased, paid]};
}

/** Choose a prepared antidote candidate from an observed ingredient identity. */
export function selectAssayAntidote(engine, {observer, sample, candidates}) {
    const place = engine.world.holders[observer]?.place;
    if (!place) return null;
    const held = Object.values(recordsOf(engine.world, observer));
    const latest = held.reduce((at, record) => record.id.startsWith(`assay:${sample}:`) && record.true.holder === sample
        ? Math.max(at, record.source.at ?? -1) : at, -1);
    const emptyAt = latestEmptyAssay(engine, {observer, sample});
    if (emptyAt >= 0 && emptyAt >= latest) return null;
    const ingredients = held.find(record => record.id === `ingredients:${sample}`)?.believed.value;
    return candidates.find(id => {
        const candidate = engine.world.holders[id];
        const part = candidate?.properties.antidote_for;
        if (candidate?.place !== place || typeof part !== 'string') return false;
        if (latest === -1) return Array.isArray(ingredients) && ingredients.includes(part);
        return held.some(record => record.id === `assay:${sample}:${latest}:${brewDoseQuantity(part)}` && record.believed.value > 0);
    }) ?? null;
}

function inspectCompositionCase() {
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('properties-reveal'), HP_SPELL_WORLD).parts);
    const learned = {holder: 'caster', property: 'mind_memory', direction: 'changed', to: ['ingredients:sample']};
    const paid = {holder: 'caster', quantity: 'stamina', direction: 'down', to: 4};
    const ingredients = ['moon-salt', 'night-root'];
    return {basis: 'authored', world: {clock: 0, holders: [room('classroom'), room('corridor'),
        {id: 'caster', kind: 'body', place: 'classroom', properties: {mind_awake: true, mind_memory: []}, quantities: {stamina: 5}},
        {id: 'observer', kind: 'body', place: 'classroom', properties: {mind_awake: true, mind_memory: []}},
        {id: 'wand', kind: 'thing', place: 'classroom', properties: {marks: ['grip:caster']}},
        {id: 'sample', kind: 'thing', as: ['object'], place: 'classroom', properties: {ingredients}},
        {id: 'first-antidote', kind: 'thing', place: 'classroom', properties: {antidote_for: 'mint'}},
        {id: 'second-antidote', kind: 'thing', place: 'classroom', properties: {antidote_for: 'night-root'}},
    ]}, engine: {packs: ['a.mind', 'n.knowledge'], shared: {
        properties: [...Object.values(WORLD_PROPERTIES).filter(property => !['senses', 'concealed'].includes(property.id)),
            {id: 'ingredients', type: 'set'}, {id: 'antidote_for', type: 'label'}],
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}],
    }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'inspect', working: {family: 'spell', id: 'inspect', payer: 'caster', spells: [{sentence,
            target: {id: 'sample'}, grip: {caster: 'caster', implement: 'wand'}, inspectComposition: true,
            requiresSpeech: true, minutes: 1, details: {cost: 1},
        }]}},
        {id: 'restore', restore: true},
        {id: 'identify', advanceTo: 1, expect: [learned, paid]},
    ], expect: [learned, paid, {holder: 'observer', property: 'mind_memory', direction: 'unchanged', to: []},
        {holder: 'sample', property: 'ingredients', direction: 'unchanged', to: ingredients}]};
}

function anapneoCase() {
    const treatment = sentenceFromIntent(labelSpellRow(ROWS.get('anapneo'), HP_SPELL_WORLD).parts);
    const reply = sentenceFromIntent(labelSpellRow(ROWS.get('light'), HP_SPELL_WORLD).parts);
    const clear = {holder: 'patient', property: 'marks', direction: 'changed', to: ['bruise']};
    const paid = {holder: 'healer', quantity: 'stamina', direction: 'down', to: 4};
    const lit = {holder: 'patient-wand', quantity: 'light:wand', direction: 'up', to: 2};
    const health = {holder: 'patient', quantity: 'vitality', direction: 'unchanged', to: 8};
    return {basis: 'authored', world: {clock: 0, holders: [room('carriage'),
        {id: 'healer', kind: 'body', place: 'carriage', quantities: {stamina: 5}},
        {id: 'patient', kind: 'body', place: 'carriage', quantities: {vitality: 8, stamina: 5},
            properties: {marks: [AIRWAY_OBSTRUCTION, 'bruise']}},
        {id: 'healer-wand', kind: 'thing', place: 'carriage', properties: {marks: ['grip:healer']}},
        {id: 'patient-wand', kind: 'thing', place: 'carriage', as: ['implement'], quantities: {'light:wand': 0},
            properties: {marks: ['grip:patient']}},
    ]}, engine: {shared: {quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
        host: {keys: HP_KEYS, costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    timeline: [
        {id: 'treatment', working: {family: 'spell', id: 'treatment', payer: 'healer', spells: [{
            sentence: treatment, target: {id: 'patient'}, grip: {caster: 'healer', implement: 'healer-wand'},
            contact: {links: 0}, requiresSpeech: true, minutes: 1, details: {cost: 1},
        }]}},
        {id: 'restore', restore: true},
        {id: 'clear', advanceTo: 1, expect: [clear, paid, health]},
        {id: 'reply', working: {family: 'spell', id: 'reply', payer: 'patient', spells: [{
            sentence: reply, target: {id: 'patient-wand'}, grip: {caster: 'patient', implement: 'patient-wand'},
            requiresSpeech: true, minutes: 1, details: {amount: 2, cost: 1},
        }]}},
        {id: 'light', advanceTo: 2, expect: [lit]},
    ], expect: [clear, paid, lit, health]};
}

function alarmCase(sentence) {
    const noise = (direction, to) => ({holder: 'lane', quantity: 'noise', direction, to});
    return {
        // The input here is an alarm already armed for the night.
        basis: 'authored', world: {clock: 1200, holders: [room('lane'), room('road'), room('junction'),
            {id: 'traveller', kind: 'body', place: 'junction'}]},
        engine: {packs: ['w.sky']},
        timeline: [
            {id: 'alarm', by: 'watch', store: {
                carrier: 'lane', pulse: 1, mode: 'once', charge: {now: 1, max: 1, per: 1},
                trigger: {kind: 'event', event: 'arrived', where: {place: 'lane'}},
                effects: [{sentence, details: {target: at('$place'), amount: 30}}],
            }},
            {id: 'outside', ops: [{op: 'move', holder: 'traveller', to: 'road'}]},
            {id: 'quiet', advanceTo: 1201, expect: [noise('unchanged', 0)]},
            {id: 'arrival', ops: [{op: 'move', holder: 'traveller', to: 'lane'}]},
            {id: 'restore', restore: true},
            {id: 'ring', advanceTo: 1202, expect: [noise('up', 30)]},
            {id: 'later', advanceTo: 1203, expect: [noise('unchanged', 30)]},
        ],
        expect: [noise('up', 30)],
    };
}

function wandHistoryCase(sentence) {
    const projection = {field: 'wand-echo', kind: 'wand-echo', params: {spell: 'dark-mark'}};
    return {
        basis: 'authored',
        world: {holders: [room('clearing'), {id: 'evidence-wand', kind: 'thing', place: 'clearing',
            properties: {marks: ['prior:dark-mark']}}]},
        engine: {packs: ['k.working_end']},
        timeline: [
            {id: 'replay', sentence, details: {target: at('evidence-wand'), ...projection, minutes: 3}},
            {id: 'restore', restore: true},
        ],
        expect: [fieldChanged(projection.field, 'evidence-wand', projection.kind, projection.params, 3)],
    };
}

function oppugnoCase() {
    const victim = 'ron';
    const bird = 'bird';
    const order = 'attack-order';
    const paid = {holder: 'hermione', quantity: 'stamina', direction: 'down', to: 4};
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('oppugno'), HP_SPELL_WORLD).parts);
    const harm = {holder: victim, quantity: 'vitality', direction: 'down', amount: 2, to: 8};
    return {
        basis: 'authored',
        world: {
            holders: [
                ...['classroom', 'doorway', 'corridor'].map(id => ({id, kind: 'place'})),
                {id: 'hermione', kind: 'body', place: 'classroom', quantities: {stamina: 5}},
                {id: 'wand', kind: 'thing', place: 'classroom', properties: {marks: ['grip:hermione']}},
                {id: bird, kind: 'body', as: ['creature'], place: 'classroom', properties: {mind_awake: true}},
                {id: victim, kind: 'body', place: 'doorway', quantities: {vitality: 10}},
                {id: 'bystander', kind: 'body', place: 'doorway', quantities: {vitality: 10}},
            ],
            links: [{id: 'classroom-door', kind: 'path', from: 'classroom', to: 'doorway'}],
        },
        engine: {packs: ['a.mind'], shared: {
            quantities: [{id: 'stamina', unit: 'effort', min: 0, max: 5}, WORLD_QUANTITIES.vitality],
        }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
        timeline: [
            // The bird's existing attack uses its own contact. The arrival
            // trigger requires this bird and this place, and the payload
            // still requires the victim to be in the bird's reach.
            {id: 'bird-attack', by: bird, store: {
                carrier: bird, pulse: 2, mode: 'once',
                trigger: {kind: 'event', event: 'arrived', where: {by: bird, place: 'doorway'}},
                effects: [{sentence: {verb: 'remove', object: 'vitality'}, details: {target: at(victim), amount: 2}}],
            }},
            {id: 'command', working: {family: 'spell', id: order, payer: 'hermione', spells: [{
                sentence, target: {id: bird},
                grip: {caster: 'hermione', implement: 'wand'}, contact: {links: 0}, minutes: 1,
                details: {working: order, mind: {faculty: 'will', to: 'doorway'}, minutes: 3, cost: 1},
            }]}},
            {id: 'release', advanceTo: 1, expect: [paid,
                {holder: bird, property: 'mind_order', direction: 'changed', to: 'doorway'}]},
            {id: 'save-before-contact', restore: true},
            {id: 'contact', advanceTo: 2, expect: [harm]},
            {id: 'after', advanceTo: 4, expect: [{holder: victim, quantity: 'vitality', direction: 'unchanged', to: 8}]},
        ],
        expect: [paid, harm, {holder: bird, position: true, direction: 'changed', to: 'doorway'},
            {holder: 'bystander', quantity: 'vitality', direction: 'unchanged', to: 10}],
    };
}

function patronusCase() {
    const guardian = 'guardian';
    const sentinel = 'dementor';
    const atApproach = {holder: guardian, position: true, direction: 'changed', to: 'approach'};
    const retreat = {holder: sentinel, position: true, direction: 'changed', to: 'far-bank'};
    const safety = {holder: 'harry', quantity: 'vitality', direction: 'unchanged', to: 10};
    const payment = {holder: 'harry', quantity: 'stamina', direction: 'down', to: 3};
    const sentence = sentenceFromIntent(labelSpellRow(ROWS.get('patronus'), HP_SPELL_WORLD).parts);
    return {
        basis: 'authored',
        world: {
            holders: [
                ...['bank', 'approach', 'far-bank'].map(id => ({id, kind: 'place'})),
                {id: 'harry', kind: 'body', as: ['self'], place: 'bank', quantities: {stamina: 5, vitality: 10}},
                {id: 'wand', kind: 'thing', place: 'bank', properties: {marks: ['grip:harry']}},
                {id: sentinel, kind: 'body', place: 'approach'},
            ],
            links: [{id: 'bank-approach', kind: 'path', from: 'bank', to: 'approach'}],
        },
        engine: {packs: ['a.mind', 's.focus'], shared: {
            quantities: [{id: 'stamina', unit: 'effort', min: 0, max: 5}, WORLD_QUANTITIES.vitality],
        }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
        timeline: [
            {id: 'repel-on-contact', by: guardian, store: {
                carrier: guardian, pulse: 2, mode: 'once',
                trigger: {kind: 'event', event: 'arrived', where: {by: guardian, place: 'approach'}},
                effects: [{sentence: {verb: 'move', object: 'position'}, details: {target: at(sentinel), to: 'far-bank'}}],
            }},
            {id: 'threat', by: sentinel, store: {
                carrier: sentinel, pulse: 3, mode: 'once', reach: {links: {within: 1, kinds: ['path']}},
                trigger: {kind: 'time', at: 3},
                effects: [{sentence: {verb: 'remove', object: 'vitality'}, details: {target: at('harry'), amount: 2}}],
            }},
            {id: 'form', working: {family: 'spell', id: 'patronus', payer: 'harry', spells: [{
                sentence, target: {id: 'harry'}, grip: {caster: 'harry', implement: 'wand'}, minutes: 1,
                details: {cost: 2, create: {id: guardian, kind: 'body',
                    properties: {form: 'stag', mind_awake: true, sustained_by: 'harry', agency_goal: 'approach', agency_until: 4}}},
            }]}},
            {id: 'release', advanceTo: 1, expect: [payment, {holder: guardian, exists: true, direction: 'changed', to: true}]},
            {id: 'restore', restore: true},
            {id: 'contact', advanceTo: 2, expect: [atApproach, retreat]},
            {id: 'after', advanceTo: 3, expect: [safety]},
        ],
        expect: [payment, {holder: guardian, exists: true, direction: 'changed', to: true}, atApproach, retreat, safety],
    };
}
/** Coverage case for a spellbook row id (shape: scripts/coverage_report.mjs header). */
export function coverageCase(id) {
    const row = ROWS.get(id), scene = HP_CASE_SCENES[id];
    if (!row) throw Error(`hp_effect_pack: ${id} is not a Hogwarts spell row`);
    if (!scene) throw Error(`hp_effect_pack: ${id} has no case scene`);
    if (scene.build) return scene.build(caseSentence(row));
    return {basis: 'authored', world: {clock: 0, holders: structuredClone(scene.holders),
        ...(scene.lawFields ? {lawFields: structuredClone(scene.lawFields)} : {})},
        ...(scene.engine ? {engine: structuredClone(scene.engine)} : {}),
        ...(scene.by ? {by: scene.by} : {}), sentence: caseSentence(row),
        details: structuredClone(scene.details), keys: {...HP_KEYS},
        cause: `hp-case:${id}`, expect: structuredClone(scene.expect)};
}
export const HP_CASE_MODULE = 'src/world_packs/hp_effect_pack.js';
