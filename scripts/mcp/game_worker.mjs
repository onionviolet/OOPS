// Owns one headless game (scripts/headless/runner.mjs) for the game MCP server.
// It runs in its own process because the headless realm replaces Node's timers,
// Date and console; the MCP server keeps a clean realm and talks over IPC.
// Replies carry what a player could see, plus hashes. Raw saves never leave:
// export writes a file under the private temp folder and returns only its path.
import {boot, canonicalSave} from '../headless/runner.mjs';
import {advanceGame} from '../headless/advance.mjs';
import {scenarioSave, SCENARIOS} from '../headless/scenarios.mjs';
import {createHash, randomUUID} from 'node:crypto';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';

export const SCENARIO_NAMES = Object.keys(SCENARIOS);
export const EXPORT_DIR = join(tmpdir(), 'yairpg-mcp');
const send = process.send.bind(process);
let game = null, last = [], seen = new Map();   // seen: scope -> {lines, actions} of the last reply, for compact deltas

const need = () => {if(!game) throw new Error('No game yet. Call game_new first.'); return game;};
const text = id => game.document.getElementById(id)?.textContent.trim() ?? '';
const clock = () => {const t = game.snapshot()['current time']; return {day: t.day_count, hour: t.hour, minute: t.minute};};
const sha = s => createHash('sha256').update(s).digest('hex').slice(0, 16);

