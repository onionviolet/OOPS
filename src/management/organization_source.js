// Courtyard adapter: builds the organization descriptor for the Market courtyard (a household business)
// from facts the courtyard already keeps. Read-only; no new state, no new save field.
import {I} from './shared.js';
import {rankOf, ladderFor} from '../faction_rank.js';

const named = label => { const i = label.indexOf(', '); return i < 0 ? {name: label, role: ''} : {name: label.slice(0, i), role: label.slice(i + 2)}; };
const MEMBERS = [I.mira, I.orin, I.sela, I.bram];
const itemName = key => { try { return JSON.parse(key).id; } catch { return String(key); } };
const sum = (effects, pick) => (effects || []).filter(pick).reduce((t, e) => t + e.amount, 0);

export function courtyardOrganization(state, registry, context = {}) {
    const s = state.simulation;
    if (!s || state.actors?.player?.facts?.['mg.opened'] !== true) return null;
    const jobs = s.jobs.filter(j => (j.actorId === 'player' || j.actorId === I.orin) && j.commandId.startsWith('mg.'));
    const members = MEMBERS.filter(id => s.people[id]).map(id => {
        const p = s.people[id], own = jobs.find(j => j.actorId === id || (j.participants || []).includes(id) || j.targetId === id && j.actorId === 'player');
        const here = p.location === (context.facts?.location || 'Village') && p.life === 'alive';
        const work = jobs.find(j => j.actorId === id) || jobs.find(j => j.targetId === id);
        return {id, ...named(registry.simulation.people?.get?.(id)?.label || p.label || id), present: here, doing: work ? work.label.split(' · ')[0] : here ? 'free' : 'away', note: own && own.actorId !== id ? 'waiting on your job' : ''};
    });
    const operations = jobs.map(j => ({
        id: j.id, label: (registry.simulation.commands.get(j.commandId)?.label || j.label).split(' · ')[0], who: j.actorId === 'player' ? 'you' : named(s.people[j.actorId]?.label || j.actorId).name, timeLeft: j.due - state.clock,
        held: (j.costs || []).filter(c => c.type === 'item' && c.amount < 0).map(c => `${-c.amount} ${itemName(c.key)}`),
        pays: (j.effects || []).filter(e => e.type === 'resource' && e.amount > 0).map(e => `${e.amount} ${e.key === 'money' ? 'coins' : e.key}`),
    }));
    const program = s.programs?.player;
    if (program?.commandId?.startsWith('mg.')) operations.push({id: 'mandate', label: `Repeat ${registry.simulation.commands.get(program.commandId)?.label?.split(' · ')[0] || 'recipe'}`, who: 'you', timeLeft: NaN, state: program.status === 'paused' ? 'paused' : 'running', held: [], pays: [], timeText: `${program.remaining} repetition${program.remaining === 1 ? '' : 's'} left`});
    const onHand = context.external?.money ?? context.money;
    const committedOut = jobs.reduce((t, j) => t - sum(j.costs, c => c.type === 'resource' && c.key === 'money' && c.amount < 0), 0);
    const expectedIn = jobs.reduce((t, j) => t + sum(j.effects, e => e.type === 'resource' && e.amount > 0 && (e.key === 'money' || e.key === 'coins' && e.actor === 'player')), 0);
    const reputation = context.gameplay?.player?.reputation?.Village ?? context.villageReputation;
    const standing = Number.isFinite(reputation) ? (() => { const r = rankOf('Village', reputation); return {label: 'Village standing', rank: r.name, feeling: r.feeling, value: r.value, next: r.next ? {name: r.next.name, at: r.next.at} : null}; })() : null;
    const ladder = standing ? ladderFor('Village').map((rung, i, all) => ({label: rung.name, state: rung.name === standing.rank ? 'current' : rankOf('Village', reputation).index > i ? 'done' : 'pending'})) : [];
    const holdings = [{id: I.bench, label: 'Shared workbench'}, {id: I.room, label: 'Concession room', note: state.actors.player.facts['mg.roomOwned'] ? 'yours' : 'not yours yet'}, {id: I.plot, label: 'Planting plot'}];
    return {id: 'courtyard', name: 'Market courtyard', kind: 'household_business', members, operations, holdings, ladder, standing,
        money: {onHand: Number.isFinite(onHand) ? onHand : undefined, committedOut: committedOut || undefined, expectedIn: expectedIn || undefined}};
}
