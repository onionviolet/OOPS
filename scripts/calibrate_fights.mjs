// P8 (LSD350): run archetype fights across many seeds and print the rate table, with each rate beside its proposed band.
// Usage: node scripts/calibrate_fights.mjs [--seeds N] [--json out.json] [--md out.md]
import '../src/native_battle.js';
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture, joinField, fieldContext} from './field_fixtures.mjs';
import {beginTempoFight, driveTempoFight} from '../src/tempo_fight.js';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), opt = n => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const SEEDS = Number(opt('--seeds') || 200);
const spec = JSON.parse(readFileSync(join(here, 'calibration/fight_cases.json'), 'utf8'));
const base = {agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: .2, crit_multiplier: 1.5, stamina_efficiency: 1};
const profile = attack => ({stats: {...base, attack_points: Math.round(45 * attack)}, attackPower: 8 * attack, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5});
const fighter = (id, name, side, c, extra = {}) => ({id, name, side, speed: 100, hp: c.hp, maxHp: c.hp, stamina: 30, profile: profile(c.attack), perception: c.perception ?? 20, stealth: c.stealth ?? 20, ...extra});

function runCase(c, seed) {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = seed;
    const context = fieldContext(p, 'Village', {vitals: {player: {health: c.player.hp, max_health: c.player.hp, stamina: 30, max_stamina: 30}}});
    const fighters = [fighter('player', 'You', 'a', c.player)];
    if(c.ally) fighters.push(fighter('friend', 'Friend', 'a', {hp: 40, attack: 1}, {moves: ['jab', 'guard', 'tend', 'withdraw'], ally: {...c.ally, protectId: 'player', order: null}}));
    c.foes.forEach((f, i) => fighters.push(fighter(`foe${i + 1}`, `Foe ${i + 1}`, 'b', f)));
    let plan = beginTempoFight(p.state, registry, context, {id: `cal-${c.id}`, title: c.id, conditions: {}, fighters});
    let allyFled = false, allyDown = false, actions = 0, injuries = 0;
    const watch = s => {const b = s.simulation.sessions.player?.nativeBattle; if(!b) return; actions = b.actions; if(b.fighters.friend) {allyFled ||= b.fighters.friend.status === 'left'; allyDown ||= b.fighters.friend.status === 'down';} injuries = Object.keys(b.fighters.player.parts || {}).length;};
    watch(plan.state);
    plan = driveTempoFight(plan.state, registry, context, c.policy || spec.policy);
    const facts = plan.state.actors.player.facts;
    return {result: facts['tempo.lastResult'], harm: !!plan.harmEffects?.length, injuries: plan.harmEffects?.length || 0, allyFled, allyDown, actions};
}

const rows = [];
for(const c of spec.cases) {
    const tally = {won: 0, lost: 0, withdrawn: 0, yielded: 0, allyFled: 0, allyDown: 0, harm: 0}, steps = [];
    for(let seed = 1; seed <= SEEDS; seed++) {
        let r; try { r = runCase(c, seed); } catch(error) { r = {result: 'error'}; tally.error = (tally.error || 0) + 1; }
        if(tally[r.result] !== undefined) tally[r.result]++;
        if(r.harm) tally.harm++;
        steps.push(r.actions ?? 0);
    }
    // allyFled/allyDown are read from the open battle during the run; the headless driver closes the fight, so they are read from the log of the closed fight instead.
    const rate = Object.fromEntries(Object.entries(tally).map(([k, v]) => [k, v / SEEDS]));
    rows.push({id: c.id, say: c.say, seeds: SEEDS, rate, bands: c.bands});
}
// Ally flight needs the battle record: rerun the ally cases stepping one move at a time so the status is visible.
import {nextActor, policyMove, commitTempoMove} from '../src/tempo_fight.js';
for(const row of rows.filter(r => spec.cases.find(c => c.id === r.id).ally)) {
    const c = spec.cases.find(x => x.id === row.id); let fled = 0, down = 0;
    for(let seed = 1; seed <= SEEDS; seed++) {
        const p = joinField(createFieldFixture()); p.state.simulation.seed = seed;
        const context = fieldContext(p, 'Village', {vitals: {player: {health: c.player.hp, max_health: c.player.hp, stamina: 30, max_stamina: 30}}});
        const fighters = [fighter('player', 'You', 'a', c.player), fighter('friend', 'Friend', 'a', {hp: 40, attack: 1}, {moves: ['jab', 'guard', 'tend', 'withdraw'], ally: {...c.ally, protectId: 'player', order: null}}),
            ...c.foes.map((f, i) => fighter(`foe${i + 1}`, `Foe ${i + 1}`, 'b', f))];
        let plan = beginTempoFight(p.state, registry, context, {id: `cal-${c.id}`, title: c.id, conditions: {}, fighters}), seen = {left: false, down: false};
        for(let n = 0; n < 200 && plan.state.simulation.sessions.player; n++) {
            const b = plan.state.simulation.sessions.player.nativeBattle;
            seen.left ||= b.fighters.friend.status === 'left'; seen.down ||= b.fighters.friend.status === 'down';
            plan = commitTempoMove(plan.state, registry, context, policyMove(b, 'player', c.policy || spec.policy));
        }
        if(seen.left) fled++; if(seen.down) down++;
    }
    row.rate.allyFled = fled / SEEDS; row.rate.allyDown = down / SEEDS;
}
const inBand = (v, band) => !band ? '' : (v >= band[0] && v <= band[1] ? 'in band' : 'OUT');
const pct = v => `${Math.round(v * 100)}%`;
const lines = ['| case | won | lost | withdrawn | yielded | ally fled | ally down | player injured | band check |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
for(const r of rows) {
    const checks = Object.entries(r.bands || {}).map(([k, band]) => `${k} ${pct(r.rate[k] ?? 0)} ${inBand(r.rate[k] ?? 0, band)} (${pct(band[0])}-${pct(band[1])})`).join('; ');
    lines.push(`| ${r.id} | ${pct(r.rate.won)} | ${pct(r.rate.lost)} | ${pct(r.rate.withdrawn)} | ${pct(r.rate.yielded)} | ${r.rate.allyFled === undefined ? '-' : pct(r.rate.allyFled)} | ${r.rate.allyDown === undefined ? '-' : pct(r.rate.allyDown)} | ${pct(r.rate.harm)} | ${checks} |`);
}
const table = lines.join('\n');
console.log(`Seeds per case: ${SEEDS}\n\n${table}`);
if(opt('--json')) writeFileSync(opt('--json'), JSON.stringify({seeds: SEEDS, rows}, null, 2));
if(opt('--md')) writeFileSync(opt('--md'), table + '\n');
