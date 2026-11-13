// Native acquisition/refinement/trial ledgers driven by specimen slots, branches and probe rows.
// Recipe and activation transitions use gu.working; hosts retain native counters and saved records.
import {guCatalogue} from './gu_catalogue.js';
import {cancelGuRefinement} from './gu_refinement.js';
import {observeGuCloak} from './gu_concealment.js';
import {validateGuClaims} from './gu_world_claims.js';
import {runGuStep} from './gu_working_host.js';

export function guRefinementTrial(config) {
    const {id, world, key, specimens, branches, operations} = config;
    const pack = operation => operations[operation]?.pack ?? id;
    const place = operation => operations[operation]?.place ?? config.place;
    const done = (state, operation) => state.actors.player.completed[`${pack(operation)}.${operation}`] ?? 0;
    const pinned = (record, packId = id) => record?.extensions?.some(pin => pin.id === packId);
    const recipe = branch => guCatalogue[branch.kind].recipe.value;
    const latest = row => row?.world.attempts.at(-1);
    const identity = (slot, index = 0) => index === 0 ? specimens[slot].id : `${specimens[slot].id}.${index + 1}`;
    const held = (row, slot) => row?.world.gu.find(gu => gu.alive && (specimens[slot].repeated
        ? gu.kind === specimens[slot].kind : gu.id === specimens[slot].id));
    const branchOf = job => Object.values(branches).find(branch => recipe(branch).id === job?.recipe?.id);
    function read(state) {
        const raw = state.worlds[world]?.facts?.[key];
        if (raw === undefined) return null;
        if (typeof raw !== 'string') throw Error('Invalid refinement trial record.');
        return JSON.parse(raw);
    }
    function actions(state, row) {
        const job = latest(row), working = job?.status === 'working';
        return Object.fromEntries(Object.entries(operations).map(([name, op]) => {
            const branch = branches[op.branch];
            let ready = (!op.once || !done(state, name)) &&
                Object.entries(op.requires ?? {}).every(([required, count]) => done(state, required) === count) &&
                (!op.absent || op.absent.every(slot => !held(row, slot))) &&
                (!op.unlessAll || !op.unlessAll.every(slot => held(row, slot)));
            if (op.type !== 'acquire' && op.slot) ready &&= !!held(row, op.slot);
            if (op.uncommitted) ready &&= !working || !Object.values(job.ingredients).includes(held(row, op.slot)?.id);
            if (op.type === 'begin') ready &&= !working && !held(row, branch.output) &&
                Object.values(branch.ingredients).every(slot => held(row, slot));
            if (op.type === 'finish' || op.type === 'cancel') {
                ready &&= working && job.productId === specimens[branch.output].id &&
                    (op.type === 'cancel' || state.clock >= row.startedAt + branch.minutes);
            }
            return [name, !!ready];
        }));
    }
    const facts = state => Object.fromEntries(Object.entries(actions(state, read(state)))
        .map(([name, ready]) => [`${pack(name)}.can_${name}`, ready]));
    function view(state, record) {
        const row = read(state);
        if (!pinned(record) || !row) return null;
        const job = latest(row), status = job?.status ?? null, shape = config.view;
        return {...Object.fromEntries(Object.entries(shape.held).map(([field, slot]) => [field, !!held(row, slot)])),
            ...Object.fromEntries(Object.entries(shape.counted).map(([field, op]) => [field, done(state, op) > 0])),
            ...Object.fromEntries(Object.entries(shape.branch).map(([field, branch]) =>
                [field, job?.productId === specimens[branches[branch].output].id])),
            status, remaining: status === 'working' ? Math.max(0, row.startedAt + branchOf(job).minutes - state.clock) : 0,
            ...Object.fromEntries(shape.flags.map(field => [field, row[field]])),
            ...Object.fromEntries(shape.booleanFlags.map(field => [field, !!row[field]]))};
    }
    function validAttempt(job, index, gu, count) {
        const branch = branchOf(job);
        if (!branch || job.id !== `${config.attemptPrefix}-${index + 1}` || job.refiner !== 'player' ||
            job.productId !== specimens[branch.output].id || JSON.stringify(job.recipe) !== JSON.stringify(recipe(branch)) ||
            !['working', 'cancelled', 'complete'].includes(job.status) ||
            job.cursor !== (job.status === 'complete' ? recipe(branch).stages.length : 1) ||
            index < count - 1 && job.status === 'working') return false;
        const bindings = Object.entries(job.ingredients ?? {});
        return bindings.length === Object.keys(branch.ingredients).length && bindings.every(([role, identity]) => {
            const specimen = gu.find(gu => gu.id === identity);
            return !!specimen && specimen.kind === recipe(branch).ingredients[role] && specimen.holder === 'player' &&
                (job.status !== 'working' || specimen.alive);
        });
    }
    function validate(state, record) {
        const row = read(state), used = Object.keys(operations).filter(name => done(state, name));
        if (!row && !used.length) return;
        if (!row || !pinned(record) || used.some(name => !pinned(record, pack(name)))) {
            throw Error('The refinement trial needs its matching permissions and ledger.');
        }
        const {gu, attempts} = validateGuClaims(row.world);
        const finished = attempts.filter(job => job.status === 'complete');
        const consumed = new Set(finished.flatMap(job => Object.values(job.ingredients ?? {})));
        const acquisitions = Object.entries(operations).filter(([, op]) => op.type === 'acquire');
        const outputsValid = Object.values(branches).every(branch => {
            const jobs = attempts.filter(job => job.productId === specimens[branch.output].id);
            const complete = jobs.filter(job => job.status === 'complete');
            const output = gu.find(entry => entry.id === specimens[branch.output].id), procedure = recipe(branch);
            return jobs.length === done(state, branch.prepare) &&
                jobs.filter(job => job.status === 'cancelled').length === done(state, branch.cancel) &&
                complete.length === done(state, branch.finish) && complete.length <= 1 && !!output === !!complete.length &&
                (!output || output.kind === procedure.kind && output.rank === procedure.rank && output.alive &&
                    output.provenance?.recipe === procedure.id && output.provenance.revision === procedure.revision &&
                    JSON.stringify(output.provenance.ingredients) === JSON.stringify(complete[0].ingredients));
        });
        const inputsValid = Object.entries(specimens).filter(([slot]) => acquisitions.some(([, op]) => op.slot === slot))
            .every(([slot, descriptor]) => {
                const origins = acquisitions.filter(([, op]) => op.slot === slot).map(([name]) => name);
                const entries = gu.filter(entry => entry.kind === descriptor.kind);
                const count = origins.reduce((sum, op) => sum + done(state, op), 0);
                return entries.length === count && count <= descriptor.max && entries.filter(entry => entry.alive).length <= 1 &&
                    origins.every(op => entries.filter(entry => entry.origin === op).length === done(state, op)) &&
                    entries.every((entry, index) => entry.id === identity(slot, index) && entry.rank === descriptor.rank && origins.includes(entry.origin));
            });
        const known = new Set(Object.keys(specimens).flatMap(slot =>
            Array.from({length: specimens[slot].max ?? 1}, (_, index) => identity(slot, index))));
        if (!outputsValid || !inputsValid ||
            consumed.size !== finished.reduce((sum, job) => sum + Object.keys(job.ingredients ?? {}).length, 0) ||
            gu.some(entry => !known.has(entry.id) || entry.holder !== 'player' || entry.alive === consumed.has(entry.id) ||
                entry.fate !== (consumed.has(entry.id) ? 'consumed' : undefined)) ||
            attempts.some((job, index) => !validAttempt(job, index, gu, attempts.length)) ||
            (attempts.length === 0 ? row.startedAt !== null : !Number.isSafeInteger(row.startedAt) ||
                row.startedAt < record.initializedAt || row.startedAt > state.clock) ||
            Object.entries(operations).some(([name, op]) => (op.once && done(state, name) > 1) ||
                (done(state, name) > 0 && op.type === 'record' && !gu.some(entry => entry.id === specimens[op.slot].id)) ||
                (op.flag && ((Object.hasOwn(config.initial, op.flag) ? row[op.flag] : row[op.flag] ?? false) !== (done(state, name) > 0) ||
                    row[op.flag] && (!(op.persistAfterConsumption ? gu.some(entry => entry.id === specimens[op.slot].id) : held(row, op.slot)) ||
                        Object.keys(op.requires ?? {}).some(required => !done(state, required))))))) {
            throw Error('The acquisition, refinement and activation receipts disagree.');
        }
    }
    function apply(state, record, operation) {
        if (!pinned(record, pack(operation))) throw Error('Take up this refinement trial.');
        const row = read(state) ?? {world: {gu: [], attempts: [], stocks: {player: {}}}, startedAt: null, ...config.initial};
        if (!actions(state, row)[operation]) throw Error('The refinement trial is unavailable.');
        const op = operations[operation], branch = branches[op.branch], job = latest(row);
        if (op.type === 'acquire') {
            const descriptor = specimens[op.slot], count = row.world.gu.filter(gu => gu.kind === descriptor.kind).length;
            row.world.gu.push({id: identity(op.slot, count), kind: descriptor.kind, rank: descriptor.rank,
                holder: 'player', alive: true, origin: operation});
        } else if (op.type === 'begin') {
            const procedure = recipe(branch), attempt = `${config.attemptPrefix}-${row.world.attempts.length + 1}`;
            const materials = Object.fromEntries(procedure.stages[0].inputs.map(({material, amount}) => [material, amount]));
            const ingredients = Object.fromEntries(Object.entries(branch.ingredients).map(([role, slot]) => [role, held(row, slot).id]));
            const begun = runGuStep(branch.kind, 'refine', {at: state.clock,
                facts: {world: {...row.world, stocks: {player: materials}}},
                options: {action: 'begin', attempt, ingredients, productId: specimens[branch.output].id}});
            row.world = runGuStep(branch.kind, 'refine', {at: state.clock, facts: begun.facts, options: {action: 'stage'}}).facts.world;
            row.startedAt = state.clock;
        } else if (op.type === 'finish') row.world = runGuStep(branch.kind, 'refine', {
            at: state.clock, facts: {world: row.world, attempt: job.id}, options: {action: 'stage'}}).facts.world;
        else if (op.type === 'cancel') row.world = cancelGuRefinement(row.world, job.id);
        else if (op.type === 'probe' || op.type === 'guard') {
            const gu = held(row, op.slot), ability = guCatalogue[gu.kind].ability.value;
            const result = runGuStep(gu.kind, 'activate', {at: state.clock, specimen: {...gu, fedThrough: state.clock},
                options: config.supply, facts: {reserves: {player: {[config.supply.pool]: op.reserve}}}});
            if (op.type === 'guard') {
                if ((result.effects.find(effect => effect.kind === op.effect)?.magnitude ?? 0) < op.minimum) {
                    throw Error('The Gu could not stop the impact.');
                }
            } else {
                const mask = result.effects.find(effect => effect.kind === 'visual-concealment');
                if (!mask || !ability.maskedSurfaces) throw Error('The concealment Gu did not respond.');
                const cloak = {surfaces: ability.maskedSurfaces, magnitude: mask.magnitude};
                for (const probe of op.probes) {
                    const seen = observeGuCloak({senses: probe.senses, cloak});
                    if (probe.expect === null ? !!seen : !seen || Object.entries(probe.expect)
                        .some(([field, value]) => JSON.stringify(seen[field]) !== JSON.stringify(value))) {
                        throw Error('The observation did not match the trial.');
                    }
                }
            }
            row[op.flag] = true;
        }
        state.worlds[world].facts[key] = JSON.stringify(row);
    }
    return {pack, place, facts, view, validate, apply, specimen: (state, slot) => held(read(state), slot)};
}
