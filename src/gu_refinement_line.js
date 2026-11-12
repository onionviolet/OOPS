// A row-driven native adapter for two-input refinement, feeding, essence and trial casts.
// Existing native ledgers retain their shape; workings quote each transition (KW4, KW11, MC4).
import {guCatalogue} from './gu_catalogue.js';
import {cancelGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {validateGuClaims} from './gu_world_claims.js';
import {runGuStep} from './gu_working_host.js';

export function refinementLine(config, ports = {}) {
    const {id, world, kind, ops, casts} = config;
    const recipe = guCatalogue[kind].recipe.value;
    const conversion = guCatalogue[kind].conversion.value;
    const output = `${id}.specimen`, key = `${id}.work`;
    const operations = [...Object.values(ops).filter(op => ![ops.buy, ops.collect].includes(op)), ...casts.map(cast => cast.op)];
    const done = (state, op) => op ? state.actors.player.completed[`${id}.${op}`] ?? 0 : 0;
    const pinned = record => record?.extensions?.some(pin => pin.id === id);
    const latest = row => row?.world.attempts.at(-1);
    const cost = cast => cast.cost ?? guCatalogue[cast.kind].ability.value.cost;
    const stock = state => done(state, ops.convert) * conversion.yield -
        casts.reduce((sum, cast) => sum + (cast.funded ? 0 : done(state, cast.op) * cost(cast)), 0);
    function read(state) {
        const raw = state.worlds[world]?.facts?.[key];
        if (raw === undefined) return null;
        if (typeof raw !== 'string') throw Error('Invalid refinement line record.');
        const row = JSON.parse(raw);
        const at = value => Number.isSafeInteger(value) && value >= 0 && value <= state.clock;
        if (!at(row.startedAt) || row.fedAt !== null && !at(row.fedAt) ||
            !Array.isArray(row.world?.gu) || !Array.isArray(row.world?.attempts) || !latest(row)) {
            throw Error('Invalid refinement line work.');
        }
        return row;
    }
    const fed = (state, row) => row?.fedAt != null && state.clock - row.fedAt < config.mealMinutes;
    const committed = state => ['working', 'complete'].includes(latest(read(state))?.status);
    function actions(state, parent, parentFed = true, childCommitted = false) {
        const row = read(state), status = latest(row)?.status, complete = status === 'complete';
        return {
            ...(ops.buy && {[ops.buy]: !!parent && !done(state, ops.buy)}),
            [ops.prepare]: !!parent && (!config.requiresParentFed || parentFed) &&
                (!ops.buy || done(state, ops.buy) === 1) && !['working', 'complete'].includes(status),
            [ops.finish]: status === 'working' && state.clock >= row.startedAt + config.minutes,
            [ops.cancel]: status === 'working', [ops.feed]: complete && !childCommitted && !fed(state, row),
            [ops.convert]: complete && !childCommitted && fed(state, row),
            ...Object.fromEntries(casts.map(cast => [cast.op, (cast.funded ? complete : stock(state) >= cost(cast)) &&
                (!cast.port || ports.ready(state, cast))])),
            ...(ops.collect && {[ops.collect]: casts.some(cast => !cast.funded && done(state, cast.op) > 0) && !done(state, ops.collect)}),
        };
    }
    function view(state, record) {
        const row = read(state);
        if (!row || !pinned(record)) return null;
        const status = latest(row).status;
        return {status, ...(config.holdMinutes ? {
            readyIn: Math.max(0, row.startedAt + config.minutes - state.clock),
            closesIn: Math.max(0, row.startedAt + config.holdMinutes - state.clock),
        } : {remaining: status === 'working' ? Math.max(0, row.startedAt + config.minutes - state.clock) : 0}),
        fed: fed(state, row), stock: stock(state), ...Object.fromEntries(casts.map(cast => [cast.field, row[cast.field]]))};
    }
    function validate(state, record, parent) {
        const row = read(state), bought = done(state, ops.buy), collected = done(state, ops.collect);
        if (bought > 1 || collected > 1 || collected > casts.reduce((n, cast) => n + (cast.funded ? 0 : done(state, cast.op)), 0) ||
            (!row && operations.some(op => done(state, op))) || ((bought || row) && (!parent || !pinned(record)))) {
            throw Error('The refinement needs its living inputs and matching receipts.');
        }
        if (!row) return;
        validateGuClaims(row.world);
        const {gu, attempts} = row.world, status = latest(row).status;
        const complete = status === 'complete', finished = Number(complete);
        const settled = done(state, ops.finish), cancelled = done(state, ops.cancel);
        if ((ops.buy && bought !== 1) || attempts.length !== done(state, ops.prepare) ||
            attempts.length !== settled + cancelled + Number(status === 'working') ||
            attempts.filter(job => job.status === 'cancelled').length !== cancelled ||
            attempts.filter(job => job.status === 'complete').length !== finished ||
            attempts.filter(job => job.status === 'failed').length !== settled - finished ||
            (!config.holdMinutes && settled > 1) ||
            attempts.some((job, index) => job.id !== `${config.attemptPrefix}-${index + 1}` || job.refiner !== 'player' ||
                job.productId !== output || job.ingredients?.first !== parent.id || job.ingredients.second !== config.second ||
                JSON.stringify(job.recipe) !== JSON.stringify(recipe) ||
                !['working', 'complete', 'failed', 'cancelled'].includes(job.status) ||
                job.cursor !== (['complete', 'failed'].includes(job.status) ? recipe.stages.length : 1) ||
                (job.status === 'failed' && !config.holdMinutes) ||
                index < attempts.length - 1 && !['failed', 'cancelled'].includes(job.status)) ||
            gu.length !== 2 + finished || !gu.slice(0, 2).every((specimen, index) =>
                specimen.id === [parent.id, config.second][index] && specimen.kind === recipe.ingredients.first &&
                specimen.rank === config.inputRank && specimen.holder === 'player' && specimen.alive === !complete &&
                specimen.fate === (complete ? 'consumed' : undefined)) ||
            JSON.stringify(gu[0].provenance) !== JSON.stringify(parent.provenance) ||
            (complete && !gu.some(specimen => specimen.id === output && specimen.kind === kind && specimen.rank === recipe.rank &&
                specimen.holder === 'player' && specimen.alive && specimen.provenance?.ingredients.first === parent.id &&
                specimen.provenance.ingredients.second === config.second)) ||
            (row.fedAt !== null) !== (done(state, ops.feed) > 0) || stock(state) < 0 ||
            (!complete && (row.fedAt !== null || done(state, ops.convert) || casts.some(cast => done(state, cast.op)))) ||
            casts.some(cast => (row[cast.field] !== undefined) !== casts.some(other => other.field === cast.field && done(state, other.op) > 0) ||
                row[cast.field] !== undefined && !cast.values.includes(row[cast.field]))) {
            throw Error('The refinement, lineage and essence receipts disagree.');
        }
    }
    function apply(state, record, operation, parent, parentFed = true, childCommitted = false) {
        if (!pinned(record) || !actions(state, parent, parentFed, childCommitted)[operation]) throw Error('The Gu work is unavailable.');
        const row = read(state) ?? {world: {gu: [parent.id, config.second].map(identity => ({
            id: identity, kind: recipe.ingredients.first, rank: config.inputRank, holder: 'player', alive: true,
            ...(identity === parent.id && {provenance: parent.provenance}),
        })), attempts: [], stocks: {}}, startedAt: null, fedAt: null};
        const job = latest(row);
        if (operation === ops.prepare) {
            const attempt = `${config.attemptPrefix}-${done(state, operation) + 1}`;
            const materials = Object.fromEntries(recipe.stages[0].inputs.map(({material, amount}) => [material, amount]));
            const begun = runGuStep(kind, 'refine', {at: state.clock,
                facts: {world: {...row.world, stocks: {player: materials}}},
                options: {action: 'begin', attempt, ingredients: {first: parent.id, second: config.second}, productId: output}});
            row.world = runGuStep(kind, 'refine', {at: state.clock, facts: begun.facts, options: {action: 'stage'}}).facts.world;
            row.startedAt = state.clock;
        } else if (operation === ops.finish) {
            // The law has no controlFailed option yet. This timed host policy uses the same refinement leaf.
            row.world = config.holdMinutes && state.clock >= row.startedAt + config.holdMinutes
                ? stepGuRefinement(row.world, job.id, {controlFailed: true})
                : runGuStep(kind, 'refine', {at: state.clock, facts: {world: row.world, attempt: job.id}, options: {action: 'stage'}}).facts.world;
        } else if (operation === ops.cancel) row.world = cancelGuRefinement(row.world, job.id);
        else if (operation === ops.feed) row.fedAt = state.clock;
        else if (operation === ops.convert) {
            // Native input costs and completion counters own the balance. Quote the same conversion before publishing.
            const pool = `primeval.r${conversion.rank}.${conversion.from ?? 'initial'}`;
            runGuStep(kind, 'convert', {at: state.clock, specimen: {...row.world.gu.find(gu => gu.id === output), fedThrough: state.clock},
                facts: {reserves: {player: {[pool]: conversion.cost}}}});
        } else {
            const cast = casts.find(cast => cast.op === operation);
            if (cast) {
                if (cast.port) row[cast.field] = ports.activate(state, record, {stage: cast.stage, reserve: cost(cast)});
                else {
                    const rank = guCatalogue[cast.kind].parts.value.rank[0];
                    const result = runGuStep(cast.kind, 'activate', {at: state.clock,
                        specimen: {id: `${id}.${cast.kind.replaceAll('-', '_')}`, kind: cast.kind, rank, fedThrough: state.clock},
                        facts: {reserves: {player: {[cast.pool]: cast.funded ? cost(cast) : stock(state)}}},
                        options: {pool: cast.pool, rank, stage: cast.stage, source: cast.source}});
                    const magnitude = result.effects[0]?.magnitude;
                    if (cast.minimum !== undefined && magnitude < cast.minimum || cast.below !== undefined && magnitude >= cast.below) {
                        throw Error('The Gu could not settle the crossing.');
                    }
                    row[cast.field] = magnitude;
                }
            }
        }
        state.worlds[world].facts[key] = JSON.stringify(row);
    }
    return {operations, actions, view, validate, apply, committed,
        specimen: state => read(state)?.world.gu.find(gu => gu.id === output)};
}
