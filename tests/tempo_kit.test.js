// Stakes and kit in the live tempo fight (Weibao, 2026-11-14: "refining combat system to account for new possiblity while still being
// familar? and transfering across all the worlds"). A preset sets lethality and endings; kit rows carry spells and Gu moves; a fist can
// kill unless the striker holds back (CFC9, CBC32). One shared start per file, cloned per test.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import '../src/tempo_lead_fights.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {applyEnergyEffect} from '../src/energy_resources.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove, driveTempoFight, nextActor, senseOf, setTempoHoldBack, tempoView, validateTempoBattle} from '../src/tempo_fight.js';
import {tempoStakes, validateTempoKitRow, TEMPO_PRESETS} from '../src/tempo_kit.js';
import {tempoOpener} from '../src/tempo_starters.js';
import {RI_DAY_ITEMS} from '../src/ri_lead_day_facts.js';
import {guLeadLife} from '../src/world_packs/book_gu_lead_life.js';

const stats = {attack_points: 45, agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: .3, crit_multiplier: 1.5, stamina_efficiency: 1};
const profile = {stats, attackPower: 8, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const base = joinField(createFieldFixture());
const context = fieldContext(base, 'Village', {vitals: {player: {health: 30, max_health: 30, stamina: 30, max_stamina: 30}}});

const SPELLS = {
    disarm: {label: 'Expelliarmus', text: 'The Disarming Charm.', cost: 4, power: 0, hit: 1.5, needs: {wand: 1}, takes: {wand: 1}, why: 'Takes the wand from the hand.'},
    bind: {label: 'Petrificus Totalus', text: 'The Full Body-Bind.', cost: 5, power: 0, hit: 1.2, needs: {wand: 1}, binds: true, why: 'Locks the body rigid.'},
};
function fight({stakes, player = {}, foe = {}, seed = 7} = {}) {
    const state = structuredClone(base.state); state.simulation.seed = seed;
    return beginTempoFight(state, registry, context, {id: 'fx-kit', title: 'Kit bout', floor: 1, ...(stakes ? {stakes} : {}), fighters: [
        {id: 'player', name: 'You', side: 'a', speed: 100, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile, perception: 20, stealth: 20, ...player},
        {id: 'foe1', name: 'A rival', side: 'b', speed: 60, hp: 12, maxHp: 12, stamina: 30, maxStamina: 30, profile: {...profile, attackPower: 2}, perception: 20, stealth: 20, ...foe}]});
}
const finish = (plan, policy = 'aggressive') => driveTempoFight(plan.state, registry, context, policy);

test('presets are rows: each names its lethality, the means whose loss ends it, and whether someone steps in', () => {
    for(const [id, p] of Object.entries(TEMPO_PRESETS)) assert.equal(typeof p.lethal, 'boolean', id);
    assert.deepEqual(tempoStakes({preset: 'duel'}).disarm, 'wand');
    assert.equal(tempoStakes({preset: 'hunt', lethal: false}).lethal, false, 'an opener overrides a dial');
    assert.throws(() => tempoStakes({preset: 'nope'}));
});

test('in a lethal fight a fist that drops the foe kills; holding back knocks out; a non-lethal frame knocks out', () => {
    const killed = finish(fight({stakes: {preset: 'hunt'}}));
    assert.equal(killed.fightEnd[0].end, 'killed', 'an ordinary jab can kill (CFC9)');
    const held = fight({stakes: {preset: 'hunt'}});
    setTempoHoldBack(held.state.simulation.sessions.player.nativeBattle, true);
    assert.equal(finish(held).fightEnd[0].end, 'knocked_out', 'the striker held back (CBC32)');
    assert.equal(finish(fight({stakes: {preset: 'brawl'}})).fightEnd[0].end, 'knocked_out');
    assert.equal(finish(fight()).fightEnd[0].end, 'down', 'a fight with no stakes reads as before');
});

test('a spell is a kit row: the Disarming Charm takes the wand and in a duel that ends the foe\'s part', () => {
    let plan = fight({stakes: {preset: 'duel'}, player: {kit: SPELLS, means: {wand: 1}}, foe: {kit: {disarm: SPELLS.disarm}, means: {wand: 1}}});
    const view = tempoView(plan.state.simulation.sessions.player.nativeBattle);
    const row = view.moves.find(m => m.id === 'disarm');
    assert.equal(row.label, 'Expelliarmus'); assert.equal(row.usable, true); assert.match(row.detail, /takes the wand/);
    for(let n = 0; n < 12 && plan.state.simulation.sessions.player; n++) {
        const wand = plan.state.simulation.sessions.player.nativeBattle.fighters.player.means.wand; // disarmed, the player has fists left (SF6)
        plan = commitTempoMove(plan.state, registry, context, {moveId: wand ? 'disarm' : 'jab'});
    }
    assert.equal(plan.fightEnd[0].end, 'disarmed');
    assert.equal(plan.state.actors.player.facts['tempo.lastResult'], 'won');
});

test('a binding cast ends the fight with the foe unharmed, and a spent means blocks the row with a reason', () => {
    let plan = fight({stakes: {preset: 'duel'}, player: {kit: {bind: {...SPELLS.bind, hit: 3}}, means: {wand: 1}}});
    for(let n = 0; n < 12 && plan.state.simulation.sessions.player; n++) plan = commitTempoMove(plan.state, registry, context, {moveId: 'bind'});
    assert.equal(plan.fightEnd[0].end, 'bound');
    const gu = {moonblade: {label: 'Moonblade', text: 'A crescent of light.', cost: 5, power: 1.6, spends: {essence: 4}, why: 'Moonglow Gu.'}};
    plan = fight({stakes: {preset: 'hunt'}, player: {kit: gu, means: {essence: 3}, meansLabels: {essence: 'essence'}}});
    const row = tempoView(plan.state.simulation.sessions.player.nativeBattle).moves.find(m => m.id === 'moonblade');
    assert.equal(row.usable, false); assert.equal(row.why, 'Needs 4 essence; 3 left.');
    assert.throws(() => commitTempoMove(plan.state, registry, context, {moveId: 'moonblade'}), /Needs 4 essence/);
});

test('a Gu move spends essence on use, a killer move names the Gu that fill it, and the run policy uses the kit', () => {
    const gu = {moonblade: {label: 'Moonblade', text: 'A crescent of light.', cost: 5, power: 1.6, spends: {essence: 4}, why: 'Moonglow Gu.'},
        hidden: {label: 'Stone-hidden moonblade', text: 'A cut whose gathering is hidden.', cost: 7, power: 1.8, hit: 1.5, spends: {essence: 6},
            roles: [{role: 'hide', by: 'Stealth Rock Gu'}, {role: 'cut', by: 'Moonglow Gu'}], why: 'Two Gu at once.'}};
    const plan = fight({stakes: {preset: 'hunt'}, player: {kit: gu, means: {essence: 20}}});
    const b = plan.state.simulation.sessions.player.nativeBattle;
    assert.match(tempoView(b).moves.find(m => m.id === 'hidden').detail, /Filled by: hide, Stealth Rock Gu; cut, Moonglow Gu/);
    const after = commitTempoMove(plan.state, registry, context, {moveId: 'hidden'});
    const left = after.state.simulation.sessions.player?.nativeBattle?.fighters.player.means.essence;
    assert.ok(left === undefined || left === 14, `essence ${left}`);
    const done = finish(plan, 'steady');
    assert.equal(done.fightEnd[0].end, 'killed');
});

test('a teacher steps in at the frame\'s time; the saved fight with stakes and kit validates', () => {
    const plan = fight({stakes: {preset: 'duel', stopAt: 6, stopText: 'A teacher arrives and stops it.'}, foe: {hp: 300, maxHp: 300}, player: {kit: SPELLS, means: {wand: 1}}});
    const b = plan.state.simulation.sessions.player.nativeBattle;
    assert.doesNotThrow(() => validateTempoBattle(structuredClone(b), plan.state.simulation.sessions.player));
    const done = finish(plan, 'safe');
    assert.equal(done.fightEnd[0].end, 'stopped');
    assert.equal(done.playerEnd, 'stopped');
    assert.equal(validateTempoKitRow({label: 'x', text: 'y', cost: 0}), false, 'a row costs time');
});

test('each lead world opens its own frame: Tingen deadly, Hogwarts a duel a teacher stops, the wolf hunt reads the Gu held and fed', async () => {
    const {wolfKit} = await import('../src/tempo_lead_fights.js');
    const {tempoOpener} = await import('../src/tempo_starters.js');
    const life = worldId => ({actors: {player: {worldId, facts: {'hp.lead.atSchool': true}}}, simulation: {sessions: {}, knowledge: {player: {}}, energies: {player: {'book.ri.lead.primeval': {reserve: 9}}}}, clock: 0, lotm: {}});
    const inv = ids => ({gameplay: {player: {inventory: Object.fromEntries(ids.map(id => [JSON.stringify({id}), 1]))}}});
    assert.equal(tempoOpener('lotm.lane.knife').quote(life('book.lotm.tingen')).visible, true);
    assert.equal(tempoOpener('lotm.lane.knife').quote(life('book.hp.lead.world')).visible, false, 'each opener stays in its own world');
    assert.equal(tempoOpener('hp.corridor.draco').quote(life('book.hp.lead.world')).visible, true);
    const gu = ['book.ri.lead.moonglow.moonglow_gu', 'book.ri.lead.stone_forest.stealth_rock_gu'];
    const kit = wolfKit(life('book.ri.lead.world'), inv(gu));
    assert.deepEqual(Object.keys(kit), ['moonblade', 'hidden_blade'], 'only the Gu held fill rows');
    assert.match(kit.moonblade.blocked, /hungry/, 'a Moonglow never fed through the day is hungry and will not cut');
    assert.deepEqual(kit.hidden_blade.roles.map(r => r.by), ['Stealth Rock Gu', 'Moonglow Gu']);
    assert.match(tempoOpener('ri.wolf.tide').quote(life('book.ri.lead.world'), inv(gu)).reason, /fists/);
});

test('a wound from the same night\'s patrol is carried into the wolf fight', async () => {
    const {woundCarried} = await import('../src/tempo_lead_fights.js');
    const {tempoOpener} = await import('../src/tempo_starters.js');
    const state = {actors: {player: {worldId: 'book.ri.lead.world', facts: {'book.ri.lead.day.injured': true}}}, simulation: {sessions: {}, knowledge: {player: {}}, energies: {player: {'book.ri.lead.primeval': {reserve: 9}}}}, clock: 0};
    assert.equal(woundCarried(state), true);
    const ctx = {gameplay: {player: {inventory: {[JSON.stringify({id: 'book.ri.lead.moonglow.moonglow_gu'})]: 1}}}};
    const spec = tempoOpener('ri.wolf.tide').spec(state, ctx, {me: profile, vitals: {health: 50, max_health: 60, stamina: 10, max_stamina: 10}, parts: {}, enemyProfile: () => profile});
    assert.equal(spec.fighters[0].hp, 35);
    assert.match(tempoOpener('ri.wolf.tide').quote(state, ctx).reason, /wound/);
});

test('the wolf fight settles its essence spend once alongside outside costs', () => {
    const state = structuredClone(base.state), [policy] = guLeadLife.simulation.energies, essence = policy.id;
    const energies = new Map(registry.simulation.energies).set(essence, policy);
    const extended = {...registry, simulation: {...registry.simulation, energies}};
    const change = (state, operation, fields = {}) => applyEnergyEffect(state, 'player', {operation, energyId: essence, ...fields}, extended.simulation);
    const pool = state => state.simulation.energies.player[essence];
    change(state, 'learn');
    change(state, 'recover', {amount: 20});

    const ctx = {...context, gameplay: {player: {inventory: {[JSON.stringify({id: RI_DAY_ITEMS.whiteJade})]: 1}}}};
    const spec = tempoOpener('ri.wolf.tide').spec(state, ctx, {me: profile, vitals: ctx.vitals.player, enemyProfile: () => profile});
    spec.conditions.footing = 'firm';
    spec.stakes.stopAt = 12;
    const opened = beginTempoFight(state, extended, ctx, spec);
    const mid = commitTempoMove(opened.state, extended, {...ctx, vitals: opened.vitals}, {moveId: 'jade_skin'});
    const battle = state => state.simulation.sessions.player.nativeBattle;
    const restore = state => loadExpansionState(JSON.parse(JSON.stringify(state)), extended);
    const saved = restore(mid.state);
    assert.equal(battle(saved).startEssence, 20);
    assert.equal(battle(saved).fighters.player.means.essence, 18);
    assert.equal(pool(saved).reserve, 20, 'the open fight has only spent from its own copy');
    const invalid = structuredClone(saved);
    battle(invalid).startEssence = 17;
    assert.throws(() => restore(invalid), /Invalid tempo starting essence/);

    const finish = state => driveTempoFight(state, extended, {...ctx, vitals: mid.vitals}, 'safe').state;
    assert.equal(pool(finish(saved)).reserve, 18, 'a normal fight still charges two parts');
    change(saved, 'use', {output: 3, control: 1});
    const settled = finish(saved);
    assert.equal(pool(settled).reserve, 15);
    assert.equal(JSON.parse(settled.actors.player.facts['book.ri.lead.day.wolf_fight']).essenceSpent, 2);

    const legacy = structuredClone(saved);
    delete battle(legacy).startEssence;
    assert.equal(pool(finish(restore(legacy))).reserve, 17, 'an older fight retains the smaller reserve');
    change(saved, 'use', {output: 16, control: 1});
    assert.equal(pool(finish(saved)).reserve, 0, 'settlement floors the reserve at zero');
});

test('a wolf left at the wall by the patrol is fought at night and settles the patrol\'s plain facts', async () => {
    const {tempoOpener} = await import('../src/tempo_starters.js');
    const {RI_WOLF_AT_WALL, RI_WOLF_PART_ITEMS, RI_MEAT_NOTE} = await import('../src/ri_lead_day_facts.js');
    const {riWolfParts, RI_WOLF_TIDE_FACT} = await import('../src/ri_wolf_tide.js');
    const opener = tempoOpener('ri.wolf.tide'), state = {actors: {player: {worldId: 'book.ri.lead.world', facts: {[RI_WOLF_AT_WALL.fact]: true}}},
        simulation: {sessions: {}, knowledge: {player: {}}, energies: {player: {'book.ri.lead.primeval': {reserve: 20}}}}, clock: 5};
    const ctx = {gameplay: {player: {inventory: {[JSON.stringify({id: 'book.ri.lead.moonglow.moonglow_gu'})]: 1}}}};
    assert.match(opener.quote(state, ctx).reason, /at the wall/);
    const spec = opener.spec(state, ctx, {me: profile, vitals: {health: 50, max_health: 60, stamina: 10, max_stamina: 10}, parts: {}, enemyProfile: () => profile});
    assert.equal(spec.id, 'ri-wolf-tide-patrol'); assert.equal(spec.conditions.light, 'dark');
    const merit = JSON.stringify({id: 'book.ri.lead.ear_grass.merit'}), eye = JSON.stringify({id: 'book.ri.lead.ear_grass.cached_wolf_eyes'});
    const settle = (result, wolfEnd, parts) => { const plan = {state: structuredClone(state), gameplay: {player: {inventory: {}}}};
        opener.after(plan, result, {id: spec.id, fighters: {player: {means: {essence: 12}, hp: 40, maxHp: 50, ...(parts ? {parts} : {})}, 'ri.wolf.tide.wolf': {end: wolfEnd, status: 'down'}}}); return plan; };
    const won = settle('won', 'killed');
    assert.equal(won.state.actors.player.facts[RI_WOLF_AT_WALL.fact], false, 'the patrol is free again');
    // Weibao, 2026-11-14: wolf parts, not merit; the board pays for the eye and the tally.
    assert.equal(won.gameplay.player.inventory[merit], undefined, 'no merit from the fight');
    const parts = riWolfParts({large: false});
    for(const [part, n] of Object.entries(parts)) assert.equal(won.gameplay.player.inventory[JSON.stringify({id: RI_WOLF_PART_ITEMS[part]})], n, part);
    assert.equal(won.gameplay.player.inventory[eye], 1);
    assert.match(won.state.simulation.knowledge.player[RI_MEAT_NOTE].value, new RegExp(`${parts.meat} jin`), 'the meat starts its spoil clock');
    assert.equal(won.state.simulation.knowledge.player[RI_MEAT_NOTE].at, 5);
    assert.ok(won.state.actors.player.facts[RI_WOLF_TIDE_FACT], 'the kill is counted against the wolves at the wall');
    const spared = settle('won', 'knocked_out');
    const tally = JSON.stringify({id: RI_WOLF_AT_WALL.tally});
    assert.equal(spared.gameplay.player.inventory[tally], 1, 'a wolf that lived leaves the watch tally');
    assert.equal(spared.gameplay.player.inventory[eye], undefined);
    assert.equal(spared.gameplay.player.inventory[merit], undefined);
    assert.equal(won.state.simulation.energies.player['book.ri.lead.primeval'].reserve, 12);
    assert.equal(JSON.parse(won.state.actors.player.facts['book.ri.lead.day.wolf_fight']).essenceSpent, 8);
    assert.equal(won.state.actors.player.facts['book.ri.lead.day.injured'], undefined);
    const lost = settle('lost', undefined);
    assert.equal(lost.state.actors.player.facts['book.ri.lead.day.injured'], true);
    assert.equal(lost.gameplay.player.inventory[merit], undefined);
    assert.equal(settle('won', 'killed', {arm: 'shaken'}).state.actors.player.facts['book.ri.lead.day.injured'], true, 'a wound taken in a won fight still counts');
});

// Weibao, 2026-11-14: "it all depends, maybe its a choice? like result of fight? more? Can change mid way through and more?"
test('a downing blow in a lethal fight leaves a window: the player finishes or spares with a move, and the fight waits for it', async () => {
    const {offered} = await import('../src/tempo_fight.js');
    let plan = fight({stakes: {preset: 'hunt'}, foe: {hp: 4, maxHp: 30}});
    for(let n = 0; n < 12 && !Object.keys(plan.state.simulation.sessions.player?.nativeBattle?.fate || {}).length; n++) plan = commitTempoMove(plan.state, registry, context, {moveId: 'jab'});
    const b = plan.state.simulation.sessions.player.nativeBattle;
    assert.deepEqual(b.fate, {foe1: 'player'}, 'the fight stays open on the decision');
    assert.equal(b.fighters.foe1.end, 'downed');
    assert.doesNotThrow(() => validateTempoBattle(structuredClone(b), plan.state.simulation.sessions.player), 'a waiting window saves');
    assert.deepEqual(tempoView(b).fateMoves.map(m => m.id), ['finish', 'spare']);
    assert.ok(offered(b, 'player').includes('finish'));
    const spared = commitTempoMove(plan.state, registry, context, {moveId: 'spare', targetId: 'foe1'});
    assert.equal(spared.fightEnd[0].end, 'knocked_out');
    assert.equal(commitTempoMove(plan.state, registry, context, {moveId: 'finish', targetId: 'foe1'}).fightEnd[0].end, 'killed');
});

test('holding back can slip, more often with a blow far too strong for it; a blow far past the body leaves no window', () => {
    const big = {...profile, attackPower: 400};
    const ends = n => Array.from({length: n}, (_, i) => { const p = fight({stakes: {preset: 'hunt'}, seed: 100 + i, player: {profile: big}, foe: {hp: 6, maxHp: 30}});
        setTempoHoldBack(p.state.simulation.sessions.player.nativeBattle, true); return finish(p).fightEnd[0].end; });
    const held = ends(12);
    assert.ok(held.includes('killed'), `an overwhelming blow slips past restraint sometimes: ${held}`);
    assert.ok(held.includes('knocked_out'), `and is held sometimes: ${held}`);
    const outright = finish(fight({stakes: {preset: 'hunt'}, player: {profile: big}, foe: {hp: 6, maxHp: 30}}), 'safe');
    assert.notEqual(outright.fightEnd[0].end, 'downed');
});

test('the stakes shift mid-fight: a knife drawn in temper, a plea, going for the kill', () => {
    const knife = {label: 'Knife thrust', text: 'A stab.', cost: 3, power: 1.3, escalates: true, whenHurt: .7};
    let plan = fight({stakes: {preset: 'mugging'}, foe: {hp: 30, maxHp: 30, profile: {...profile, attackPower: 2}, kit: {knife}, goals: {aim: .2, survive: .5}}});
    const b0 = plan.state.simulation.sessions.player.nativeBattle;
    assert.equal(b0.stakes.lethal, false);
    assert.ok(tempoView(b0).moves.some(m => m.id === 'escalate'), 'a fight that cannot kill offers going for the kill');
    for(let n = 0; n < 20 && plan.state.simulation.sessions.player && !plan.state.simulation.sessions.player.nativeBattle.stakes.lethal; n++) plan = commitTempoMove(plan.state, registry, context, {moveId: 'jab'});
    const b = plan.state.simulation.sessions.player?.nativeBattle;
    assert.ok(b?.stakes.lethal, 'hurt, he drew the knife');
    assert.ok(b.log.some(l => /to the death/.test(l)));
    assert.ok(tempoView(b).moves.some(m => m.id === 'plead'), 'a fight that can kill offers a plea');
    let tries = plan;
    for(let n = 0; n < 8 && tries.state.simulation.sessions.player?.nativeBattle?.stakes.lethal; n++) tries = commitTempoMove(tries.state, registry, context, {moveId: 'plead'});
    assert.equal(tries.state.simulation.sessions.player?.nativeBattle?.stakes.lethal ?? false, false, 'a plea is heard in the end by someone not set on harm');
    const esc = commitTempoMove(fight({stakes: {preset: 'brawl'}}).state, registry, context, {moveId: 'escalate'});
    assert.equal(esc.state.simulation.sessions.player.nativeBattle.stakes.lethal, true);
});

// DU11, PS147: a foe that falls keeps its row, dimmed, so the list does not jump while the fight goes on.
test('a fallen foe keeps its place in the view, marked down, while the rest fight on', () => {
    const state = structuredClone(base.state); state.simulation.seed = 7;
    let plan = beginTempoFight(state, registry, context, {id: 'fx-two', title: 'Two', floor: 1, stakes: {preset: 'brawl'}, fighters: [
        {id: 'player', name: 'You', side: 'a', speed: 100, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile, perception: 20, stealth: 20},
        {id: 'foe1', name: 'A first rival', side: 'b', speed: 60, hp: 1, maxHp: 30, stamina: 30, maxStamina: 30, profile: {...profile, attackPower: 1}, perception: 20, stealth: 20},
        {id: 'foe2', name: 'A second rival', side: 'b', speed: 60, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile: {...profile, attackPower: 1}, perception: 20, stealth: 20}]});
    const order = tempoView(plan.state.simulation.sessions.player.nativeBattle).foes.map(f => f.id);
    for(let n = 0; n < 12; n++) {
        const b = plan.state.simulation.sessions.player?.nativeBattle;
        if(!b || b.fighters.foe1.status !== 'active') break;
        plan = commitTempoMove(plan.state, registry, context, {moveId: 'jab', targetId: 'foe1'});
    }
    const b = plan.state.simulation.sessions.player.nativeBattle, v = tempoView(b);
    assert.notEqual(b.fighters.foe1.status, 'active', 'the first rival is out');
    assert.deepEqual(v.foes.map(f => f.id), order, 'rows keep their order');
    assert.equal(v.foes.find(f => f.id === 'foe1').down, true);
    assert.equal(v.foes.find(f => f.id === 'foe2').down, undefined);
    // DU10: the attack timer. Whoever acts next is full, a fallen foe has none.
    const nextId = nextActor(b), all = [v.you, ...v.foes];
    assert.equal(nextId === 'player' ? v.you.ready : v.foes.find(f => f.id === nextId).ready, 1);
    assert.equal(v.foes.find(f => f.id === 'foe1').ready, null);
    for(const r of all.map(x => x.ready).filter(r => r !== null)) assert.ok(r >= 0 && r <= 1, `ready share in range: ${r}`);
});

// PS236, PS237: a foe is read in words against you; its attack becomes "~N" once it has hit you, with one log line; an uncanny foe gives no read.
test('what you can see of a foe is said in words, and taking its blows teaches its attack', () => {
    const state = structuredClone(base.state); state.simulation.seed = 3;
    let plan = beginTempoFight(state, registry, context, {id: 'fx-read', title: 'Read', floor: 1, stakes: {preset: 'brawl'}, fighters: [
        {id: 'player', name: 'You', side: 'a', speed: 100, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile, perception: 20, stealth: 20},
        {id: 'foe1', name: 'A big rival', side: 'b', speed: 130, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile: {...profile, attackPower: profile.attackPower * 2}, perception: 20, stealth: 20}]});
    let b = plan.state.simulation.sessions.player.nativeBattle;
    assert.equal(tempoView(b).foes[0].sense, 'looks stronger than you, faster than you');
    assert.equal(senseOf({stakes: {uncanny: true}}, b.fighters.foe1, b.fighters.player), null);
    for(let n = 0; n < 12 && !b.fighters.foe1.seen; n++) { plan = commitTempoMove(plan.state, registry, context, {moveId: 'guard'}); b = plan.state.simulation.sessions.player?.nativeBattle; if(!b) break; }
    assert.ok(b?.fighters.foe1.seen, 'the rival landed a blow');
    const v = tempoView(b);
    assert.ok(Number.isFinite(v.foes[0].seenAtk));
    assert.equal(v.lines.filter(l => /^You know how hard a big rival hits now: about \d+\.$/.test(l)).length, 1);
});

// PS238: a rumoured attack can be wrong; the first blow corrects it and the log says so.
test('a wrong rumour is corrected by the first blow, and the log says the rumour was wrong', () => {
    const state = structuredClone(base.state); state.simulation.seed = 3;
    let plan = beginTempoFight(state, registry, context, {id: 'fx-rumour', title: 'Rumour', floor: 1, stakes: {preset: 'brawl'}, fighters: [
        {id: 'player', name: 'You', side: 'a', speed: 100, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile, perception: 20, stealth: 20},
        {id: 'foe1', name: 'The bruiser', side: 'b', speed: 130, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile, perception: 20, stealth: 20, heard: {atk: 99, from: 'Someone at the inn said so.'}}]});
    let b = plan.state.simulation.sessions.player.nativeBattle;
    assert.deepEqual(tempoView(b).foes[0].heard, {atk: 99, from: 'Someone at the inn said so.'});
    for(let n = 0; n < 12 && !b.fighters.foe1.seen; n++) { plan = commitTempoMove(plan.state, registry, context, {moveId: 'guard'}); b = plan.state.simulation.sessions.player?.nativeBattle; if(!b) break; }
    assert.ok(b?.fighters.foe1.seen);
    assert.equal(tempoView(b).lines.filter(l => /^The rumour was wrong: the bruiser hits for about \d+, not 99\.$/.test(l)).length, 1);
    assert.doesNotThrow(() => validateTempoBattle(structuredClone(b), plan.state.simulation.sessions.player));
});
