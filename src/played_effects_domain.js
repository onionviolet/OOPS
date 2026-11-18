// Played effect entry points (PWC131, proposal 2026-11-18). When a player finishes one of these native commands the
// effect it describes lands through `landEffect` (played_landing.js) and a Reports line says what the law did:
//   brew  : taking the supervised Seer dose (Tingen) lands the dose law's mind sentence on a body;
//   gu    : a Moonblade boar hunt lands the Gu's PSA27 `remove vitality` sentence on the boar;
//   ward  : the clan Gu house chores raise the house ward (`block vitality`) and a pest strike is tried against it.
// The domain watches the native completed-command counters (no command or save is changed here), re-baselines on every load so a
// reload lands nothing twice, and saves nothing (AR3: native owners keep health, items and conditions; this reports beside them).
// Adding an entry point = one row in ENTRY_POINTS (command key, law, body, sentences, line); no code elsewhere.
import {registerDomain} from './domain_registry.js';
import {readPort} from './ui_ports.js';
import {doseBody, doseResponse} from './brew_dose_response.js';
import {guLanding} from './gu_effect_sentence.js';
import {landPlayed, sentence} from './played_landing.js';

// Dials (default, reason): the Moonblade strike is the Gu's own magnitude, one boar has 12 vitality (a hunt takes it down); the house
// ward holds 6 for an hour against a 4-point pest strike. Authored numbers for a first slice, named so a world can tune them.
export const ENTRY_DIALS = Object.freeze({boarVitality: 12, strike: 12, wardHold: 6, wardMinutes: 60, pest: 4, houseKeeper: 20});

export const ENTRY_POINTS = Object.freeze([
    {key: 'book.lotm.ingest', law: 'brew-dose', entry: 'tingen-supervised-dose',
        build() {
            const body = {id: 'you', ...doseBody('mind', 'oral')};
            const r = doseResponse({verb: 'transform', object: 'mind', time: 'sustained'});
            return {body, steps: [{sentence: sentence(r.sentence.verb, r.sentence.object, 'self', 'sustained', 'potion'), details: r.details}]};
        },
        line: ({before, after}) => `The dose takes hold and your senses flare (mood ${before.properties.mind_mood} to ${after.properties.mind_mood}).`},
    {key: 'book.ri.keeper.km.use.moonblade__moon__own', law: 'gu-working', entry: 'keeper-moonblade-hunt',
        build() {
            const landing = guLanding({kind: 'attack', magnitude: ENTRY_DIALS.strike});
            return {body: {id: 'boar', quantities: {vitality: ENTRY_DIALS.boarVitality}}, steps: [landing]};
        },
        line: ({before, after}) => `The Moonblade struck: the boar lost ${before.quantities.vitality - after.quantities.vitality} of ${before.quantities.vitality} vitality.`},
    {key: 'book.ri.keeper.chores', law: 'layered-ward', entry: 'gu-house-ward',
        build() {
            return {body: {id: 'house', quantities: {vitality: ENTRY_DIALS.houseKeeper}}, steps: [
                {sentence: sentence('block', 'vitality', 'self', 'sustained', 'ward'), details: {amount: ENTRY_DIALS.wardHold, minutes: ENTRY_DIALS.wardMinutes}},
                {sentence: sentence('remove', 'vitality', 'line', 'instant', 'pest'), details: {amount: ENTRY_DIALS.pest}}]};
        },
        line: ({before, after, results}) => `The chores set the house ward for the night; a pest strike ${after.quantities.vitality === before.quantities.vitality && !results[1].changed ? 'was turned away' : 'got through'}.`},
]);

let seen = null, ports = null;
export const configurePlayedEffects = operations => { ports = operations; };

const counts = () => readPort('expansion')?.actors?.player?.completed;

export function playedEffectsTick(completed = counts(), log = ports?.logMessage) {
    if (!completed) return [];
    if (!seen) { seen = {...completed}; return []; }
    const lines = [];
    for (const row of ENTRY_POINTS) {
        const now = completed[row.key] ?? 0;
        if (now <= (seen[row.key] ?? 0)) continue;
        seen[row.key] = now;
        const {body, steps} = row.build();
        const run = landPlayed({entry: row.entry, law: row.law, body, steps});
        if (run.landed > 0) lines.push(row.line(run));
    }
    for (const line of lines) log?.(line, 'notification');
    return lines;
}

export const resetPlayedEffects = () => { seen = null; };

registerDomain({id: 'playedEffects', initialState: () => null, load: resetPlayedEffects, tick: () => { playedEffectsTick(); }});
