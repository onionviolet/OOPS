// Direct-support move trials share research and ordered settlement. The world
// row names the specimens, native receipt fields and any follow-on activation.
import {applyEnergyEffect} from './energy_resources.js';
import {guCatalogue} from './gu_catalogue.js';
import {bindGuMove} from './gu_move_roles.js';
import {searchGuMoves} from './gu_move_search.js';
import {runGuActivations} from './gu_working_host.js';

const balances = amount => ({player: {primeval: amount}});
const interruptions = ['needs more essence', 'Gu unavailable'];

export function guMoveTrial(row) {
    const {id, world, place, energyId, core, supports, notes, errors, outcomeFields, progress = {}, crossing} = row;
    const supportIds = Object.keys(supports);
    const progressEntries = Object.entries(progress);
    const pinned = record => record?.extensions?.some(pin => pin.id === id);
    const stage = ({id, kind, ready}, state, reference) => ({
        gu: {id, kind, rank: 1, fedThrough: state.clock, alive: reference || !ready || ready(state)},
        operator: 'player', ability: guCatalogue[kind].ability.value,
    });
    const stages = (state, reference = false) => [
        ...Object.entries(supports).map(([id, member]) => stage({...member, id}, state, reference)),
        stage(core, state, reference),
    ];
    const routeReady = saved => !!saved && progressEntries.every(([flag]) => saved[flag]);
    const validGroup = group => Array.isArray(group) && group.length <= supportIds.length &&
        new Set(group).size === group.length && group.every((id, index) => supportIds.includes(id) &&
            (!notes.orderedSupports || index === 0 || supportIds.indexOf(id) > supportIds.indexOf(group[index - 1])));
    const validLast = (last, plans, saved) => last === null ||
        (last && Number.isSafeInteger(last.slot) && !!plans[last.slot - 1] &&
            Number.isSafeInteger(last.spent) && last.spent >= 0 && last.spent <= (notes.maxSpent ?? Infinity) &&
            (last.outcome === 'complete' ?
                Object.entries(outcomeFields).every(([field, {values}]) => values.includes(last[field])) &&
                progressEntries.every(([flag, {field, minimum}]) => last[field] < minimum || saved[flag]) :
                last.outcome === 'interrupted' && interruptions.includes(last.reason)));

    function read(state) {
        const raw = state.worlds[world]?.facts?.[notes.key];
        if (raw === undefined) return null;
        if (typeof raw !== 'string' || raw.length > 4096) throw Error(errors.invalidNotes);
        const saved = JSON.parse(raw);
        const {plans, last} = saved;
        if (!Array.isArray(plans) || !plans.length || plans.length > row.slots || !plans.every(validGroup) ||
            new Set(plans.map(group => group.join())).size !== plans.length ||
            !progressEntries.every(([flag]) => typeof saved[flag] === 'boolean') ||
            !validLast(last, plans, saved)) throw Error(errors.disagree);
        return notes.keepExtra ? saved : {plans, last};
    }

    const planFacts = saved => Object.fromEntries(Array.from({length: row.slots}, (_, index) =>
        [`${id}.plan_${index + 1}`, index < (saved?.plans.length ?? 0)]));
    const castStages = (available, group) => [...group, core.id].map(id => available.find(stage => stage.gu.id === id));
    const quote = (state, bound, reserve) => runGuActivations({stages: bound, reserves: balances(reserve), day: state.clock});
    const outcome = effect => Object.fromEntries(Object.entries(outcomeFields)
        .map(([field, {property}]) => [field, effect[property]]));

    function describePlans(state, saved) {
        // The old notes describe the written recipe with a full set and the
        // scene's reference reserve. Settlement uses the current world instead.
        const available = stages(state, true);
        const known = row.knownMove && bindGuMove(row.knownMove, available)[0].stages.map(stage => stage.gu.id).join();
        return (saved?.plans ?? []).map((group, index) => {
            const bound = castStages(available, group);
            const result = quote(state, bound, row.referenceReserve);
            return {slot: index + 1, names: group.map(id => supports[id].label),
                ...(row.knownMove && {known: bound.map(stage => stage.gu.id).join() === known}),
                cost: row.referenceReserve - result.remaining.player.primeval, ...outcome(result.effects[0])};
        });
    }

    function apply(state, {operation, slot}, context, registry) {
        if (context.actorId !== 'player' || !pinned(context.structuredNative) || state.actors.player.worldId !== world ||
            state.simulation.people.player.location !== place || (row.admitted && !row.admitted(state))) {
            throw Error(errors.admission);
        }
        const reserve = state.simulation.energies.player?.[energyId]?.reserve ?? 0;
        const available = stages(state);
        const facts = state.worlds[world].facts;
        if (operation === row.research) {
            const saved = progressEntries.length ? read(state) : null;
            const {options} = searchGuMoves({available: available.filter(stage => stage.gu.alive), day: state.clock,
                reserves: balances(reserve), effect: row.effect, maxSupports: supportIds.length});
            if (!options.length) throw Error(errors.research);
            facts[notes.key] = JSON.stringify({
                ...Object.fromEntries(progressEntries.map(([flag]) => [flag, saved?.[flag] ?? false])),
                plans: options.map(option => option.supports), last: null,
            });
            return;
        }
        const saved = read(state);
        const crosses = crossing && operation === crossing.operation;
        const group = saved?.plans[slot - 1];
        if (crosses ? !routeReady(saved) : !group) throw Error(errors.plan);
        const bound = crosses ? [stage(crossing.specimen, state, false)] : castStages(available, group);
        const result = quote(state, bound, reserve);
        const effect = result.effects[0];
        if (crosses && effect?.kind !== crossing.effect) throw Error(crossing.unfunded);
        const spent = reserve - result.remaining.player.primeval;
        for (let unit = 0; unit < spent; unit++) {
            applyEnergyEffect(state, 'player', {energyId, operation: 'use', output: 1, control: 1}, registry);
        }
        if (crosses) return;
        const receipt = {slot, spent, outcome: result.outcome};
        const measured = effect ? outcome(effect) : {reason: result.reason};
        if (effect) {
            for (const [flag, {field, minimum}] of progressEntries) saved[flag] ||= measured[field] >= minimum;
        }
        saved.last = {...Object.fromEntries(notes.receiptOrder.map(field => [field, receipt[field]])), ...measured};
        facts[notes.key] = JSON.stringify(saved);
    }

    return {pinned, read, stages, planFacts, routeReady, describePlans, apply};
}
