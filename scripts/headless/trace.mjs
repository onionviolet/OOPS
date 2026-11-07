#!/usr/bin/env node
// Shared playthrough trace recorder (PAC lane, 2026-11-06). Other quality lanes (openings,
// feedback) and scripts/check_pacing.mjs read its output; keep the schema stable.
//
//   node scripts/headless/trace.mjs --list-starts
//   node scripts/headless/trace.mjs --start village --minutes 2880 --actions 300 --out /tmp/village.jsonl
//   import {recordTrace, listStarts, START_IDS} from './trace.mjs';
//
// It boots a fresh game (seeded, headless), enters the named start through the same
// controls a player uses, then plays a deterministic "unseen first" policy and writes one
// JSON object per line. It never calls window entry points (no teleport, save or load).
// The bot is scripts/headless/lead_bot.mjs, so every press goes through LeadBot.click.
//
// POLICY (default, dial, reason). Default: each step presses the first enabled, visible
// control whose (key, label) it has not pressed, then lets `dt` game minutes pass (10).
// When nothing unseen is left it opens an unseen panel from the "Other known panels"
// select, then repeats a control that paid off before, then waits 60 minutes. Dials:
// --dt (10), --panel-dt (1: opening a panel is a glance), --minutes, --actions, --seed. Reason: it is a lower bound on what a curious player
// finds, with no knowledge of the game, so a long dead stretch here is a stretch where
// nothing visible invites a press. It is not an optimal-play bot and says nothing about
// idle (away) play.
//
// WORK POLICY (--policy work; default, dial, reason). Default: the same walk, but it presses
// the start's own paid or main work first: a work control, a book life's structured action
// (the Beginning panel), the Tingen district's report-in and task buttons. It runs a started
// Village job for one paid round (read from the running activity), then stops it so the pay
// lands (the game banks earnings on stopping). The Village work waits for the opening's first
// payoff, so the talk the screen asks for still comes first. It repeats a work control once it is enabled again
// and waits when the work is running. It picks one of a "Choose ..." set, not every alternative. Everything else falls back to unseen-first. Dials:
// WORK_RX and WORK_AREA below, --dt. Reason: unseen-first is a lower bound that browses
// stat tiles; a player who wants to earn presses the work. The default policy and its
// records are unchanged, so the openings and feedback baselines stay valid.
//
// SCHEMA (schemaVersion 1). Every line has `type`. Every step carries every field; empty
// arrays, never missing keys.
//   {type:'meta', schemaVersion:1, start, seed, policy:{name, dt, panelDt, minutes, actions},
//    startMinute, setup:[{action, ok, note?}], world, location}
//   {type:'step', i, minute, t, action:{kind:'click'|'open-panel'|'repeat'|'wait', selector, label},
//    advanced,            game minutes that passed after the action
//    text:{blocks, new, removed, novel, samples:[str]},   visible text blocks (digits masked
//                          for matching); novel = never seen earlier in this trace
//    reports:[str],       new Reports/log lines this step
//    refusals:[{kind, text}],  click errors, clock stops, newly seen disabled controls
//    money:{now, delta},
//    skills:[{id, level, levelDelta, xpDelta}],   only skills that changed
//    items:[{id, delta, total}],                  hero stack changes (Village-style bag)
//    unlocks:[str],       new ids: avail:<cat>:<id>, quest:<id>:active|finished,
//                          flag:<id>, codex:<id>, panel:<id>
//    changed:{count, buckets:{<top-level key>:n}, samples:[path]}  non-noise save paths
//    progress,            ADDITIVE: {settled, simLog, jobs, gains, packs} absolute counters a book life keeps in its
//                          own records (settled completions on its action rows, the event log length,
//                          running jobs, knowledge/powers/titles gained, a pack's purse and rank). Meta carries `progress0`. The pacing check reads rises.
//    boots}               the runner's boot count (a change means the page reloaded)
//   {type:'end', reason:'minutes'|'actions'|'blocked'|'error', actions, minutes, errors:[str]}
// `t` is minutes since the first step; `minute` is the absolute game clock.
// Noise paths (clock, rng, drift counters, display prefs) are dropped from `changed`.
import {fileURLToPath} from 'node:url';
import {writeFileSync} from 'node:fs';
import {leadBot, TELEPORT_CALLS} from './lead_bot.mjs';