// The DOM shim's innerText includes hidden descendants. Walk visible text instead.
function visibleText(root) {
    const parts = [];
    const visit = node => {
        if(node.nodeType === 3) {parts.push(node.textContent); return;}
        if(node.nodeType !== 1 || /^(SCRIPT|STYLE|TEMPLATE)$/.test(node.tagName) || game.css.hiddenReason(node)) return;
        for(const child of node.childNodes) visit(child);
        parts.push('\n');
    };
    game.css.reset();
    visit(root);
    return parts.join(' ').replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Native travel/resource dropdowns use addEventListener on a div, without role,
// tabindex or inline onclick. Include that known player-control seam explicitly.
function controls(g) {
    const rows = g.clickables();
    for(const el of g.document.querySelectorAll('.location_choice_dropdown')) {
        if(!rows.some(c => c.el === el) && !el.disabled && !el.closest('[aria-disabled="true"]') && !g.css.hiddenReason(el)) {
            rows.push({el, key: '.location_choice_dropdown', text: el.textContent.trim().slice(0, 60)});
        }
    }
    return rows;
}

// Compact view: only what changed since this scope's last reply. Indices stay absolute
// in the full current list, so game_click({index}) works without a full game_look.
const ADDED_CAP = 120, ACTION_CAP = 60;
function tally(items) {const m = new Map(); for(const x of items) m.set(x, (m.get(x) ?? 0) + 1); return m;}
function compact(full, scope) {
    const lines = full.screen.split('\n').map(l => l.trim()).filter(Boolean);
    const acts = full.actions.map(a => ({...a, id: a.key + '|' + a.text}));
    const prev = seen.get(scope ?? '');
    const job = lines.find(l => /^(no work running|working|current work|doing:|you are (working|busy))/i.test(l)) ?? null;
    const header = {time: full.time, location: full.location, job, started: full.started, pageErrors: full.pageErrors};
    seen.set(scope ?? '', {lines: tally(lines), acts: tally(acts.map(a => a.id))});
    if(!prev) return {view: 'compact', baseline: true, ...header, screen: lines.join('\n').slice(0, 12000), actions: full.actions.slice(0, 80), actionCount: full.actionCount};
    const before = new Map(prev.lines), after = [];
    for(const l of lines) {const n = before.get(l) ?? 0; n ? before.set(l, n - 1) : after.push(l);}
    const removed = [...before].flatMap(([l, n]) => n > 0 ? [l] : []);
    const beforeActs = new Map(prev.acts), newActs = [];
    for(const a of acts) {const n = beforeActs.get(a.id) ?? 0; n ? beforeActs.set(a.id, n - 1) : newActs.push({index: a.index, key: a.key, text: a.text});}
    const goneActs = [...beforeActs].reduce((t, [, n]) => t + Math.max(0, n), 0);
    return {view: 'compact', baseline: false, ...header,
        addedLines: after.slice(0, ADDED_CAP), addedLineCount: after.length, removedLines: removed.slice(0, 20), removedLineCount: removed.length,
        newActions: newActs.slice(0, ACTION_CAP), newActionCount: newActs.length, removedActionCount: goneActs, actionCount: full.actionCount,
        note: 'Delta since the last reply for this scope. Action indices are absolute in the full current list as of this reply; any later reply renumbers, so re-read before clicking by index (or click by key/text).'};
}

function look({scope, offset = 0, view} = {}) {
    const full = lookFull({scope, offset, all: true});   // all actions, so deltas see past the 80-row page
    const reply = compact(full, scope);
    if(view === 'compact') return reply;
    return {...full, actions: full.actions.slice(offset, offset + 80)};
}

function lookFull({scope, offset = 0, all = false} = {}) {
    const g = need();
    const root = scope ? g.document.querySelector(scope) : g.document.body;
    if(!root) throw new Error(`No view for ${scope}`);
    last = controls(g).filter(c => root === c.el || root.contains(c.el));
    offset = Math.max(0, Math.floor(Number(offset) || 0));
    return {
        time: clock(), location: text('location_name_span'),
        started: !!g.hiddenReason(g.document.getElementById('loading_screen')) && g.document.documentElement.dataset.startScreen === 'closed',
        screen: visibleText(root).slice(0, 12000),
        actions: last.slice(all ? 0 : offset, all ? undefined : offset + 80).map((c, index) => ({index: index + (all ? 0 : offset), key: c.key, text: c.text})),
        actionCount: last.length, pageErrors: g.errors.length,
    };
}

// Choose an actual visible native select option. This dispatches the same
// input/change path as a player and cannot introduce an unavailable option.
async function selectOption(selector, value) {
    const g = need(), select = g.document.querySelector(selector);
    if(!select || select.tagName !== 'SELECT') throw new Error('Choose a native select control.');
    if(select.disabled || g.hiddenReason(select)) throw new Error('Select control is not actionable.');
    const option = [...select.querySelectorAll('option')].find(o => o.value === String(value));
    if(!option || option.disabled) throw new Error(`No available player option ${value}.`);
    await g.fill(select, String(value));
}

async function openPanel(id) {
    await selectOption('#workspace_navigation select[aria-label="Other known panels"]', id);
}

// A new, loaded or reloaded game: the first compact look is a baseline, not a delta.
const fresh = () => {const r = look(); seen = new Map(); return r;};

const ops = {
    captureState() {return {save:need().snapshot()};},
    quote({command}) {
        if(command !== 'lamp.toggle') throw Error('Unsupported quote command. Use lamp.toggle.');
        const q = need().module.scenarioLampOperations.quote();
        // Explicit observer-safe fields, not a generic registry or truth dump.
        return {command, quote:{eligible:q.eligible,reason:q.reason,action:q.action,spend:q.spend,oil:q.oil}};
    },
    async reload() {await need().reload(); return fresh();},
    async new({seed = 1, heroName = 'Agent', path, panel, scenario, url = 'http://localhost/?test_hooks=1'} = {}) {
        const target = new URL(url);
        if(!['localhost', '127.0.0.1'].includes(target.hostname) || target.protocol !== 'http:') throw new Error('Only a localhost test origin is supported.');
        target.searchParams.set('test_hooks', '1');
        if(game) game.close();
        const encoded = path ? readFileSync(safePath(path), 'utf8') : null;
        if(scenario && (path || encoded)) throw new Error('Give scenario or path, not both.');
        // A named scenario boots a copy of a library save; the library file itself is never opened for writing.
        game = await boot(scenario ? await scenarioSave(scenario, {seed}) : null, {seed, heroName, url: target.href});
        if(encoded) await game.importFile(encoded);
        if(panel) await openPanel(panel);
        return fresh();
    },
    look: args => look(args),
    async click({index, key, text: label, panel, value, view}) {
        const g = need();
        if(panel) await openPanel(panel);
        else if(value !== undefined) await selectOption(key, value);
        else if(index !== undefined) {
            const hit = last[index];
            if(!hit) throw new Error(`No action ${index}; call game_look first.`);
            await g.click(hit.el);
        } else if(key) await g.click(key);
        else if(label) {
            const hit = controls(g).find(c => c.el.textContent.trim() === label || c.text === label);
            if(!hit) throw new Error(`No clickable element with text ${label}`);
            await g.click(hit.el);
        }
        else throw new Error('Give index, key, text or panel.');
        return look({view});
    },
    async step({minutes, days, until, view}) {
        const g = need();
        if([minutes != null, days != null, until != null].filter(Boolean).length !== 1) throw new Error('Give exactly one of minutes, days or until.');
        if(until != null && until !== 'event') throw new Error("until must be 'event'.");
        if(minutes != null && !(minutes > 0 && minutes <= 10080)) throw new Error('minutes must be 1 to 10080; use days for longer.');
        if(days != null && !(days > 0 && days <= 400)) throw new Error('days must be above 0 and at most 400.');
        // Same stepper as minutes (RT8: byte-identical to single ticks); days and until:event just lift the per-call cap.
        const advance = await advanceGame(g, minutes != null ? {minutes} : days != null ? {days} : {untilEvent: true, maxMinutes: 400 * 1440});
        return {advance, ...look({view})};
    },
    status() {
        const g = need();
        return {stateHash:sha(canonicalSave(g.snapshot())), time: clock(), location: text('location_name_span'), boots: g.boots, stats: g.stats,
            errors: g.errors.slice(-5).map(e => String(e.message ?? e).slice(0, 300))};
    },
    async save() {
        const saved = await need().save();
        return {hash: sha(canonicalSave(saved)), bytes: JSON.stringify(saved).length, heroCreated: !!saved.global_flags?.is_hero_created};
    },
    async export() {
        const encoded = await need().exportFile();
        mkdirSync(EXPORT_DIR, {recursive: true});
        const path = join(EXPORT_DIR, `save-${randomUUID()}.txt`);
        writeFileSync(path, encoded);
        return {path, bytes: encoded.length};
    },
    async load({path}) {
        await need().importFile(readFileSync(safePath(path), 'utf8'));
        return fresh();
    },
};

function safePath(p) {
    const full = resolve(String(p));
    if(!full.startsWith(EXPORT_DIR + '/')) throw new Error(`Only files under ${EXPORT_DIR} can be loaded.`);
    return full;
}

process.on('message', async ({id, op, args}) => {
    try {send({id, ok: true, result: await ops[op](args ?? {})});}
    catch(error) {send({id, ok: false, error: String(error?.message ?? error)});}
});
send({ready: true});
