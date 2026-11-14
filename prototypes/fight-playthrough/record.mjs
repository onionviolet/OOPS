// Fight playthrough recorder (prototype, CBD279 to CBD287). Runs real engine
// fights headless on fixed seeds and writes a list of frames for player.js.
// Engine-settled: every move, hit, cost, clock value and outcome. Prototype
// pieces, named in the footer of the page: the pause rule, the names and
// labels, the scripted answers at each pause and the names of the fixture's people. The pause
// rule (src/fight_pause.js), its memory, the result blocks and the Gu labels are built. The Gu
// lines and result come from src/fight_text.js.
//   node prototypes/fight-playthrough/record.mjs [out.json]
import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import '../../src/native_battle.js';
import {expeditionRegistry as registry} from '../../src/expedition_content.js';
import {createFieldFixture, joinField, fieldContext} from '../../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove, policyMove} from '../../src/tempo_fight.js';
import {beginContest, defaultChoice, stepContest} from '../../src/contest.js';
import {contestPack} from '../../src/contest_bodies.js';
import {GU_CONTEST as law, wangErDuel} from '../../src/contest_packs/gu_world.js';
import {composeSubstrate, createWorld} from '../../src/world_substrate.js';
import {projectContest, projectTempoFight} from '../../src/fight_view.js';
import {fightLines, fightResult, shownLine} from '../../src/fight_text.js';
import {fightPauseMemory, fightPauseReasons} from '../../src/fight_pause.js';
import {GU_ESSENCE} from '../../src/contest_packs/gu_world.js';
import {createEngineWorld} from '../../src/engine_world.js';
import {guBodyHolder} from '../../src/gu_living_body.js';
import {GU_CONTROL_PROPERTIES} from '../../src/world_packs/gu_first_control.js';
import {GU_MOONBLADE_GUARD, raiseJadeSkin, stepMoonbladeContest} from '../../src/world_packs/gu_moonblade_contest.js';
import {sharedProperties, WORLD_QUANTITIES} from '../../src/world_quantities.js';
import {GU_FIGHT_LABELS, guEntrantFromWorld, guFightCarry, guFightMeans} from '../../src/world_packs/gu_fight_entry.js';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const out = resolve(args[0] ?? resolve(here, '../../work/fight-playthrough/frames.json'));
const frames = [];
const clone = v => JSON.parse(JSON.stringify(v));
const push = frame => frames.push(clone(frame));

// ---------- prototype labels (the contest names no world: request R8) ----------
const NAMES = {fang_yuan: 'You', wang_er: 'Wang Er', hunter_1: 'First hunter', hunter_2: 'Second hunter', hunter_3: 'Third hunter'};
// Move, means and part words are the world's (GU_FIGHT_LABELS); the built-in moves and the fixture's people are named here.
const MOVES = {...GU_FIGHT_LABELS.moves, wait: 'Wait', withdraw: 'Back off', yield: 'Yield'};
const MEANS = GU_FIGHT_LABELS.means;
const name = id => NAMES[id] ?? id;
const cap = s => s[0].toUpperCase() + s.slice(1);

// Labels for src/fight_text.js (prototype world data). The lines themselves come from its patterns.
const LABELS = {seat: 'fang_yuan', names: Object.fromEntries(Object.entries(NAMES).filter(([id]) => id !== 'fang_yuan')), ...GU_FIGHT_LABELS};
const OPENING = {text: 'The pit. Wang Er and three hunters, waiting.', kind: 'open'};
const told = rows => [OPENING, ...fightLines(rows, LABELS).map(l => ({text: shownLine(l), kind: l.turn ? 'turn' : 'plain', at: l.at === null ? undefined : l.at / 10}))];

