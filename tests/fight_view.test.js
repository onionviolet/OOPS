// Shared fight view (proposal, CBD202 and CBD204): one fight from each engine
// projects onto the same shape, and the table of filled, reduced and absent
// parts comes out of the test. Fixtures follow tests/tempo_stock.test.js and
// tests/contest_consumers.test.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove, tempoView, TEMPO_POLICIES} from '../src/tempo_fight.js';
import {composeSubstrate, createWorld} from '../src/world_substrate.js';
import {beginContest, stepContest, serializeContest, restoreContest} from '../src/contest.js';
import {contestPack} from '../src/contest_bodies.js';
import {GU_CONTEST, wangErDuel} from '../src/contest_packs/gu_world.js';
import {FIGHT_VIEW_PARTS, FIGHT_STANCES, validateFightView, fightViewCoverage, projectTempoFight, projectContest} from '../src/fight_view.js';

const stats = {attack_points: 45, agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: .3, crit_multiplier: 1.5, stamina_efficiency: 1};
const profile = {stats, attackPower: 8, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const KEYS = {loaded: 'fx.loaded.ordinary', carried: 'fx.carried.ordinary'};

// A street fight with a loaded revolver, in fog, with the player to act.
function tempoBattle() {
    const p = joinField(createFieldFixture());
    p.state.simulation.seed = 5;
    Object.assign(p.state.actors.player.resources, {[KEYS.loaded]: 3, [KEYS.carried]: 4});
    const context = fieldContext(p, 'Village', {vitals: {player: {health: 30, max_health: 30, stamina: 30, max_stamina: 30}}});
    let plan = beginTempoFight(p.state, registry, context, {id: 'fx-view', title: 'Street shots', floor: 1, conditions: {visibility: 'fog', place: 'Iron Cross Street'}, fighters: [
        {id: 'player', name: 'You', side: 'a', speed: 100, hp: 30, stamina: 30, profile, perception: 20, stealth: 20, moves: ['jab', 'guard', 'tend', 'withdraw', 'shoot', 'reload'],
            stock: {kind: 'ordinary', loaded: 3, carried: 4, capacity: 6, batch: 3, keys: KEYS, start: {loaded: 3, carried: 4}, vs: {foe1: {chance: .5, downIn: 3}}}},
        {id: 'foe1', name: 'Thug', side: 'b', speed: 60, hp: 60, stamina: 30, profile, perception: 20, stealth: 20}]});
    plan = commitTempoMove(plan.state, registry, context, {moveId: 'jab'});
    // The saved fight: what a reload would hand back.
    return JSON.parse(JSON.stringify(plan.state.simulation.sessions.player.nativeBattle));
}

// The Gu pit duel, stepped until Fang Yuan is choosing while someone else's move is in flight.
function contestFight() {
    const scene = wangErDuel();
    const rules = composeSubstrate({packs: [contestPack({extra: scene.quantities})]});
    let world = createWorld(rules, {holders: scene.bodies});
    let record = beginContest(GU_CONTEST, {id: 'scene', seed: 3, place: scene.place, entrants: scene.entrants, sunDirection: scene.sunDirection}, world);
    const waiting = r => {
        const order = Object.entries(r.entrants).filter(([, e]) => e.status === 'in')
            .sort(([a, x], [b, y]) => (x.working?.status === 'running' ? x.working.deadlines[x.working.cursor] : x.ready) - (y.working?.status === 'running' ? y.working.deadlines[y.working.cursor] : y.ready) || (a < b ? -1 : 1));
        return order[0]?.[0] === 'fang_yuan' && !r.entrants.fang_yuan.working && Object.values(r.entrants).some(e => e.working?.status === 'running');
    };
    for (let n = 0; n < 200 && !record.result && !(n > 0 && waiting(record)); n++) ({record, world} = stepContest(GU_CONTEST, record, rules, world));
    assert.ok(!record.result && waiting(record), 'fixture reaches a choice for the seat with a working in flight');
    return {law: GU_CONTEST, record: restoreContest(GU_CONTEST, serializeContest(record)), world};
}

const row = (engine, cover) => `| ${engine} | ${FIGHT_VIEW_PARTS.map(p => cover[p].state).join(' | ')} |`;

test('a saved tempo fight projects to a valid view through tempoView', () => {
    const b = tempoBattle(), before = JSON.stringify(b), tv = tempoView(b);
    const view = projectTempoFight(b);
    assert.equal(JSON.stringify(b), before, 'the projection writes nothing to the battle');
    assert.equal(validateFightView(view), view);
    assert.equal(view.engine, 'tempo');
    assert.equal(view.yourTurn, true);
    assert.deepEqual(view.log.map(l => l.text), tv.lines);
    assert.deepEqual(view.choices.map(c => c.id), tv.moves.map(m => m.id));
    // Each row answers what, how long, what it costs and what it is likely to change, or says it does not know.
    const shoot = view.choices.find(c => c.id === 'shoot'), jab = view.choices.find(c => c.id === 'jab'), reload = view.choices.find(c => c.id === 'reload');
    assert.deepEqual([shoot.what, shoot.time.seconds, shoot.cost, typeof shoot.likely, shoot.blocked], ['Fire', tv.moves.find(m => m.id === 'shoot').cost, [{what: 'loaded round', amount: 1}], 'string', null]);
    assert.equal(jab.cost, null, 'a strike\'s stamina cost is unknown to the view, not zero');
    assert.equal(jab.likely, null);
    assert.equal(reload.blocked, null);
    assert.deepEqual(shoot.subjects, ['foe1']);
    assert.equal(view.choices.filter(c => c.policy).length, 1, 'the steady policy pick is marked');
    assert.deepEqual(view.you.means.map(m => m.id), ['health', 'stamina', 'loaded', 'carried']);
    assert.deepEqual(view.people.map(s => [s.spot, s.label, s.who.map(p => p.relation)]), [['here', 'Iron Cross Street', ['you', 'foe']]]);
    assert.deepEqual(view.around.conditions.find(c => c.what === 'visibility'), {what: 'visibility', value: 'fog'});
    assert.equal(view.things, null);
    assert.ok(view.coming.length >= 2 && view.coming.every(c => c.what === null), 'tempo knows who is next, never what they will do');
    assert.deepEqual(view.manners.map(m => m.id), tv.aims.map(a => a.id));
});

test('a blocked tempo choice keeps the engine\'s own reason', () => {
    const b = tempoBattle();
    b.fighters.player.stock.loaded = 0; b.fighters.player.stock.carried = 0;
    const view = projectTempoFight(b, {stance: 'careful'});
    assert.equal(view.choices.find(c => c.id === 'shoot').blocked, 'The chamber is empty.');
    assert.equal(view.choices.find(c => c.id === 'reload').blocked, 'You have no rounds to load.');
    assert.equal(view.choices.find(c => c.policy).id, 'guard', 'careful reads tempo\'s safe policy');
    const quiet = projectTempoFight(b, {stance: 'quiet'});
    assert.equal(quiet.choices.some(c => c.policy), false);
    assert.ok(quiet.missing.some(m => m.part === 'choices' && /quiet/.test(m.what)), 'a stance tempo cannot play is named, not guessed');
});

test('a saved contest projects to a valid view through entrantView and running workings', () => {
    const {law, record, world} = contestFight(), before = JSON.stringify(record);
    const view = projectContest(law, record, world, {seat: 'fang_yuan'});
    assert.equal(JSON.stringify(record), before, 'the projection writes nothing to the record');
    assert.equal(validateFightView(view), view);
    assert.equal(view.yourTurn, true);
    assert.deepEqual(view.you.means.map(m => m.id).sort(), ['primeval_essence', 'stamina', 'vitality']);
    assert.ok(view.people.length > 1 && view.people.every(s => s.spot.startsWith('line:')), 'people stand at positions on the line');
    assert.equal(view.people.flatMap(s => s.who).length, 5);
    const flying = view.coming.filter(c => c.what !== null);
    assert.ok(flying.length >= 1 && flying.every(c => c.target && c.seconds >= 0), 'running workings fill coming with a move, a target and a time');
    const blade = view.choices.find(c => c.id === 'moonlight_gu'), ids = view.choices.map(c => c.id);
    assert.ok(blade && blade.time.seconds > 0 && blade.likely === null);
    assert.ok(['withdraw', 'yield', 'wait'].every(id => ids.includes(id)));
    assert.equal(view.choices.filter(c => c.policy).length, 1, 'the default chooser\'s pick is marked');
    assert.ok(view.choices.find(c => c.policy).blocked === null, 'the marked row can start');
    assert.ok(view.aim.text === null && view.aim.ends.some(e => e.when === 'vitality runs out' && e.outcome === 'killed'));
    assert.ok(view.log.every(l => l.text === null && l.data), 'contest log rows carry data and no sentence');
    // Short of essence, the essence moves are blocked with a reason and the chooser's pick moves off them.
    const poor = structuredClone(world);
    poor.holders.fang_yuan.quantities.primeval_essence = 0;
    const dry = projectContest(law, record, poor, {seat: 'fang_yuan'});
    assert.ok(dry.choices.some(c => c.blocked), 'a move that cannot start says why');
    assert.ok(dry.choices.filter(c => c.policy).every(c => c.blocked === null));
});

test('the coverage table: filled, reduced and absent parts per engine', () => {
    const tempo = fightViewCoverage(projectTempoFight(tempoBattle()));
    const {law, record, world} = contestFight();
    const contest = fightViewCoverage(projectContest(law, record, world, {seat: 'fang_yuan'}));
    console.log([`| engine | ${FIGHT_VIEW_PARTS.join(' | ')} |`, `|${' --- |'.repeat(FIGHT_VIEW_PARTS.length + 1)}`, row('tempo', tempo), row('contest', contest)].join('\n'));
    for (const [engine, cover] of [['tempo', tempo], ['contest', contest]]) for (const part of FIGHT_VIEW_PARTS)
        for (const what of cover[part].missing) console.log(`${engine} ${part}: ${what}`);
    const states = cover => Object.fromEntries(FIGHT_VIEW_PARTS.map(p => [p, cover[p].state]));
    assert.deepEqual(states(tempo), {aim: 'reduced', you: 'filled', people: 'reduced', things: 'absent', around: 'reduced', coming: 'reduced', choices: 'reduced', log: 'filled'});
    assert.deepEqual(states(contest), {aim: 'reduced', you: 'reduced', people: 'reduced', things: 'reduced', around: 'reduced', coming: 'filled', choices: 'reduced', log: 'reduced'});
});

test('the validator refuses a part that is missing without being named, and a made-up absent part', () => {
    const view = projectTempoFight(tempoBattle());
    assert.throws(() => validateFightView({...view, missing: view.missing.filter(m => m.part !== 'things')}), /things/);
    assert.throws(() => validateFightView({...view, things: []}), /Absent part things/);
    assert.throws(() => validateFightView({...view, parts: {...view.parts, log: 'reduced'}}), /log/);
    assert.throws(() => validateFightView({...view, choices: view.choices.map(c => ({...c, time: {seconds: 0}}))}), /time/);
});

test('stances name policies and wants the engines really have', () => {
    const wants = Object.keys(beginContest(GU_CONTEST, (() => {const s = wangErDuel(); return {id: 'w', seed: 1, place: s.place, entrants: s.entrants};})(),
        createWorld(composeSubstrate({packs: [contestPack({extra: wangErDuel().quantities})]}), {holders: wangErDuel().bodies})).entrants.fang_yuan.wants);
    for (const [name, stance] of Object.entries(FIGHT_STANCES)) {
        assert.ok(stance.tempo === null || TEMPO_POLICIES.includes(stance.tempo), name);
        for (const key of Object.keys(stance.contest ?? {})) assert.ok(wants.includes(key), `${name}: ${key}`);
    }
    assert.deepEqual(Object.values(FIGHT_STANCES).map(s => s.tempo).filter(Boolean).sort(), [...TEMPO_POLICIES].sort(), 'each tempo policy has one stance');
});

test('the contest still names no world, and the view sits beside the engines', () => {
    for (const file of ['src/contest.js', 'src/contest_resolvers.js']) {
        const imports = readFileSync(file, 'utf8').split('\n').filter(l => l.startsWith('import'));
        assert.ok(imports.every(l => !/world_packs|contest_packs|book_|gu_(?!defense)|hp_|lotm|fight_view|tempo_/.test(l)), `${file}: ${imports.join(' | ')}`);
    }
    const mine = readFileSync('src/fight_view.js', 'utf8').split('\n').filter(l => l.startsWith('import'));
    assert.ok(mine.every(l => !/main\.js|world_packs|contest_packs|book_|lotm/.test(l)), mine.join(' | '));
    assert.ok(!/fight_view/.test(readFileSync('src/tempo_fight.js', 'utf8')), 'tempo does not know the view');
});
