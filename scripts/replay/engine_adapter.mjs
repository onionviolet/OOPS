// Replay adapter for the headless expansion engine with the shipped expedition
// content. A run is the durable envelope the engine consumes plus host facts
// (native location etc.) that the browser game would supply. Native-only
// returns (nativePatch, acquisitions for the item log) are host publication
// work and stay outside this adapter's durable JSON.
import {createExpansionState, loadExpansionState, evaluateAction, commitAction, cancelAction, advanceSimulation} from '../../src/expansion_engine.js';
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand, cancelSimulationJob, previewSimulationResponse,
    respondSimulationEvent, answerSimulationEncounter, withdrawSimulationEncounter, waitingSimulationChoice, nextSimulationBoundary} from '../../src/simulation.js';
import {withSimulationFrame} from '../../src/simulation_render.js';
import {initializeExpedition, expeditionRegistry} from '../../src/expedition_content.js';
import {registerReplayAdapter} from './replay_core.mjs';

const WOOD = JSON.stringify({id: 'Rough wood log'});
const START_FACTS = {location: 'Village', 'village.craftsmanMet': true, 'village.shackUnlocked': true};
const DURABLE = ['state', 'external', 'gameplay', 'equipment', 'ownership', 'vitals', 'facts'];
const plain = v => JSON.parse(JSON.stringify(v));

function context(run, extra = {}) {
    return {actorId: 'player', worldId: run.state.actors.player.worldId, external: run.external, gameplay: run.gameplay,
        vitals: run.vitals, equipment: run.equipment, facts: run.facts, ...extra};
}
// Engine transactions return a plan; keep only the durable domains it owns.
function merge(run, out) {
    const next = {...run};
    for(const key of ['state', 'external', 'gameplay', 'equipment', 'ownership', 'vitals']) if(out[key] !== undefined) next[key] = out[key];
    return next;
}