// Put the prototype's names and labels onto a contest view.
function dress(view) {
    const v = clone(view);
    v.you.name = 'You';
    for (const m of v.you.means) m.label = MEANS[m.id] ?? m.label;
    for (const spot of v.people ?? []) {
        spot.label = `Position ${spot.spot.split(':')[1]}`;
        for (const p of spot.who) { p.name = name(p.id); p.doing = p.doing ? (MOVES[p.doing] ?? p.doing) : null; }
    }
    for (const t of v.things ?? []) { t.label = t.id.includes('bow') ? "Wang Er's bow, on the ground" : t.label; t.spot = t.spot ? `Position ${t.spot.split(':')[1]}` : null; }
    for (const c of v.coming ?? []) { c.name = name(c.who); c.what = c.what ? (MOVES[c.what] ?? c.what) : null; c.target = c.target && c.target !== c.who ? name(c.target) : null; }
    for (const c of v.choices ?? []) {
        c.what = MOVES[c.id] ?? c.what; c.subjectNames = c.subjects.map(name); c.text = null; // the row's text is a design note, not player text
        for (const x of c.cost ?? []) x.what = (MEANS[x.what] ?? x.what).toLowerCase();
        // A bridged move spends through its own working, so the row carries no cost; show that as not given, not as free.
        if (law.moves[c.id]?.bridge) c.cost = null;
    }
    for (const spot of v.people ?? []) for (const p of spot.who) for (const k of p.known) if (k.value === 'wang_er.bow') { k.what = 'holds'; k.value = 'a bow'; }
    for (const c of v.around?.conditions ?? []) {
        if (c.what === 'place') c.value = 'the hunting ground, by the pit';
        if (c.what === 'sunlight') c.value = Number(c.value) >= 70 ? `bright (${c.value})` : c.value;
    }
    return v;
}

// ---------- act 1: the pit duel on the contest engine ----------
function pitDuel({scene, note, essence, remembered = null, answers = {}}) {
    const setup = wangErDuel({essence});
    const rules = composeSubstrate({packs: [contestPack({extra: setup.quantities})]});
    let world = createWorld(rules, {holders: setup.bodies});
    let record = beginContest(law, {id: 'scene', seed: 5, place: setup.place, entrants: setup.entrants, sunDirection: setup.sunDirection}, world);
    let reports = told([]);
    const all = [];
    let seen = 0, lastPick = null, asked = 0, turn = 0, entry = null;
    const base = {act: 'Gu world, contest engine', scene, note, aimText: 'Come out of this standing. They want you dead or gone.'};
    const view = () => dress(projectContest(law, record, world, {seat: 'fang_yuan', title: 'The pit'}));
    push({...base, phase: 'open', view: view(), reports, pause: null});
    for (let n = 0; n < 400 && !record.result; n++) {
        const v = view();
        let choice = null;
        if (v.yourTurn) {
            const policy = v.choices.find(c => c.policy);
            // The pause rule is src/fight_pause.js (CBD56). What it remembers is what the earlier recorded fight left
            // (fightPauseMemory); the first fight of the recording is treated as familiar ground.
            if (turn === 0) entry = fightPauseMemory(v);
            const memory = {...(remembered ?? entry), ...(lastPick && {lastPick})};
            const reason = fightPauseReasons(v, memory, {first: turn === 0})[0]?.text ?? null;
            if (reason && answers[asked] !== undefined) {
                const picked = answers[asked++];
                push({...base, phase: 'pause', view: v, reports, pause: {reason, policy: policy?.id ?? null, picked: null}});
                push({...base, phase: 'picked', view: v, reports, pause: {reason, policy: policy?.id ?? null, picked}});
                if (picked !== policy?.id) choice = {move: picked, target: ['withdraw', 'yield', 'wait'].includes(picked) ? 'fang_yuan' : defaultChoice(law, record, world, 'fang_yuan')?.target ?? 'fang_yuan', why: 'the player chose'};
                lastPick = picked;
            } else lastPick = policy?.id ?? lastPick;
            turn++;
        }
        ({record, world} = stepContest(law, record, rules, world, choice ? {choose: (l, r, w, id) => id === 'fang_yuan' ? choice : defaultChoice(l, r, w, id)} : {}));
        const rows = record.log.slice(seen); seen = record.log.length;
        all.push(...rows);
        const next = told(all), wrote = JSON.stringify(next) !== JSON.stringify(reports);
        reports = next;
        if (wrote && !record.result) push({...base, phase: 'run', view: view(), reports, pause: null});
    }
    // Result by stake (CBD78), built from the engine's outcomes and log.
    const o = record.result.outcomes, final = view();
    const start = setup.bodies.find(b => b.id === 'fang_yuan').quantities;
    const means = ['vitality', 'primeval_essence'].map(id => ({id, before: start[id], after: final.you.means.find(m => m.id === id)?.amount ?? start[id]}));
    const told_ = fightResult({place: 'The pit', seconds: record.result.at / 10, outcomes: o, rows: all, means,
        left: (final.things ?? []).map(t => t.label.replace(/, on the ground$/, '')), asked}, LABELS);
    const result = {head: told_.head, lines: told_.items, turning: told_.turning};
    push({...base, phase: 'result', view: final, reports, pause: null, result});
    return {record, asked, memory: entry};
}

