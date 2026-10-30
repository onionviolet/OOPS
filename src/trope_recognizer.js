// G2 slice 3: tropes as recognisers, not drivers (PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS round 12, BR2/BS1/BS5; AD38).
// Pure scan over saved facts: it NAMES a pattern the life is already forming and changes nothing, so a trope never decides an outcome
// and reload never rerolls one. It extends story_recognizer.js (rivalry, debt) with story-shaped names and adds one receipt-based trope.
// Overuse dial per world, stateless so it survives save, reload and import: `repeats` is how many separate events must repeat before a
// pattern earns its name (raise it where the world produces that pattern constantly, BS1), `perKind` caps how many of a kind show
// (BS2), `wink` lets the line say it is a trope (BS5, off by default). A dial of repeats: 99 turns a trope off for a world.
// FND1: address: none stored. Reader: recognizeTropes. Tests: tests/trope_recognizer.test.js. Budget: O(chronicle relationships + receipts).
import {recognizeStories} from './story_recognizer.js';

export const TROPES = Object.freeze({
    rival_returns: {name: 'The rival who keeps coming back', wink: 'a returning rival, as tradition demands'},
    helper_returns: {name: 'The traveler you keep helping', wink: 'the kindness that comes back, as tradition demands'},
});
export const TROPE_DIAL = Object.freeze({rival_returns: {repeats: 2}, helper_returns: {repeats: 2}, perKind: 2, wink: false});

const clashes = c => c.filter(x => x.startsWith('memory:')).length;

export function recognizeTropes(state, {dial = TROPE_DIAL, display = name => name} = {}) {
    const out = [];
    const need = k => dial[k]?.repeats ?? TROPE_DIAL[k].repeats;
    for(const s of recognizeStories(state).filter(s => s.kind === 'rivalry' && s.open)) {
        const n = clashes(s.causes);
        if(n >= need('rival_returns')) out.push({id: `trope:rival_returns:${s.with}`, trope: 'rival_returns', with: s.with, count: n, causes: s.causes});
    }
    const byPerson = new Map();
    for(const r of state?.loreHistory?.receipts ?? [])
        if(r.action?.startsWith('request.') && r.result === 'delivered' && r.audience?.includes('player') && r.targetPerson)
            byPerson.set(r.targetPerson, [...(byPerson.get(r.targetPerson) ?? []), r.id]);
    for(const [person, ids] of byPerson) if(ids.length >= need('helper_returns'))
        out.push({id: `trope:helper_returns:${person}`, trope: 'helper_returns', with: person, count: ids.length, causes: ids.map(id => `receipt:${id}`)});
    out.sort((a, b) => b.count - a.count || (a.id < b.id ? -1 : 1));
    const taken = {}, kept = out.filter(t => (taken[t.trope] = (taken[t.trope] ?? 0) + 1) <= (dial.perKind ?? TROPE_DIAL.perKind));
    return kept.map(t => {
        const who = display(t.with), def = TROPES[t.trope];
        const line = t.trope === 'rival_returns' ? `${who} keeps coming back at you: ${t.count} clashes and the grievance is still open.`
            : `You have delivered for ${who} ${t.count} times, and they remember.`;
        return {...t, name: def.name, line: dial.wink ? `${line} (${def.wink}.)` : line};
    });
}
