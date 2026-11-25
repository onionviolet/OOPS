// Played effect entry points (PWC131). The supervised dose lands at the native command's save
// boundary and stages its mood delta in the existing mood owner. Moonblade hunts and Gu house
// chores are observed after completion and report what the law did in a transient world.
// The observer re-baselines on load and has no save slice.
import {registerDomain} from './domain_registry.js';
import {LOTM_MIND_HOLDER, SUPERVISED_DOSE_THOUGHT} from './book_world_lotm_mind.js';
import {addThought} from './mood_thoughts.js';
import {editMoodThoughts, thoughtRows} from './mood_thoughts_domain.js';
import {stageReportLine} from './reports_dock.js';
import {readPort} from './ui_ports.js';
import {doseBody, doseResponse} from './brew_dose_response.js';
import {guLanding} from './gu_effect_sentence.js';
import {landPlayed, sentence} from './played_landing.js';

// Dials (default, reason): the Moonblade strike is the Gu's own magnitude, one boar has 12 vitality (a hunt takes it down); the house
// ward holds 6 for an hour against a 4-point pest strike. Authored numbers for a first slice, named so a world can tune them.
export const ENTRY_DIALS = Object.freeze({boarVitality: 12, strike: 12, wardHold: 6, wardMinutes: 60, pest: 4, houseKeeper: 20});

export const ENTRY_POINTS = Object.freeze([
    {key: 'book.lotm.ingest', law: 'brew-dose', entry: SUPERVISED_DOSE_THOUGHT,
        build() {
            const body = {id: 'you', ...doseBody('mind', 'oral')};
            const r = doseResponse({verb: 'transform', object: 'mind', time: 'sustained'});
            return {body, steps: [{sentence: sentence(r.sentence.verb, r.sentence.object, 'self', 'sustained', 'potion'), details: r.details}]};
        },
        line: ({before, after}) => `The dose takes hold and your senses flare (mood ${before.properties.mind_mood} to ${after.properties.mind_mood}).`},
    // The native action pays essence; this adapter lands the moonlight row's cut with cost already paid.
    {key: 'book.ri.keeper.km.use.moonblade__moon__own', law: 'gu-working', entry: 'keeper-moonblade-hunt', ledgerKey: 'gu_kinds:moonlight',
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

function stageDoseMood(plan) {
    if (!plan.earnedTingenDose) return;
    const dose = ENTRY_POINTS[0];
    const {before, after} = landPlayed({...dose, ...dose.build()});
    const magnitude = after.properties.mind_mood - before.properties.mind_mood;
    if (!magnitude) return;
    const now = plan.state.clock;
    const thought = {holder: LOTM_MIND_HOLDER, subject: 'self', source: dose.entry,
        key: dose.entry, magnitude, minutes: 1440,
        line: 'Your senses sharpened because you drank the Seer dose under supervision.'};
    const next = addThought(thoughtRows(), thought, now);
    plan.nativePatch = {...plan.nativePatch, moodThoughts: next};
    stageReportLine(plan, thought.line);
    const publish = plan.absorbPublish;
    plan.absorbPublish = () => {
        publish?.();
        editMoodThoughts(() => next, now);
        ports?.logMessage?.(thought.line, 'notification', {safeText: true, panelId: 'condition'});
        if (seen) seen[dose.key] = plan.state.actors.player.completed[dose.key];
    };
}

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

registerDomain({id: 'playedEffects', deps: ['moodThoughts'], initialState: () => null, load: resetPlayedEffects, stage: stageDoseMood, tick: () => { playedEffectsTick(); }});