// ---------- act 1b: a fight built from the Gu the fighters keep in the world ----------
// The fighters' Gu lists and Gu moves come from the engine world (gu_fight_entry.js). Attack and evasion are fixture numbers.
function ringFight({scene, note, moonFed}) {
    const config = {packs: ['c.contest', 'l.living_body'], host: {laws: [GU_MOONBLADE_GUARD]}, shared: {
        quantities: [GU_ESSENCE, WORLD_QUANTITIES.stock], properties: [...sharedProperties(['alive']), ...GU_CONTROL_PROPERTIES]}};
    const person = (id, essence) => ({id, kind: 'body', as: ['operator'], place: 'ring', quantities: {vitality: 40, primeval_essence: essence}});
    const gu = (id, kind, keeper, satiety = 30) => ({...guBodyHolder({id: kind, needs: 'gu'}, {id, place: 'ring', satiety}),
        properties: {alive: true, gu_kind: kind, gu_controller: keeper, gu_keeper: keeper}});
    let engine = createEngineWorld({...config, holders: [{id: 'ring', kind: 'place'}, person('artist', 8), person('rival', 8),
        gu('moon', 'moonlight', 'artist', moonFed), gu('light', 'little-light', 'artist'), gu('jade', 'jade-skin', 'artist'), gu('rival-moon', 'moonlight', 'rival')]});
    const before = engine.world, stats = {attack: 1000, evasion: 1};
    let record = beginContest(law, {id: 'ring', seed: 2, place: 'ring', entrants: [guEntrantFromWorld(engine.world, 'artist', stats), guEntrantFromWorld(engine.world, 'rival', stats)]}, engine.world);
    engine = raiseJadeSkin(engine, {id: 'guard', operator: 'artist', guard: 'jade'});
    const labels = {seat: 'artist', names: {rival: 'the rival'}, ...GU_FIGHT_LABELS};
    const opening = {text: 'The ring. You raised Jade Skin before stepping in.', kind: 'open'};
    const tell = rows => [opening, ...fightLines(rows, labels).map(l => ({text: shownLine(l), kind: l.turn ? 'turn' : 'plain'}))];
    const view = () => {
        const v = clone(projectContest(law, record, engine.world, {seat: 'artist', title: 'The ring'}));
        v.you.name = 'You';
        for (const m of v.you.means) m.label = MEANS[m.id] ?? m.label;
        for (const spot of v.people ?? []) { spot.label = 'The ring'; for (const p of spot.who) { p.name = p.id === 'artist' ? 'You' : 'The rival'; p.doing = p.doing ? (labels.moves[p.doing] ?? null) : null; } }
        for (const c of v.coming ?? []) { c.name = c.who === 'artist' ? 'You' : 'The rival'; c.what = c.what ? (labels.moves[c.what] ?? null) : null; c.target = c.target && c.target !== c.who ? (c.target === 'artist' ? 'You' : 'The rival') : null; }
        for (const c of v.choices ?? []) { c.what = labels.moves[c.id] ?? MOVES[c.id] ?? c.what; c.subjectNames = c.subjects.map(id => (id === 'artist' ? 'You' : 'The rival')); c.text = null; c.cost = null; }
        for (const c of v.around?.conditions ?? []) if (c.what === 'place') c.value = 'the practice ring';
        return v;
    };
    const base = {act: 'Gu world, contest engine', scene, note, aimText: 'Win the bout. Each of you brings the Gu you keep.'};
    let reports = tell([]);
    push({...base, phase: 'open', view: view(), reports, pause: null});
    for (let n = 0; n < 60 && !record.result; n++) {
        ({record, engine} = stepMoonbladeContest(record, engine, {startedAt: 0, ticksPerMinute: 6}));
        const next = tell(record.log);
        if (JSON.stringify(next) !== JSON.stringify(reports) && !record.result) push({...base, phase: 'run', view: view(), reports: next, pause: null});
        reports = next;
    }
    const told_ = fightResult({place: 'The ring', seconds: record.result.at / 10, outcomes: record.result.outcomes, rows: record.log,
        means: guFightMeans(before, engine.world, 'artist')}, labels);
    const carry = guFightCarry(record, before, engine.world).filter(r => r.who === 'artist');
    const hungry = carry.filter(r => r.kind === 'hungrier' && r.starved).map(() => 'Moonlight Gu: unfed, will not answer.');
    const left = carry.find(r => r.kind === 'spent');
    const lines = [...told_.items.filter(([k]) => k !== 'Asked'),
        ['After', [left ? `Primeval essence left: ${left.left}.${left.left < 2 ? ' Too little to raise Jade Skin again.' : ''}` : null, ...hungry].filter(Boolean).join(' ') || 'Nothing carried over.'],
        ['Asked', 'Nothing.']];
    push({...base, phase: 'result', view: view(), reports, pause: null, result: {head: told_.head, lines, turning: told_.turning}});
}

