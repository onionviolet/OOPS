// Gu's chapter-checked effect vocabulary and engine coverage scenes (PC5–PC9, AD32).
import {defineEffectGrammar} from '../effect_grammar.js';
import {guCatalogue} from '../gu_catalogue.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

// ---------- Gu (Reverend Insanity) ----------
export const guEffects = defineEffectGrammar({
    world: 'gu', carriers: {gu: ['essence-primeval', 'essence-immortal', 'mental']},
    // W keys: essence by fuel family; light defaults to moonlight (a kind's own light passes `key`).
    keys: {essence: parts => parts.cost === 'essence-immortal' ? 'immortal' : 'primeval', light: 'moon'},
    limits: ['ward', 'dao-mark', 'cover', 'distance', 'mass', 'will', 'counter-effect', 'fuel'],
});
// G's function families read as sentences. The world's reading, written before
// the rules judged it.
const GU_FUNCTION = {
    attack: {verb: 'remove', object: 'vitality', target: 'line', time: 'instant'},
    guard: {verb: 'block', object: 'vitality', target: 'self', time: 'sustained'},
    conceal: {verb: 'conceal', object: 'information', target: 'self', time: 'sustained'},
    sense: {verb: 'sense', object: 'information', target: 'area', time: 'sustained'},
    move: {verb: 'move', object: 'position', target: 'self', time: 'instant'},
    fly: {verb: 'move', object: 'position', target: 'self', time: 'sustained'},
    travel: {verb: 'move', object: 'position', target: 'bound', time: 'instant'},
    heal: {verb: 'add', object: 'vitality', target: 'touched', time: 'instant'},
    'convert-essence': {verb: 'transform', object: 'essence', target: 'touched', time: 'instant'},
    produce: {verb: 'add', object: 'thing', target: 'self', time: 'lasting'},
    record: {verb: 'copy', object: 'information', target: 'area', time: 'lasting'},
    strength: {verb: 'add', object: 'force', target: 'self', time: 'sustained'},
    amplify: {verb: 'alter', object: 'working', target: 'bound', time: 'sustained'},
    economize: {verb: 'alter', object: 'working', target: 'bound', time: 'sustained'},
    restore: {verb: 'transform', object: 'form', target: 'area', time: 'lasting'},
    stabilize: {verb: 'block', object: 'form', target: 'touched', time: 'sustained'},
    mind: {verb: 'transform', object: 'mind', target: 'area', time: 'sustained'},
    suppress: {verb: 'block', object: 'working', target: 'area', time: 'sustained'},
    formation: {verb: 'alter', object: 'law', target: 'area', time: 'sustained'},
    time: {verb: 'transform', object: 'time', target: 'self', time: 'lasting'},
    illuminate: {verb: 'add', object: 'light', target: 'area', time: 'sustained'},
    steal: {verb: 'move', object: 'relation', target: 'bound', time: 'instant'},
};
const GU_LIMITS = [[/formation|block/i, 'ward'], [/dao mark/i, 'dao-mark'], [/smoke|cover/i, 'cover'], [/steps|reach|range/i, 'distance'],
    [/short of essence|starves|supplies essence/i, 'fuel']];
export function labelGuEffect(row) {
    const p = row.parts?.value;
    if (!p) return {missing: ['parts']};
    if (!p.function) return {missing: ['function']};
    const base = GU_FUNCTION[p.function];
    if (!base) return {missing: [`function:${p.function}`]};
    const cost = p.fuel === 'mental' ? 'mental' : p.fuel === 'immortal' || p.rank.some(r => r >= 6) ? 'essence-immortal' : 'essence-primeval';
    const text = row.parts.observed ?? '';
    const limits = [...new Set(GU_LIMITS.filter(([re]) => re.test(text)).map(([, l]) => l))];
    return {parts: {...base, carrier: 'gu', cost, limits}, truth: {function: p.function, abilityKinds: row.abilityKinds ?? []}};
}
// Non-circular check: G's ability rows name an effect kind authored apart from
// the function family. Each kind implies the verb its resolver performs.
const ABILITY_VERB = {lightning: 'remove', flame: 'remove', damage: 'remove', 'water-guard': 'block', 'jade-guard': 'block', 'impact-guard': 'block',
    'lightning-shield': 'block', 'ground-hearing': 'sense', 'pierce-visual-concealment': 'sense', 'visual-concealment': 'conceal', flight: 'move',
    dash: 'move', travel: 'move', 'project-demeanor': 'transform'};