export function createEngineAdapter(registry = expeditionRegistry, {id = 'engine.expedition', locations} = {}) {
    const commands = [...registry.simulation.commands.values()];
    const places = locations || [...new Set(commands.map(d => d.location).filter(Boolean))].sort();
    const byPlace = new Map();
    for(const d of commands) {
        const key = d.location || '';
        if(!byPlace.has(key)) byPlace.set(key, []);
        byPlace.get(key).push(d.id);
    }
    const actionIds = [...registry.actions.keys()];
    // Every skill the content can award, so XP effects have a native receiver.
    const found = new Set(['Climbing']);
    const walk = v => {
        if(Array.isArray(v)) v.forEach(walk);
        else if(v && typeof v === 'object') {if(v.type === 'xp' && typeof v.skill === 'string') found.add(v.skill); Object.values(v).forEach(walk);}
    };
    walk([...registry.actions.values(), ...commands]);
    const skills = [...found].sort();

    return registerReplayAdapter({
        id,
        newSave(seed) {
            const state = initializeExpedition(createExpansionState(seed >>> 0 || 1));
            const run = {state, external: {money: 200}, gameplay: {player: {inventory: {[WOOD]: 40},
                skills: Object.fromEntries(skills.map(name => [name, {xp: 0, enabled: true}])), reputation: {Village: 0}}},
            equipment: {}, ownership: {}, vitals: {}, facts: {...START_FACTS}};
            return this.save(merge(run, enrollSimulation(state, registry, context(run))));
        },
        load(save) {
            const run = plain(save);
            return {...run, state: loadExpansionState(run.state, registry)};
        },
        save(run) {return plain(Object.fromEntries(DURABLE.map(k => [k, run[k] ?? {}])));},
        clock: run => run.state.clock,
        apply(run, cmd) {
            const ctx = context(run);
            switch(cmd.k) {
            case 'advance': {
                const out = advanceSimulation(run.state, registry, cmd.minutes, run.external, run.gameplay,
                    {player: {facts: run.facts, vitals: run.vitals.player, equipment: run.equipment.player}});
                return merge(run, out);
            }
            case 'action': return merge(run, commitAction(run.state, registry, cmd.id, ctx));
            case 'cancel': return merge(run, cancelAction(run.state, registry, cmd.jobId, ctx));
            case 'sim': return merge(run, commitSimulationCommand(run.state, registry, {id: cmd.id},
                cmd.targetId ? {...ctx, targetId: cmd.targetId} : ctx));
            case 'simCancel': return merge(run, cancelSimulationJob(run.state, registry, cmd.jobId, ctx));
            case 'respond': return merge(run, respondSimulationEvent(run.state, registry, cmd.eventId, cmd.responseId, ctx));
            case 'answer': return merge(run, answerSimulationEncounter(run.state, registry, cmd.responseId, ctx));
            case 'withdraw': return merge(run, withdrawSimulationEncounter(run.state, ctx));
            // Native travel changes a host fact only; the engine reads it next command.
            case 'travel':
                if(!places.includes(cmd.location)) throw Error(`Unknown replay location: ${cmd.location}`);
                return {...run, facts: {...run.facts, location: cmd.location}};
            default: throw Error(`Unknown replay command kind: ${cmd.k}`);
            }
        },
        candidates(run, choose) {
            // Ids seen eligible earlier in this recording: a per-recorder sampling hint.
            const {state} = run, ctx = context(run), out = [], hot = choose.hot ||= new Set();
            const session = state.simulation?.sessions?.player;
            if(session && !session.nativeBattle) {
                for(const r of session.turns[session.turn]?.responses || [])
                    if(previewSimulationResponse(state, registry, {kind: 'encounter', responseId: r.id}, ctx).eligible)
                        out.push({cmd: {k: 'answer', responseId: r.id}, weight: 4});
                out.push({cmd: {k: 'withdraw'}, weight: 1});
                return out;
            }
            for(const e of Object.values(state.simulation?.events || {})) {
                if(e.status !== 'open' || e.actorId !== 'player' || !e.discoveredBy.includes('player')) continue;
                for(const r of e.responses || [])
                    if(previewSimulationResponse(state, registry, {kind: 'event', eventId: e.id, responseId: r.id}, ctx).eligible)
                        out.push({cmd: {k: 'respond', eventId: e.id, responseId: r.id}, weight: 3});
            }
            if(waitingSimulationChoice(state) && out.length) return out;
            const blocked = Object.values(state.opportunities).some(o => o.status === 'available' && o.blocking);
            for(const id of actionIds) {
                try {if(evaluateAction(state, registry, id, ctx).eligible) out.push({cmd: {k: 'action', id}, weight: 2});} catch {}
            }
            // Previewing all ~1,400 commands costs about a second; a seeded sample
            // plus earlier-eligible ids keeps each step cheap and still legal.
            const local = [...(byPlace.get(run.facts.location) || []), ...(byPlace.get('') || [])];
            const pool = [...new Set([...choose.sample(local, 40), ...[...hot].filter(id => local.includes(id)).sort()])];
            withSimulationFrame(state, () => {
                for(const id of pool) {
                    const d = registry.simulation.commands.get(id), targetId = d.targetId || undefined;
                    try {
                        if(previewSimulationCommand(state, registry, id, targetId ? {...ctx, targetId} : ctx).eligible) {
                            hot.add(id); out.push({cmd: targetId ? {k: 'sim', id, targetId} : {k: 'sim', id}, weight: 2});
                        }
                    } catch {}
                }
            });
            for(const job of state.pending) if(job.context.actorId === 'player' && job.cancellation && job.cancellation !== 'none')
                out.push({cmd: {k: 'cancel', jobId: job.id}, weight: 0.5});
            for(const job of state.simulation?.jobs || []) if(job.actorId === 'player' && job.cancellation && job.cancellation !== 'none')
                out.push({cmd: {k: 'simCancel', jobId: job.id}, weight: 0.5});
            if(!blocked) {
                const due = nextSimulationBoundary(state), toBoundary = Number.isSafeInteger(due) && due > state.clock ? due - state.clock : null;
                out.push({cmd: {k: 'advance', minutes: toBoundary && choose.unit() < 0.6 ? Math.min(toBoundary, 1440) : choose.int(1, 120)}, weight: 3});
            }
            out.push({cmd: {k: 'travel', location: choose.pick(places)}, weight: 0.5});
            return out;
        },
    });
}

export const engineAdapter = createEngineAdapter();
