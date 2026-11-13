// PC95 / ENF20. Advance the world to the next contest boundary, then
// refresh the workshop defender's worn protection before the contest acts.
import {stepContest} from '../contest.js';
import {advanceEngineWorld} from '../engine_world.js';
import {nextWorkingDeadline} from '../kernel_working.js';
import {wornBreastplateProfile} from './fire_resistant_lining.js';
import {CONTEST_RESOLVERS} from '../contest_resolvers.js';
import {wornStrikeEdgePower} from './strike_enchantment.js';

export const workshopContestResolvers = {
    bladeCut(args) {
        const {actor, move} = args;
        return CONTEST_RESOLVERS.strike({...args, move: {...move,
            power: (move.power ?? 1) + (actor.profile.edgePower ?? 0)}});
    },
};

export function stepWorkshopContest(law, record, engine, {defender, startedAt, ticksPerMinute}) {
    if (record.result) return {record, engine};
    if (!Number.isSafeInteger(startedAt) || startedAt < 0 || !Number.isSafeInteger(ticksPerMinute) || ticksPerMinute < 1)
        throw Error('The workshop contest needs a world start minute and a tick rate.');
    const entrant = record.entrants[defender];
    if (!entrant) throw Error('The workshop defender must be a contest entrant.');
    const next = Math.min(...Object.values(record.entrants).filter(entrant => entrant.status === 'in')
        .map(entrant => entrant.working?.status === 'running' ? nextWorkingDeadline(entrant.working) : entrant.ready));
    const tick = Math.max(record.clock, Number.isFinite(next) ? next : record.clock);
    const minute = startedAt + Math.floor((tick - record.startedAt) / ticksPerMinute);
    const {engine: current, pending} = advanceEngineWorld(engine, minute);
    if (pending) return {record, engine: current, pending};
    const profile = {...entrant.profile};
    delete profile.armor;
    delete profile.defenseTypes;
    Object.assign(profile, wornBreastplateProfile(current.world, entrant.body));
    const refreshed = {...record, entrants: {...record.entrants, [defender]: {...entrant, profile}}};
    const settled = stepContest(law, refreshed, current.rules, current.world, {
        profile: (view, _record, world) => ({...view.profile, edgePower: wornStrikeEdgePower(world, view.body)}),
    });
    return {record: settled.record, engine: {...current, world: settled.world}};
}