export function compareGuEffect(value, truth) {
    return truth.abilityKinds.filter(k => ABILITY_VERB[k] && ABILITY_VERB[k] !== value.parts.verb)
        .map(k => ({field: 'verb', rule: 'ability-kind', cause: `${k} implies ${ABILITY_VERB[k]}`, expected: ABILITY_VERB[k], got: value.parts.verb}));
}
export async function guEffectRows() {
    return Object.entries(guCatalogue).map(([id, v]) => ({id: `gu:${id}`, parts: v.parts,
        abilityKinds: Object.values(v).map(b => b?.value?.effect?.kind).filter(Boolean)}));
}

// G's ability rows carry a dose cost; the curve fits on them.
export async function guCanonAmounts() {
    return Object.fromEntries(Object.entries(guCatalogue).map(([id, v]) => [`gu:${id}`, Object.values(v).map(b => b?.value?.cost).find(Number.isFinite)]));
}
// World laws as data. Hogwarts' is in its pack (HP_FORBID).
export const GU_FORBID = [];

// Open scene calibration. Vitality, light grades, and conversion volumes are
// game units. The chapter observations establish what changes and in which direction.
const CALIBRATION = {clock: 0, bodyVitality: 10, starlight: 1};
// W requires a registered pack at composition. The sky pack supplies the
// scene's world clock vocabulary; these resolved scenes do not advance time.
const ENGINE = {packs: ['w.sky'], shared: {quantities: ['vitality', 'energy', 'light'].map(id => WORLD_QUANTITIES[id])}};
const place = id => ({id, kind: 'place'});
const at = id => ({shape: 'holder', id});
const quantityChange = (holder, quantity, direction) => ({holder, quantity, direction});

function wound(id, seen) {
    const amount = guCatalogue[id].ability.value.effect.magnitude;
    return {seen, holders: [place('line-of-fire'),
        {id: 'struck-body', kind: 'body', place: 'line-of-fire', quantities: {vitality: CALIBRATION.bodyVitality}}],
    details: {target: at('struck-body'), amount},
    expect: [quantityChange('struck-body', 'vitality', 'down')]};
}

function relocation(seen, from, to, travellers, time) {
    return {seen, time, holders: [place(from), place(to), ...travellers.map(id => ({id, kind: 'body', place: from}))],
        details: {target: {shape: 'holders', ids: travellers}, to},
        expect: travellers.map(holder => ({holder, position: true, direction: 'changed', to}))};
}

// The reserve names here follow the observed stages independently of the
// conversion binding. The binding supplies the input/output volumes and the
// promoted stage for execution. Only the ordinary forward conversion is shown.
function refineEssence(id, seen, rank, fromStage, expectedStage) {
    const binding = guCatalogue[id].conversion.value;
    const key = (r, stage) => `primeval.rank${r}.${stage}`;
    const from = key(rank, fromStage);
    const input = key(binding.rank, binding.from ?? 'initial');
    const expected = `energy:${key(rank, expectedStage)}`;
    return {seen, holders: [place('refining-seat'), {id: 'aperture', kind: 'thing', place: 'refining-seat',
        quantities: {[`energy:${from}`]: binding.cost, [expected]: 0}}],
    keys: {essence: input}, details: {target: at('aperture'), amount: binding.cost,
        into: `energy:${key(binding.rank, binding.stage)}`, ratio: {numerator: binding.yield, denominator: binding.cost}},
    expect: [quantityChange('aperture', `energy:${from}`, 'down'), quantityChange('aperture', expected, 'up')]};
}

