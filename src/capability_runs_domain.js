import {registerDomain} from './domain_registry.js';
import {readPort} from './ui_ports.js';
import {serializeEngineWorld} from './engine_world.js';
import {createCapabilityRunsPanel} from './ui/capability_runs.js';
import {fangLiquorWormRun} from './world_packs/gu_liquor_worm_run.js';
import {kleinGlacisRun} from './world_packs/lotm_bogda_consultation.js';
import {paradisePracticeRun} from './world_packs/paradise_sword_practice.js';

const runs = {fang: fangLiquorWormRun, klein: kleinGlacisRun, su: paradisePracticeRun};
// G6: whose world each run belongs to. The home hero's list shows all three; a lead's shows their own, or none.
export const RUN_WORLDS = Object.freeze({fang: 'book.ri.', klein: 'book.lotm.', su: 'book.paradise.'});
export const runShows = (id, world) => !world || world === 'base.frontier' || world.startsWith(RUN_WORLDS[id] || '\0');
const empty = () => ({version: 1, runs: {}});
let saved = empty(), ports, panel;

export function configureCapabilityRuns(operations) {
    ports = operations;
}

function validate(slice) {
    if (slice === undefined) return;
    if (!slice || slice.version !== 1 || !slice.runs || typeof slice.runs !== 'object' || Array.isArray(slice.runs)) {
        throw Error('This save has an unsupported capability run record.');
    }
    for (const [id, record] of Object.entries(slice.runs)) {
        if (!Object.hasOwn(runs, id)) throw Error('This save has an unknown capability run.');
        const run = runs[id];
        run.view(run.restore(record));
    }
}

function view(id) {
    const run = runs[id];
    const record = saved.runs[id];
    const active = record !== undefined;
    return {title: run.title, introduction: run.introduction, active, writable: ports?.writable() === true,
        ...(active ? run.view(run.restore(record)) : {})};
}

function commit(id, action) {
    if (!ports?.writable()) throw Error('Continue in the writable game tab.');
    const run = runs[id];
    if (!run) throw Error('Choose a capability run.');
    const current = saved.runs[id];
    const engine = action === 'begin' && !current ? run.create() : current && action !== 'begin' ? run.act(run.restore(current), action) : null;
    if (!engine) throw Error('That action is unavailable.');
    const previous = saved;
    saved = {...saved, runs: {...saved.runs, [id]: serializeEngineWorld(engine)}};
    let durable = false;
    try { ports.persist(() => { durable = true; }); }
    catch (error) {
        if (!durable) saved = previous;
        throw error;
    }
}

registerDomain({id: 'capabilityRuns', initialState: empty,
    save: () => Object.keys(saved.runs).length ? saved : undefined,
    validate, load: slice => {saved = slice ?? empty(); panel?.render();},
    panels: [() => {panel = createCapabilityRunsPanel({runs, read: view, commit, shows: id => runShows(id, readPort('expansion')?.actors?.player?.worldId)});}],
});