export const SCHEMA_VERSION = 1;
export {TELEPORT_CALLS};
const PANEL_SELECT = '#workspace_navigation select[aria-label="Other known panels"]';

/** Stable start ids. `village` is the default opening; the rest are chosen after it. */
export const START_IDS = Object.freeze([
    'village',
    'book.hp.school', 'book.hp.trade', 'book.hp.lead',
    'book.ss.apprentice', 'book.ss.trial', 'book.ss.company',
    'book.ri.academy', 'book.ri.keeper',
    'lotm.probationer', 'lotm.machinery', 'lotm.storm', 'lotm.civil', 'lotm.beside',
    'soldier.p01',
]);
// Starts that need private packs; skipped (not failed) when the control is missing.
const PRIVATE_STARTS = new Set(['lotm.beside']);

// Controls the policy never presses: they reload, reset, save, import, leave the life, or
// are layout chrome. The runner's confirm() answers yes, so this list is the only guard.
const DENY_KEY = /structured(?:begin|choice)|data-lotm="(?:pick_|enroll)|data-pack-action="[^"]*\.enter"|be_new_life|hard_reset|backup|import|options_|save_|close_options|options_button|workspace-action|control-box|shell-resize|shell-stat-record|panel-path="(?:continuation|lives_carry)"|loading_screen/;
const DENY_TEXT = /new life|start a new|hard reset|import|backup|restart|begin again|reset|delete|abandon|give up|forget|export/i;
// Layout chrome a player does not use to play: module headers, toolbars, filters, stat tiles.
const CHROME = 'nav.workspace-toolbar, .workspace-module-header, .control-box, .control-box-panel, .shell-statline, .inventory-tabs, .workspace-layout-menu, #character_name_div, #basic_character_info_div';
const NAV = '#workspace_navigation';
// Controls that act on the world (people, work, dialogue, fields, packs) come before browsing
// stat tiles and item details: a player presses what the scene offers first.
const ACTION_KEY = /data-(?:native-choice|village-action|dialogue|textline|focus-action|field-command|expedition-action|campaign|lotm|structured|pack-action|action|command|activity|trade|recipe|choice)|^#village_|center_mode_back|entry_back/;
const ACTION_AREA = '.nearby-context-list, .scene-local-tabs, section#next_step, #current_work, [data-native-choice]';
const isAction = c => ACTION_KEY.test(c.key) || !!c.el.closest?.(ACTION_AREA);
// 0 what the place offers (choices, dialogue, focus actions), 1 people and things nearby, 2 other actions,
// 3 back buttons, 4 browsing (stat tiles, item details). Lower first; DOM order breaks ties.
const DOES = /\b(work|gather|forage|train|practice|practise|study|craft|brew|mix|smelt|cook|hunt|fight|chop|mine|read|sell|heal|rest|sleep|patrol|shift|harvest|learn)\b/i;
const TRAVEL = /move somewhere|go to \[|travel|leave the village|walk/i;
const tierOf = c => BACKISH.test(c.text) && isAction(c) ? 3
    : /native-choice/.test(c.key) && DOES.test(c.text) && !TRAVEL.test(c.text) ? -2
    : TRAVEL.test(c.text) && isAction(c) ? 2
    : /data-(?:native-choice|dialogue|textline|focus-action|field-command|expedition-action|campaign|village-action)/.test(c.key) ? 0
    : c.el.closest?.('.nearby-context-list') ? 1 : isAction(c) ? 2 : 4;
const BACKISH = /^(←|back|close|cancel|×|x\b)/i;
// Save paths that move every tick without play meaning.
const NOISE = /^(current time|saved_at|total_playtime|rng|rain_counter|cold_status_counters|placeClocks|message_filters|display_preferences|options|skill_list_state|pacing_e1|awayBank|returnDigest|continuation|expansion\/(clock|rng|sequence|streams)|absorb_local_life\/last\w*|skillRecords\/(schema|rustOn|nearMisses)|skillRecords\/tracked\/[^/]+\/(seen|idle|rust|nm|peak)|character\/(hp_to_full|stamina_to_full|mana_to_full)|game_stats\/total_playtime|content_packs)(\/|$)/;

// --- work policy helpers (--policy work) ---------------------------------------------------
// Where a start keeps its own work: the book lives' Beginning panel rows, native choices, the
// Tingen panel, the scene's task list and a running activity.
export const WORK_AREA = '[data-structured-action], [data-native-choice], #lotm_panel, #current_work, section#next_step, .choice_work, #job_panel';
// Words of a control that is paid or main work. Travel, back and browsing never match.
export const WORK_RX = /\b(find work|work on|work the|pays \d|available from|take (?:a |the )?(?:shift|job|task)|start (?:a |the )?(?:shift|work|job)|begin (?:a |the )?(?:shift|work)|patrol|report (?:in|to)|attend|study|refine|feed|prepare|record|put .* to work|fit |commission|brew|practi[cs]e|craft|gather|train|forage|hunt|mine|chop|cook|sell|heal)/i;

// Tingen panel controls that are tabs, dismissals or map toggles, not tasks.
const LOTM_CHROME = /^(here|path|work & merit|notebook|got it|open continuing|hide |show |decline)/i;

/** Absolute counters a book life keeps in its own records (additive `progress` field). */
export function progressState(game, snap) {
    let settled = 0;
    for(const p of game.$$('[data-structured-row] p')) {const m = /Settled completions:\s*(\d+)/.exec(p.textContent || ''); if(m) settled += +m[1];}
    const sim = snap.expansion?.simulation;
    const size = v => Array.isArray(v) ? v.length : Object.keys(v || {}).length;
    // Real gains in a life's own records: what the hero knows, can do, is called, or has advanced to (per actor).
    const per = v => Array.isArray(v) ? v.length : Object.values(v || {}).reduce((a, x) => a + (x && typeof x === 'object' ? size(x) : 1), 0);
    const gains = ['knowledge', 'powers', 'faculties', 'titles', 'progression'].reduce((a, k) => a + per(sim?.[k]), 0);
    // An optional pack (A Soldier's Life) keeps its own purse and rank in content_packs values.
    let packs = 0;
    for(const pack of Object.values(snap.content_packs?.packs || {})) for(const [k, v] of Object.entries(pack?.values || {})) if(/^(silver|rounds|rank|wage|coin|money)$/.test(k) && Number.isFinite(v)) packs += v;
    return {settled, simLog: size(sim?.log), jobs: size(sim?.jobs), gains, packs};
}

const clean = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const halve = s => {const t = clean(s); const h = t.length / 2; return t.length > 8 && Number.isInteger(h) && t.slice(0, h) === t.slice(h) ? t.slice(0, h) : t;};
const mask = s => s.replace(/\d+(?:[.,:/]\d+)*/g, '#').slice(0, 160);

/** Flatten a snapshot to path -> compact JSON, skipping noise. */
export function flatten(value, out = new Map(), path = '') {
    if(value && typeof value === 'object') {
        const entries = Array.isArray(value) ? value.map((v, i) => [i, v]) : Object.entries(value);
        if(!entries.length) out.set(path, Array.isArray(value) ? '[]' : '{}');
        for(const [k, v] of entries) {
            const p = path ? `${path}/${k}` : String(k);
            if(NOISE.test(p)) continue;
            flatten(v, out, p);
        }
    } else out.set(path, JSON.stringify(value));
    return out;
}
export function diffFlat(a, b, limit = 12) {
    const buckets = {}, samples = []; let count = 0;
    const note = p => {count++; const top = p.split('/')[0]; buckets[top] = (buckets[top] || 0) + 1; if(samples.length < limit) samples.push(p);};
    for(const [p, v] of b) if(a.get(p) !== v) note(p);
    for(const p of a.keys()) if(!b.has(p)) note(p);
    return {count, buckets, samples};
}

function unlockSet(snap, game) {
    const s = new Set();
    for(const [cat, rows] of Object.entries(snap.availabilities || {})) for(const [id, v] of Object.entries(rows || {})) if(v) s.add(`avail:${cat}:${id}`);
    for(const [id, q] of Object.entries(snap.quests || {})) {if(q?.is_finished) s.add(`quest:${id}:finished`); else if(q?.is_active) s.add(`quest:${id}:active`);}
    for(const [id, v] of Object.entries(snap.global_flags || {})) if(v) s.add(`flag:${id}`);
    for(const id of Object.keys(snap.discovery_codex?.seen || {})) s.add(`codex:${id}`);
    for(const o of game.$$(`${PANEL_SELECT} option`)) if(o.value) s.add(`panel:${o.value}`);
    return s;
}
function skillState(game) {
    const m = new Map();
    for(const [id, sk] of Object.entries(game.internals.skills || {})) {
        try {const level = sk.getCurrentLvl?.() ?? 0, xp = sk.getDefaultSkillXP?.().total_xp ?? 0; if(level || xp) m.set(id, {level, xp});} catch {}
    }
    return m;
}
function itemState(snap) {
    const m = new Map();
    for(const [key, row] of Object.entries(snap.inventories?.person?.main_character || {})) {
        let id = key; try {id = JSON.parse(key).id ?? key;} catch {}
        m.set(id, (m.get(id) || 0) + (row?.count ?? 0));
    }
    return m;
}
function visibleBlocks(game) {
    game.css.reset();
    const out = new Map();
    const walk = el => {
        if(['script', 'style', 'option', 'select', 'textarea'].includes(el.localName) || game.css.hiddenReason(el)) return;
        if(!el.classList?.contains('message_common')) {
            let own = '';
            for(const n of el.childNodes) if(n.nodeType === 3) own += ' ' + (n.data ?? n.textContent);
            own = clean(own);
            if(own) {const key = mask(own); if(!out.has(key)) out.set(key, own.slice(0, 160));}
        }
        for(const c of el.children) walk(c);
    };
    walk(game.document.body);
    return out;
}
function reportLines(game) {
    return [...game.$$('#message_log_div .message_common')].map(n => halve(n.textContent)).filter(Boolean);
}
function disabledNow(game) {
    game.css.reset();
    const out = new Map();
    for(const el of game.$$('button[disabled], [aria-disabled="true"]')) {
        if(game.css.hiddenReason(el)) continue;
        const label = clean(el.textContent).slice(0, 70), why = clean(el.getAttribute('title') || el.getAttribute('aria-description') || '').slice(0, 100);
        if(label) out.set(`${label}|${why}`, why ? `${label}: ${why}` : label);
    }
    return out;
}

/** Open a workspace panel through the navigation select, as a player does. */
async function openPanel(game, id) {
    await game.fill(PANEL_SELECT, id);
}

/** Enter a start through the player controls. Returns setup notes, or throws {skip:true}. */
export async function enterStart(game, id) {
    const notes = [];
    const note = (action, ok = true, extra) => notes.push({action, ok, ...(extra ? {note: extra} : {})});
    if(id === 'village') {note('default opening'); return notes;}
    if(id.startsWith('book.')) {
        await openPanel(game, 'beginning'); note('open beginning');
        const sel = game.$('select[data-structured-choice="life"]');
        if(!sel || ![...sel.options].some(o => o.value === id)) throw Object.assign(new Error(`start ${id} not offered`), {skip: true});
        await game.fill(sel, id); note(`choose ${id}`);
        await game.click('[data-structured-begin]'); note('confirm arrival');
    } else if(id.startsWith('lotm.')) {
        const key = id.slice(5);
        await openPanel(game, 'lotm'); note('open lotm');
        const pick = game.$(`[data-lotm="pick_${key}"]`);
        if(!pick) throw Object.assign(new Error(`start ${id} not offered`), {skip: true});
        await game.click(pick); note(`pick ${key}`);
        await game.click(game.$(`[data-lotm="enroll_${key}"]`) ?? game.$('[data-lotm="enroll"]')); note('enroll');
    } else if(id.startsWith('soldier.')) {
        await openPanel(game, 'optional-worlds'); note('open worlds');
        const btn = game.$(`[data-pack-action="${id.slice(8)}.enter"]`);
        if(!btn) throw Object.assign(new Error(`start ${id} not offered`), {skip: true});
        await game.click(btn); note('visit');
    } else throw new Error(`Unknown start ${id}`);
    await game.settle(500);
    return notes;
}

/** Boot a fresh game and list every start it offers right now (data driven). */
export async function listStarts() {
    const bot = await leadBot(null, {seed: 1});
    const out = [{id: 'village', label: 'Village opening (default)', kind: 'default'}];
    try {
        const g = bot.game;
        await openPanel(g, 'beginning');
        for(const o of g.$$('select[data-structured-choice="life"] option')) if(o.value) out.push({id: o.value, label: clean(o.textContent), kind: 'structured'});
        await openPanel(g, 'lotm');
        for(const b of g.$$('[data-lotm^="pick_"]')) {
            const key = b.dataset.lotm.slice(5);
            if(key === 'be') continue; // developer playthrough: private pack, not a player start
            out.push({id: `lotm.${key}`, label: clean(b.textContent), kind: 'lotm', private: PRIVATE_STARTS.has(`lotm.${key}`)});
        }
        await openPanel(g, 'optional-worlds');
        for(const b of g.$$('[data-pack-action$=".enter"]')) out.push({id: `soldier.${b.dataset.packAction.replace(/\.enter$/, '')}`, label: clean(b.textContent), kind: 'pack-visit'});
    } finally {bot.close();}
    return out;
}

/**
 * Record one trace. Options: seed (1), minutes (2880 game minutes), actions (300), dt (10).
 * Returns {meta, steps, end, records}. Throws {skip:true} when the start is not offered.
 */
export async function recordTrace(startId, {seed = 1, minutes = 2880, actions = 300, dt = 10, panelDt = 1, policy = 'unseen-first'} = {}) {
    if(!['unseen-first', 'work'].includes(policy)) throw new Error(`Unknown policy ${policy}`);
    const bot = await leadBot(null, {seed, wallStart: Date.UTC(2026, 0, 1, 12)});
    const g = bot.game, records = [], errors = [];
    try {
        const setup = await enterStart(g, startId);
        const startMinute = g.minutes();
        const meta = {type: 'meta', schemaVersion: SCHEMA_VERSION, start: startId, seed,
            policy: {name: policy, dt, panelDt, minutes, actions}, startMinute, setup,
            world: g.snapshot().expansion?.actors?.player?.worldId ?? null, location: g.internals.current_location?.id ?? null};
        records.push(meta);
        await bot.step(1, {invariants: false}); // first tick initialises passive records; they are not play
        meta.progress0 = progressState(g, g.snapshot());
        let prevSnap = g.snapshot(), prevFlat = flatten(prevSnap), prevUnlocks = unlockSet(prevSnap, g), prevSkills = skillState(g), prevItems = itemState(prevSnap);
        let prevBlocks = visibleBlocks(g), prevReports = reportLines(g), prevDisabled = disabledNow(g);
        const seenBlocks = new Set(prevBlocks.keys()), clickedSigs = new Set(), seenDisabled = new Set(prevDisabled.keys());
        const paid = [], paidSet = new Set(); let paidCursor = 0, stalled = 0, reason = 'actions', n = 0;
        let lastCands = new Set();
        const sig = c => `${c.key}|${mask(c.text).slice(0, 40)}`;
        // Work policy: press the start's own work first (see WORK POLICY in the header).
        let endSince = null, lastWork = new Set(), payoffSeen = false, prevProg = meta.progress0; const chosen = new WeakSet(), pressedChoice = new Set();
        // The nearest ancestor holding two or more "Choose ..." buttons is one choice set: pick one of it.
        const groupOf = el => {for(let e = el.parentElement; e && e !== g.document.body; e = e.parentElement) if([...e.querySelectorAll('button')].filter(b => /^choose /i.test(b.textContent.trim())).length > 1) return e; return el.parentElement;}; const workAt = new Map();
        const chooseWork = () => {
            const cands = g.clickables().filter(c => !c.el.matches?.('input, select, textarea, a, strong, section.workspace-module') && !c.el.closest?.(CHROME)
                && !DENY_KEY.test(c.key) && !DENY_TEXT.test(c.text) && !c.el.closest?.(NAV));
            const end = cands.find(c => c.key === '#action_end_div');
            if(end) {
                // One paid round is gathering_time_needed worked minutes (a Village job: 120); stop just after it.
                const needed = g.internals.current_activity?.gathering_time_needed ?? 120;
                if(endSince == null) endSince = g.minutes();
                if(g.minutes() - endSince > needed) {endSince = null; return {kind: 'click', c: end};}
                return {kind: 'wait', minutes: dt};
            }
            endSince = null;
            // A running book-life job (its Cancel control is showing) is waited out, as a player waits for chores.
            if(cands.some(c => /data-structured-cancel/.test(c.key))) {lastWork = new Set(cands.map(sig)); return {kind: 'wait', minutes: dt};}
            // Native-choice and activity work waits for the opening's first payoff; a book life's own actions never wait.
            const gated = c => !payoffSeen && !/data-structured-action|data-pack-action/.test(c.key) && !c.el.closest?.('#lotm_panel');
            const isWork = c => !/^#ui-disabled/.test(c.key) && !/data-pack-action="[^"]*\.(return|leave|exit)"/.test(c.key) && !BACKISH.test(c.text) && (!TRAVEL.test(c.text) || /data-structured-action/.test(c.key)) && c.el.localName !== 'summary' && !gated(c)
                && !(/^choose /i.test(c.text) && (pressedChoice.has(sig(c)) || chosen.has(groupOf(c.el))))
                && (/data-structured-action|data-pack-action/.test(c.key) || (!!c.el.closest?.('#lotm_panel') && !LOTM_CHROME.test(c.text)) || (WORK_RX.test(c.text) && (!!c.el.closest?.(WORK_AREA) || ACTION_KEY.test(c.key))));
            const work = cands.filter(isWork);
            const fresh = work.filter(c => !clickedSigs.has(sig(c)));
            const appeared = fresh.filter(c => !lastWork.has(sig(c)));
            lastWork = new Set(cands.map(sig));
            // A life's own actions: quick ones before slow ones, and "Wait until ..." last (a player talks before sleeping through the day).
            const cost = c => /data-structured-action/.test(c.key) || c.el.closest?.('#lotm_panel') ? (/^wait/i.test(c.text) ? 1e6 : 0) + (+(/·\s*(\d+)\s*min/.exec(c.text)?.[1] ?? 0)) : 0;
            const byCost = list => [...list].sort((x, y) => cost(x) - cost(y))[0];
            const pick = byCost(appeared) ?? byCost(fresh);
            if(pick) {workAt.set(sig(pick), n); if(/^choose /i.test(pick.text)) {chosen.add(groupOf(pick.el)); pressedChoice.add(sig(pick));} return {kind: 'click', c: pick};}
            const again = work.filter(c => (workAt.get(sig(c)) ?? -9) < n - 1).sort((x, y) => (workAt.get(sig(x)) ?? -9) - (workAt.get(sig(y)) ?? -9))[0];
            if(again) {workAt.set(sig(again), n); return {kind: 'repeat', c: again};}
            // Work was found before but its control is out of sight (a side page is open): step back to the scene, as a player does.
            if(workAt.size) {
                const backs = cands.filter(c => BACKISH.test(c.text) && isAction(c) && (workAt.get('back|' + sig(c)) ?? -9) < n - 1);
                const back = backs.find(c => /beginning/i.test(c.text)) ?? backs[0];
                if(back) {workAt.set('back|' + sig(back), n); return {kind: 'click', c: back};}
            }
            return null;
        };
        const chooseDefault = () => {
            const cands = g.clickables().filter(c => !c.el.matches?.('input, select, textarea, a, strong, section.workspace-module') && !c.el.closest?.(CHROME)
                && !DENY_KEY.test(c.key) && !DENY_TEXT.test(c.text));
            const fresh = cands.filter(c => !clickedSigs.has(sig(c)) && !c.el.closest?.(NAV));
            // Newly revealed controls first (a dialogue's choices, a started job's buttons), then the scene's own actions.
            const appeared = fresh.filter(c => !lastCands.has(sig(c)));
            const rank = list => [...list].sort((x, y) => tierOf(x) - tierOf(y))[0];
            const pick = rank(appeared) ?? rank(fresh);
            if(process.env.TRACE_DEBUG === 'nc') process.stderr.write(`#${n} nc=${cands.filter(c => /native-choice/.test(c.key)).length} all=${[...g.$$('[data-native-choice]')].map(e => g.hiddenReason(e) || 'ok').join(' ; ')}\n`);
            else if(process.env.TRACE_DEBUG) process.stderr.write(`#${n} appeared=${appeared.length} fresh=${fresh.length} :: ` + fresh.slice(0, 12).map(c => (isAction(c) ? 'A ' : '- ') + c.key.slice(0, 30) + ' ' + c.text.replace(/\s+/g, ' ').slice(0, 24)).join(' || ') + '\n');
            lastCands = new Set(cands.map(sig));
            if(pick) return {kind: 'click', c: pick};
            const nav = cands.find(c => !clickedSigs.has(sig(c)) && c.el.closest?.(NAV));
            if(nav) return {kind: 'click', c: nav};
            const panels = [...g.$$(`${PANEL_SELECT} option`)].filter(o => !o.disabled).map(o => o.value).filter(v => v && !clickedSigs.has('panel|' + v) && !/^(continuation|lives_carry)$/.test(v));
            if(panels.length) return {kind: 'open-panel', panel: panels[0]};
            const again = paid.map(s => cands.find(c => sig(c) === s)).filter(Boolean);
            if(again.length) return {kind: 'repeat', c: again[paidCursor++ % again.length]};
            return {kind: 'wait'};
        };
        const choose = () => (policy === 'work' && chooseWork()) || chooseDefault();
        const T = {}; const lap = (k, t0) => {T[k] = (T[k] || 0) + performance.now() - t0;};
        for(; n < actions; n++) {
            if(g.minutes() - startMinute >= minutes) {reason = 'minutes'; break;}
            const m0 = g.minutes(), boots0 = g.boots, refusals = [];
            let tp = performance.now(); const choice = choose(); lap('choose', tp);
            let action = {kind: choice.kind, selector: '', label: ''};
            try {
                if(choice.kind === 'open-panel') {action.selector = `${PANEL_SELECT}=${choice.panel}`; action.label = choice.panel; clickedSigs.add('panel|' + choice.panel); await openPanel(g, choice.panel);}
                else if(choice.kind === 'wait') {action.selector = 'wait'; action.label = `${choice.minutes ?? 60} minutes`;}
                else {action.selector = choice.c.key; action.label = choice.c.text; clickedSigs.add(sig(choice.c)); await bot.click(choice.c.el);}
            } catch(e) {refusals.push({kind: 'action-error', text: clean(e.message).slice(0, 160)});}
            tp = performance.now(); let advanced = 0;
            try {
                await bot.step(choice.kind === 'wait' ? (choice.minutes ?? 60) : choice.kind === 'open-panel' ? panelDt : dt, {invariants: false});
                advanced = g.minutes() - m0;
            } catch(e) {
                refusals.push({kind: /clock stopped/i.test(e.message) ? 'clock-stopped' : 'step-error', text: clean(e.message).slice(0, 160)});
                advanced = Math.max(0, (g.minutes() ?? m0) - m0);
            }
            lap('act+step', tp); tp = performance.now();
            stalled = advanced === 0 ? stalled + 1 : 0;
            const snap = g.snapshot(), flat = flatten(snap), changed = diffFlat(prevFlat, flat);
            const unlocks = [...unlockSet(snap, g)].filter(u => !prevUnlocks.has(u)).sort();
            const skills = [], sk = skillState(g);
            for(const [id, v] of sk) {const p = prevSkills.get(id) ?? {level: 0, xp: 0}; if(v.level !== p.level || v.xp !== p.xp) skills.push({id, level: v.level, levelDelta: v.level - p.level, xpDelta: Math.round((v.xp - p.xp) * 100) / 100});}
            const items = [], it = itemState(snap);
            for(const id of new Set([...it.keys(), ...prevItems.keys()])) {const d = (it.get(id) || 0) - (prevItems.get(id) || 0); if(d) items.push({id, delta: d, total: it.get(id) || 0});}
            lap('state', tp); tp = performance.now();
            const blocks = visibleBlocks(g); let nw = 0, rm = 0; const samples = []; let novel = 0;
            for(const [k, t] of blocks) if(!prevBlocks.has(k)) {nw++; if(!seenBlocks.has(k)) {novel++; if(samples.length < 6) samples.push(t.slice(0, 120));}}
            for(const k of prevBlocks.keys()) if(!blocks.has(k)) rm++;
            for(const k of blocks.keys()) seenBlocks.add(k);
            const rep = reportLines(g), counts = new Map(); for(const r of prevReports) counts.set(r, (counts.get(r) || 0) + 1);
            const reports = []; for(const r of rep) {const c = counts.get(r) || 0; if(c) counts.set(r, c - 1); else reports.push(r.slice(0, 200));}
            lap('text', tp); tp = performance.now();
            const dis = disabledNow(g); for(const [k, t] of dis) if(!seenDisabled.has(k)) {seenDisabled.add(k); if(refusals.length < 8) refusals.push({kind: 'disabled', text: t});}
            const now = snap.character?.money ?? null, was = prevSnap.character?.money ?? null;
            const rec = {type: 'step', i: n, minute: g.minutes(), t: g.minutes() - startMinute, action, advanced,
                text: {blocks: blocks.size, new: nw, removed: rm, novel, samples}, reports: reports.slice(0, 12), refusals,
                money: {now, delta: now != null && was != null ? now - was : 0}, skills, items, unlocks, progress: progressState(g, snap),
                changed: {count: changed.count, buckets: changed.buckets, samples: changed.samples}, boots: g.boots};
            records.push(rec);
            if(unlocks.some(u => u !== 'panel:skills') || items.some(x => x.delta > 0) || rec.money.delta > 0 || rec.progress.settled > prevProg.settled || rec.progress.gains > prevProg.gains || rec.progress.packs > prevProg.packs) payoffSeen = true;
            prevProg = rec.progress;
            if(choice.kind === 'click' && (unlocks.length || items.some(x => x.delta > 0) || skills.some(x => x.levelDelta > 0) || rec.money.delta > 0) && !paidSet.has(sig(choice.c))) {paidSet.add(sig(choice.c)); paid.push(sig(choice.c));}
            if(choice.kind === 'repeat') {
                const payoff = unlocks.length || items.some(x => x.delta > 0) || skills.some(x => x.levelDelta > 0) || rec.money.delta > 0;
                if(!payoff) {const at = paid.indexOf(sig(choice.c)); if(at >= 0) paid.splice(at, 1);}
            }
            prevSnap = snap; prevFlat = flat; prevUnlocks = new Set([...prevUnlocks, ...unlocks]); prevSkills = sk; prevItems = it; prevBlocks = blocks; prevReports = rep; prevDisabled = dis;
            if(stalled >= 6) {reason = 'blocked'; break;}
        }
        if(n >= actions && reason === 'actions' && g.minutes() - startMinute >= minutes) reason = 'minutes';
        if(process.env.TRACE_PROF) process.stderr.write(JSON.stringify(Object.fromEntries(Object.entries(T).map(([k, v]) => [k, Math.round(v)]))) + '\n');
        errors.push(...g.errors.map(e => clean(e).slice(0, 200)).slice(0, 5));
        const end = {type: 'end', reason, actions: n, minutes: g.minutes() - startMinute, errors};
        records.push(end);
        return {meta, steps: records.filter(r => r.type === 'step'), end, records};
    } catch(e) {
        if(e.skip) throw e;
        errors.push(clean(e.stack || e.message).slice(0, 300));
        records.push({type: 'end', reason: 'error', actions: records.filter(r => r.type === 'step').length, minutes: 0, errors});
        return {meta: records[0], steps: records.filter(r => r.type === 'step'), end: records.at(-1), records};
    } finally {bot.close();}
}

function parseArgs(argv) {
    const o = {};
    for(let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if(a === '--list-starts') o.list = true;
        else if(['--start', '--minutes', '--actions', '--dt', '--panel-dt', '--seed', '--out', '--policy'].includes(a)) o[a.slice(2).replace(/-(\w)/g, (_, c) => c.toUpperCase())] = argv[++i];
    }
    return o;
}

if(process.argv[1] === fileURLToPath(import.meta.url)) {
    const o = parseArgs(process.argv.slice(2));
    let text = '';
    let code = 0;
    if(o.list) {
        const starts = await listStarts();
        text = starts.map(s => JSON.stringify(s)).join('\n') + '\n';
    } else if(o.start) {
        try {
            const t = await recordTrace(o.start, {seed: +(o.seed ?? 1), minutes: +(o.minutes ?? 2880), actions: +(o.actions ?? 300), dt: +(o.dt ?? 10), panelDt: +(o.panelDt ?? 1), policy: o.policy ?? 'unseen-first'});
            text = t.records.map(r => JSON.stringify(r)).join('\n') + '\n';
            if(t.end.reason === 'error') code = 2;
        } catch(e) {
            text = JSON.stringify({type: 'meta', schemaVersion: SCHEMA_VERSION, start: o.start, skipped: true, reason: e.message}) + '\n';
            code = e.skip ? 3 : 1;
        }
    } else {
        text = 'usage: trace.mjs --list-starts | --start <id> [--minutes N] [--actions N] [--dt N] [--policy unseen-first|work] [--seed N] [--out file.jsonl]\n';
    }
    if(o.out) writeFileSync(o.out, text); else process.stdout.write(text);
    process.exit(code);
}