const scenes = {
    thunderclap: wound('thunderclap', 'A thunderball injures an exposed body.'),
    moonlight: wound('moonlight', 'A Moonblade cuts an exposed body.'),
    moonglow: wound('moonglow', 'The stronger Moonblade wounds its target.'),
    'red-fire': wound('red-fire', 'The offensive flame injures a body in its path.'),
    thunderwings: relocation('The flyer carries another person into the air.', 'ground', 'air', ['flyer', 'passenger']),
    'charging-crash': relocation('The user charges to the far end of a clear route.', 'start', 'two-hundred-step-end', ['charger']),
    'fire-discharge': relocation('The fire set moves its user across the scene.', 'near-side', 'far-side', ['fire-user']),
    'rainbow-light': relocation('The supported movement carries its user along the route.', 'start', 'far-side', ['traveller'], 'sustained'),
    'fixed-immortal-travel': relocation('The traveller arrives at the place held in mind on an unobstructed route.', 'start', 'familiar-place', ['traveller']),
    love: relocation('After Love Gu acts of its own accord, five people arrive on another peak.', 'first-peak', 'other-peak',
        ['traveller-1', 'traveller-2', 'traveller-3', 'traveller-4', 'traveller-5']),
    'liquor-worm': refineEssence('liquor-worm', 'Green-copper essence is purified into a smaller middle-stage reserve.', 1, 'initial', 'middle'),
    'four-flavors-liquor-worm': refineEssence('four-flavors-liquor-worm', 'Rank-two essence rises a substage.', 2, 'middle', 'upper'),
    'seven-fragrances-liquor-worm': refineEssence('seven-fragrances-liquor-worm', 'White-silver essence rises a substage.', 3, 'middle', 'upper'),
    'nine-eyes-liquor-worm': refineEssence('nine-eyes-liquor-worm', 'Yellow-gold essence rises a substage.', 4, 'initial', 'middle'),
    'vitality-leaf': {
        seen: 'A detached leaf helps an injured recipient recover in one eligible treatment.',
        holders: [place('treatment-seat'), {id: 'patient', kind: 'body', place: 'treatment-seat', quantities: {vitality: 1}}],
        details: {target: at('patient'), amount: guCatalogue['vitality-leaf'].treatment.value.health},
        expect: [quantityChange('patient', 'vitality', 'up')],
    },
    'starlight-firefly': {
        seen: 'A Gu gives starlight in a dark place.',
        holders: [{...place('dark-place'), quantities: {'light:star': 0}}],
        details: {target: at('dark-place'), amount: CALIBRATION.starlight}, keys: {light: 'star'},
        expect: [quantityChange('dark-place', 'light:star', 'up')],
    },
};

