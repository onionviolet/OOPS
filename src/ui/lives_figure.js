// Spacetime slice: the Continuing connection's lives as a figure spec (a pure read adapter over
// continuationView; no save change). Lives are nodes, reciprocal routes are edges, each life's return
// points are a track, and what carries over versus what the world forgets are notes in words (UR37).
// A rewind drops the future it leaves, so no abandoned branch is drawn: the save does not record one.
export const MAX_LIVES_DRAWN = 8, MAX_TRACKS = 4, COLUMNS = 3;
const stamp = t => t ? `Y${t.year} ${t.month}/${t.day}` : 'not set';

function lifeState(life) {
    if (life.active) return life.challenge ? 'strained' : 'current';
    return life.reachable === false ? 'broken' : 'filled';
}

/** view: the shape continuationView returns, extended with lives[] for the figure (see livesFromView). */
export function livesFigure(view, options = {}) {
    if (!view || !view.available) {
        return {id: 'lives-none', size: 560, title: 'Lives and rewinds', summary: 'No connection yet. One life so far, nothing to rewind to.',
            nodes: [{id: 'now', label: 'This life', at: 'center', state: 'current'}],
            notes: [{text: 'Establish the connection to mark a return point. Nothing earlier is invented.'}]};
    }
    const lives = view.lives.slice(0, MAX_LIVES_DRAWN), hidden = view.lives.length - lives.length;
    const cols = Math.min(COLUMNS, lives.length), rows = Math.ceil(lives.length / COLUMNS);
    const at = i => [cols === 1 ? 0 : -.8 + 1.6 * (i % COLUMNS) / (cols - 1), rows === 1 ? 0 : -.55 + 1.1 * Math.floor(i / COLUMNS) / (rows - 1)];
    const nodes = lives.map((life, i) => ({id: life.id, label: life.label, glyph: String(i + 1), at: at(i), state: lifeState(life), effect: life.active ? 'glow' : undefined}));
    const edges = [];
    for (const life of lives) if (life.tether && life.reachable !== false && lives.some(o => o.id === life.tether)) edges.push({from: life.id, to: life.tether, kind: life.challenge ? 'shelved parent' : 'route', label: life.challenge ? 'returns here' : undefined});
    const tracks = lives.filter(l => l.active || l.paused).slice(0, MAX_TRACKS).map(life => ({id: `pts-${life.id}`, label: life.label, steps: [
        {label: `Start ${stamp(life.initial)}`, state: life.initialBlocked ? 'broken' : 'done'},
        {label: `Later point ${stamp(life.checkpoint)}`, state: !life.checkpoint ? 'empty' : life.checkpointReachable === false ? 'broken' : 'done'},
        {label: life.active ? 'Now' : `Paused ${stamp(life.paused)}`, state: life.active ? 'current' : 'pending'}]}));
    const notes = [];
    if (hidden > 0) notes.push({state: 'unknown', text: `${hidden} more lives are not drawn; open the list below for all of them.`});
    if (view.challenge) notes.push({state: 'strained', text: 'An isolated challenge is running. Your original life is shelved and returns when you finish or cancel.'});
    if (view.loop && view.loop.enabled) notes.push({state: 'active', text: `Repeat loop is on: every five played minutes you return to the ${view.loop.target === 'initial' ? 'initial' : 'later'} point. ${view.loop.cycles} cycles so far.`});
    const carried = (view.carried || []).filter(Boolean);
    notes.push({text: `You remember: ${view.memoryCount || 0} life events${carried.length ? `; learned skills ${carried.join(', ')}` : ''}. The world and body rewind to the chosen point; remembered learning and connection upgrades carry.`});
    return {id: 'lives-tree', size: options.size || 640, title: 'Your lives and return points',
        summary: `${lives.length} ${lives.length === 1 ? 'life' : 'lives'} in one connection. You are in ${(lives.find(l => l.active) || lives[0]).label}.`,
        nodes, edges, tracks, notes,
        legend: [{state: 'current', label: 'the life you are in'}, {state: 'filled', label: 'paused, you can resume it'}, {state: 'broken', label: 'paused, no route back'}, {state: 'strained', label: 'isolated challenge'}, {kind: 'route', label: 'a way between two lives'}]};
}

/** Maps continuationView(save) onto the livesFigure input; reads only what the view already exposes. */
export function livesFromView(view, activeLabel = 'This life') {
    if (!view || !view.available) return {available: false};
    const paused = (view.paused || []).map(p => ({id: p.id, label: p.label, paused: p.date, initial: p.initialDate, checkpoint: p.checkpointDate, reachable: p.reachable, tether: view.activeId, active: false}));
    const active = {id: view.activeId || 'active', label: view.life || activeLabel, active: true, challenge: !!view.challenge, initial: view.initialDate, checkpoint: view.checkpointDate,
        initialBlocked: !!view.initialBlocked, checkpointReachable: view.checkpointReachable, tether: null};
    return {available: true, lives: [active, ...paused], challenge: view.challenge, loop: view.loop, memoryCount: (view.memories || []).length,
        carried: (view.mastery || []).filter(m => m.usable).map(m => m.skill)};
}