// ---------- act 2: a street fight on the tempo engine ----------
function streetFight({scene, note, answers}) {
    const stats = {attack_points: 45, agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: .3, crit_multiplier: 1.5, stamina_efficiency: 1};
    const profile = {stats, attackPower: 8, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
    const KEYS = {loaded: 'fx.loaded.ordinary', carried: 'fx.carried.ordinary'};
    const p = joinField(createFieldFixture());
    p.state.simulation.seed = 7;
    Object.assign(p.state.actors.player.resources, {[KEYS.loaded]: 2, [KEYS.carried]: 4});
    const context = fieldContext(p, 'Village', {vitals: {player: {health: 30, max_health: 30, stamina: 30, max_stamina: 30}}});
    let plan = beginTempoFight(p.state, registry, context, {id: 'fx-play', title: 'Iron Cross Street, in the fog', floor: 1, conditions: {visibility: 'fog', place: 'Iron Cross Street'}, fighters: [
        {id: 'player', name: 'You', side: 'a', speed: 100, hp: 30, stamina: 30, profile, perception: 20, stealth: 20, moves: ['jab', 'guard', 'tend', 'withdraw', 'shoot', 'reload'],
            stock: {kind: 'ordinary', loaded: 2, carried: 4, capacity: 6, batch: 3, keys: KEYS, start: {loaded: 2, carried: 4}, vs: {foe1: {chance: .5, downIn: 3}}}},
        {id: 'foe1', name: 'A man with a cudgel', side: 'b', speed: 60, hp: 60, stamina: 30, profile, perception: 20, stealth: 20}]});
    const battle = () => plan.state.simulation.sessions.player?.nativeBattle ?? null;
    const base = {act: 'Lord of the Mysteries, tempo engine', scene, note, aimText: null};
    const reports = [];
    let prev = [], asked = 0, lastPick = null, final = null;
    // The tempo log is a short tail, so new lines are found by overlap with the last look.
    const sync = b => {
        let overlap = Math.min(prev.length, b.log.length);
        while (overlap && !prev.slice(-overlap).every((line, i) => line === b.log[i])) overlap--;
        for (const line of b.log.slice(overlap)) reports.push({text: line, kind: /empty|wounded|goes down|falls|yield|back away/i.test(line) ? 'turn' : 'plain'});
        prev = [...b.log];
    };
    for (let n = 0; n < 40; n++) {
        const b = battle();
        if (!b || b.result) break;
        sync(b);
        const v = projectTempoFight(b, {stance: 'steady'});
        final = v;
        if (!v.yourTurn) break;
        const policy = v.choices.find(c => c.policy);
        // The same rule on the other engine: nobody here has been fought before, so the first turn asks.
        const reason = fightPauseReasons(v, {knownFoes: [], ...(lastPick && {lastPick})}, {first: n === 0})[0]?.text ?? null;
        let pick = policyMove(b, 'player', 'steady');
        if (reason && answers[asked] !== undefined) {
            const picked = answers[asked++];
            push({...base, phase: 'pause', view: v, reports, pause: {reason, policy: policy?.id ?? null, picked: null}});
            push({...base, phase: 'picked', view: v, reports, pause: {reason, policy: policy?.id ?? null, picked}});
            if (picked !== pick.moveId) pick = {moveId: picked, targetId: ['jab', 'swing', 'shoot'].includes(picked) ? 'foe1' : null};
        } else push({...base, phase: 'run', view: v, reports, pause: null});
        lastPick = pick.moveId;
        plan = commitTempoMove(plan.state, registry, context, pick);
    }
    // The engine closes the fight record with its last move. What it writes back is read here.
    const outcome = plan.state.actors.player.facts['tempo.lastResult'] ?? 'unknown';
    const res = plan.state.actors.player.resources;
    const health = Math.round((plan.vitals?.player?.health ?? 0) * 10) / 10;
    // The result uses the shared block (fight_text.js). Tempo keeps no typed rows, so its own lines are the turning points.
    const ended = {won: 'stood', lost: 'knocked_out', yielded: 'yielded', withdrew: 'withdrew'}[outcome] ?? null;
    const told_ = fightResult({place: 'Iron Cross Street', outcomes: {player: ended}, rows: [], asked,
        means: [{id: 'health', before: 30, after: health}, {id: 'loaded', before: 2, after: res[KEYS.loaded]}, {id: 'carried', before: 4, after: res[KEYS.carried]}],
        turning: reports.filter(r => r.kind === 'turn').map(r => r.text).slice(0, 4)},
    {seat: 'player', life: 'health', names: {}, moves: {}, means: {health: 'Health', loaded: 'Rounds loaded', carried: 'Rounds carried'}, parts: {}});
    const lasting = plan.harmEffects?.length ? [['Lasting', plan.harmEffects.map(h => `${h.partId} ${h.rung}`).join(', ') + '.']] : [];
    push({...base, phase: 'result', view: final, reports, pause: null, result: {head: told_.head, lines: [...told_.items.filter(([k]) => k !== 'Asked'), ...lasting,
        ['Asked', `${asked} decision${asked === 1 ? '' : 's'}.`],
        ['Not kept', 'The engine drops the fight record on its last move, so its closing lines are not shown.']], turning: told_.turning}});
    return {plan};
}

const routine = pitDuel({scene: 'A routine fight that asks nothing',
    note: 'The policy plays the whole fight. Zero prompts. The engine settles every line; the result block picks out the turning points (CBD55, CBD56, CBD64, CBD78).', essence: 16});
pitDuel({scene: 'The same fight on a day something is different',
    note: 'You arrive with 4 essence, enough for one moonblade. The fight pauses twice: once because a means is lower than before, once when the policy\'s move stops being possible (CBD56, CBD57, CBD77).',
    essence: 4, remembered: routine.memory, answers: {0: 'moonlight_gu', 1: 'withdraw'}});
ringFight({scene: 'A fight built from the Gu you keep',
    note: 'Each fighter\'s Gu and Gu moves are read from the world, not written into the fight. You land the combined blade, run dry and have to yield. The After line is what the next activity inherits (CBD41, CBD63, CBD78).', moonFed: 30});
ringFight({scene: 'The same bout with an unfed Gu',
    note: 'The Moonlight Gu went hungry before the release. The move fails, the essence is still spent, and the line says so (the lead audit\'s G8 case, CBD63).', moonFed: 2});
const street = streetFight({scene: 'A different engine on the same screen',
    note: 'A street fight on the tempo engine with two loaded rounds, shown through the same view shape. Parts this engine does not model are marked (CBD191, CBD192).',
    answers: {0: 'shoot', 1: 'reload'}});

await mkdir(dirname(out), {recursive: true});
await writeFile(out, JSON.stringify({recorded: '2026-11-13', seed: 5, frames}));
console.log(out, frames.length, 'frames');
if (process.argv.includes('--print')) for (const f of frames) console.log(f.act.slice(0, 3), f.phase.padEnd(6), f.pause ? `PAUSE ${f.pause.reason} -> ${f.pause.picked}` : '', f.reports.at(-1)?.text ?? '', f.result ? JSON.stringify(f.result) : '');