export const GU_CASE_GAPS = Object.freeze({
    'water-shield': 'W/runner needs law-field and follow-up hit expectations for a breakable outer shield and L needs Gu wear on breach.',
    'white-jade': 'C/W needs partial residual lightning mitigation after the outer shield breaks, distinct from stopping contact.',
    'scale-armor': 'C/W needs an impact mitigation reader and the runner needs a follow-up hit expectation.',
    'thunder-shield': 'W/X needs a directional lightning shield field and the runner needs a follow-up hit expectation.',
    'earth-communication-ear-grass': 'W/X needs grounded path and range; N/runner needs an observed ground-hearing result through smoke.',
    'stealth-scales': 'N needs per-surface sight masking for body and clothing with smell and Lightning Eye still able to find them; W conceal is a whole-holder channel.',
    'stealth-rock': 'N needs body-only sight masking with clothing still visible; W conceal is a whole-holder channel.',
    'lightning-eye': 'N/runner needs an observed sight result that pierces concealment; W/X needs smoke range loss and physical cover.',
    'vitality-grass': 'L needs an essence/water/sunlight growth reaction that regrows detachable leaves up to the observed capacity.',
    duplicate: 'K needs a bound flame-count change consumed by the fire working; the runner cannot settle a support and core.',
    enlarge: 'K needs a bound per-flame magnitude change consumed by the fire working; the runner cannot settle a support and core.',
    'fire-source': 'K needs the changed primeval debit of the bound fire working after support settles.',
    'little-light': 'K needs the bound Moonblade magnitude/range and redundant support resolution before W sees the cut.',
    'light-source': 'K needs the changed primeval debit of a bound light working after support settles.',
    attitude: 'A/N needs a demeanor response in the observer to a mental-energy working.',
    'moving-fire': 'W/X needs flame placement along the traversed route; changing the traveller endpoint omits the trail.',
    'moon-scar': 'X needs a measured hit at the doubled reach and C/W needs the unchanged force comparison against Moonlight.',
    plunder: 'K identity needs live hosted Gu custody transfer from the wolf and interrupted essence draw with backlash.',
    'charred-thunder-potato-mother': 'L/F needs the growth output and viability of fruit leading to identifiable Gu.',
    'charred-thunder-potato': 'K/W needs a vibration-triggered planted Gu and its resulting blast; the catalogue lacks a standalone blast binding.',
    'ant-nest': 'L needs essence/material conversion into an army ant cohort and queen-mediated caste growth.',
    'blood-asset': 'K/A needs a spirit working affected by suppression and L needs the injured Gu recovery state.',
    'formation-plate': 'W needs a stored sub-formation arrangement and overwrite operation, and the runner needs law-field expectations.',
    'mountain-as-before': 'L/W needs a growing aperture and the stabilization field read during its growth.',
    'river-as-before': 'L/W needs a growing aperture and the stabilization field read during its growth.',
    'landscape-as-before': 'W needs the damaged terrain state and a restoration operation paid with green grape essence.',
    'ice-blade': 'F/W needs the formed iceblade as an output that Swirl and Fierce Wind can carry; standalone injury is unspecified.',
    'earth-overlord': 'L needs body and soul aftermath from applying the ground-based strength working without ground contact.',
    'borrow-strength': 'L/K needs a matched environmental strength source and the strength it lends the bound working.',
    'wind-overlord': 'K/L needs the paired substitution contribution to the full move; independent strength output is unspecified.',
    'tyrant-strength': 'K/L needs the paired substitution contribution to the full move; independent strength output is unspecified.',
    'photo-audio': 'N needs captured image/audio and a playback consumer, including light and sound input.',
    'myriad-self': 'L/K needs created strength phantom holders with force and the altered activation debit.',
    'self-reliance': 'L needs the user strength field and its strength-to-healing reader; a fixed vitality increment omits the mechanism.',
    'all-out-effort': 'G needs a chapter-backed standalone effect field; F has the intermediate refinement scene.',
    'group-strength': 'L/K needs a phantom cohort with combined force consumed by Giant Hand.',
    'self-strength': 'G needs a standalone outcome field separate from its role as a core; L needs force read by the move.',
    'spring-autumn-cicada': 'W/K needs rebirth across timelines with preserved Gu identity and bond.',
    'years-flow-like-water': 'L/K needs Year Gu creation with the Immortal uniqueness check, and A needs the aura response by Year Beasts.',
    'year-gu': 'W/R needs stored years, their expenditure and a rank reader of the remaining years.',
    after: 'L needs the monthly black ant Gu cohort and its delivery of food to the parent.',
});

export const GU_CASE_MODULE = 'src/world_packs/gu_effect_pack.js';
export function guCaseNote(id) {
    return Object.hasOwn(scenes, id) ? scenes[id].seen : undefined;
}

export function coverageCase(id) {
    if (!Object.hasOwn(scenes, id)) throw Error(`gu_effect_pack: ${id} has no coverage scene`);
    const scene = scenes[id];
    const sentence = labelGuEffect(guCatalogue[id]).parts;
    if (scene.time) sentence.time = scene.time;
    return {basis: 'authored', world: {clock: CALIBRATION.clock, holders: structuredClone(scene.holders)},
        sentence, details: structuredClone(scene.details), keys: {...scene.keys}, expect: structuredClone(scene.expect),
        engine: structuredClone(ENGINE)};
}
