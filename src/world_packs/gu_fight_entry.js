// Gu fight entry (proposal, CBD41 and sizing audit F5/R2): build a contest
// entrant from the Gu a person actually keeps in the world, and read what a
// finished fight leaves behind in that same world. Data and readers only: the
// contest, the Gu workings and the liveness check at each meeting
// (gu_moonblade_contest.js) stay the authorities. Headless; no played caller yet.
import {check, object} from '../basics.js';

// Which kept Gu kinds open which contest move, strongest first. Rows, so a new Gu move costs a row.
export const GU_FIGHT_MOVES = Object.freeze([
    {move: 'little_light_moonblade', needs: ['moonlight', 'little-light']},
    {move: 'moonlight_gu', needs: ['moonlight']},
    {move: 'moonglow_gu', needs: ['moonglow']},
]);

// Player words for this world's contest moves, means and body parts, for fight_text.js. A caller adds `seat` and
// the names of the people in the fight. `done` holds the done form of a move that has no outcome of its own.
export const GU_FIGHT_LABELS = Object.freeze({
    moves: Object.freeze({moonlight_gu: 'Moonblade', moonglow_gu: 'Moonglow blade', little_light_moonblade: 'Little-light moonblade',
        moonblade: 'Moonblade', moonglow_blade: 'Moonglow blade', close_fist: 'Punch', fist: 'Punch', bite: 'Bite', bow_shot: 'Bow shot',
        close_in: 'Close in', slip_past: 'Slip past', drop_bow: 'Drop the bow'}),
    done: Object.freeze({close_in: 'closed in', slip_past: 'slipped past', drop_bow: 'bow dropped'}),
    means: Object.freeze({vitality: 'Vitality', stamina: 'Stamina', primeval_essence: 'Primeval essence', arrows: 'Arrows'}),
    parts: Object.freeze({hands: 'hands', head: 'head', body: 'body', legs: 'legs'}),
});

/** The Gu a person keeps and has with them: same place, kept by them. Fed, alive and controlled are checked
 * where the fight uses the Gu, so a Gu that goes hungry mid-fight fails there and not here. */
export function guKept(world, operatorId) {
    const operator = world.holders[operatorId];
    check(object(operator) && typeof operator.place === 'string', `No one called ${operatorId} is in a place.`);
    return Object.values(world.holders)
        .filter(h => h.properties?.gu_keeper === operatorId && h.place === operator.place && typeof h.properties.gu_kind === 'string')
        .sort((a, b) => (a.id < b.id ? -1 : 1));
}

/** A contest entrant whose Gu and Gu moves come from the world. `attack` and `evasion` are still the caller's
 * numbers: no owner derives them from a body yet. `bodily` lists moves that need no Gu. */
export function guEntrantFromWorld(world, operatorId, {side = operatorId, attack, evasion, bodily = [], rankOf = () => 1, ...rest} = {}) {
    check(Number.isFinite(attack) && Number.isFinite(evasion), 'A Gu entrant needs attack and evasion numbers.');
    const kept = guKept(world, operatorId);
    const kinds = new Set(kept.map(h => h.properties.gu_kind));
    const moves = [...GU_FIGHT_MOVES.filter(row => row.needs.every(kind => kinds.has(kind))).map(row => row.move), ...bodily];
    check(moves.length > 0, `${operatorId} has no move to bring: no kept Gu opens one and no bodily move was given.`);
    return {id: operatorId, body: operatorId, side, moves,
        profile: {attack, evasion, gu: kept.map(h => ({id: h.id, kind: h.properties.gu_kind, rank: rankOf(h)}))}, ...rest};
}

/** Before and after amounts for the result block (fight_text.js `fightResult`). */
export function guFightMeans(before, after, operatorId, ids = ['vitality', 'primeval_essence']) {
    return ids.map(id => ({id, before: before.holders[operatorId]?.quantities[id] ?? 0, after: after.holders[operatorId]?.quantities[id] ?? 0}));
}

/** What the fight left in the world, as typed rows a later activity can read: who ended how, what each person
 * spent and lost, and which kept Gu came out hungry. Read from the two worlds, so it reports what is there. */
export function guFightCarry(record, before, after) {
    check(object(record?.result), 'A fight carry needs a finished contest.');
    const rows = [];
    for (const [id, entrant] of Object.entries(record.entrants).sort(([a], [b]) => (a < b ? -1 : 1))) {
        rows.push({kind: 'ended', who: id, outcome: record.result.outcomes[id] ?? entrant.outcome ?? null});
        const was = before.holders[entrant.body]?.quantities ?? {}, now = after.holders[entrant.body]?.quantities ?? {};
        for (const q of Object.keys(was).sort()) {
            if (!(now[q] < was[q])) continue;
            rows.push({kind: q === 'vitality' ? 'hurt' : 'spent', who: id, quantity: q, amount: was[q] - now[q], left: now[q]});
        }
        for (const gu of guKept(after, entrant.body)) {
            const fed = gu.quantities?.satiety, wasFed = before.holders[gu.id]?.quantities?.satiety;
            if (Number.isFinite(fed) && Number.isFinite(wasFed) && fed < wasFed) rows.push({kind: 'hungrier', who: id, gu: gu.id, satiety: fed, starved: fed <= 0});
        }
    }
    for (const [thing, position] of Object.entries(record.dropped ?? {}).sort(([a], [b]) => (a < b ? -1 : 1))) rows.push({kind: 'dropped', thing, position});
    return rows;
}
