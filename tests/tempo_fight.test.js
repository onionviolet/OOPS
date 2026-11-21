import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,driveTempoFight,handOverTempoFight,tempoView,settledTempoRoster,mishapChance,recordTempoHold,TEMPO_MOVES,TEMPO_DIALS} from '../src/tempo_fight.js';
import {applyTechniqueEffect} from '../src/techniques.js';
import {RAT_STEP, RAT_ENEMY} from '../src/technique_content.js';
import {policyMove} from '../src/tempo_fight.js';
import {validateNativeBattle} from '../src/native_battle_contracts.js';

const stats={attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.3,crit_multiplier:1.5,stamina_efficiency:1};
const profile={stats,attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const spec=(over={})=>({id:'fx1',title:'Alley scuffle',conditions:{},fighters:[
    {id:'player',name:'You',side:'a',speed:100,hp:30,stamina:30,profile,perception:6,stealth:6,...over.player},
    {id:'foe1',name:'Thug',side:'b',speed:100,hp:30,stamina:30,profile,perception:6,stealth:6,...over.foe}],...over.top});
function fresh(seed=7){
    const p=joinField(createFieldFixture());p.state.simulation.seed=seed;
    const context=fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}});
    return {p,context};
}
const reload=state=>loadExpansionState(JSON.parse(JSON.stringify(state)),registry);

test('settling a tempo fight preserves outside health and stamina recovery without charging earlier moves again', () => {
    const {p, context} = fresh();
    Object.assign(context.vitals.player, {health: 20, stamina: 13});
    const start = beginTempoFight(p.state, registry, context, spec({
        player: {hp: 20, maxHp: 30, stamina: 13, maxStamina: 30, speed: 200},
        foe: {hp: 60, speed: 60, profile: {...profile, attackPower: 1}},
        top: {stakes: {preset: 'brawl', stopAt: 15}},
    }));
    const mid = commitTempoMove(start.state, registry, {...context, vitals: start.vitals}, {moveId: 'tend'});
    const saved = reload(mid.state), fighter = saved.simulation.sessions.player.nativeBattle.fighters.player;
    assert.deepEqual(fighter.startVitals, {health: 20, stamina: 13});
    assert.ok(fighter.hp > 20 && fighter.stamina < 13, 'the first published move already changed both vitals');
    const invalid = structuredClone(saved);
    invalid.simulation.sessions.player.nativeBattle.fighters.player.startVitals.stamina = -1;
    assert.throws(() => reload(invalid), /Invalid tempo starting vitals/);
    const finish = (state, health = 0, stamina = 0) => driveTempoFight(state, registry, {...context, vitals: {player: {
        ...mid.vitals.player, health: mid.vitals.player.health + health, stamina: mid.vitals.player.stamina + stamina,
    }}}, 'safe');
    const normal = finish(saved);
    assert.equal(normal.state.simulation.sessions.player, undefined);
    const legacy = structuredClone(saved);
    delete legacy.simulation.sessions.player.nativeBattle.fighters.player.startVitals;
    assert.deepEqual(finish(reload(legacy)).vitals, normal.vitals, 'ordinary fights still publish the same vitals');

    const recovered = finish(saved, 3, 5);
    assert.ok(Math.abs(recovered.vitals.player.health - (normal.vitals.player.health + 3)) < 1e-9);
    assert.equal(recovered.vitals.player.stamina, normal.vitals.player.stamina + 5);
    assert.deepEqual(finish(reload(legacy), 3, 5).vitals, normal.vitals, 'older saves keep the old write-back');
});

test('five pack hits teach attack once per opponent kind while each attacker keeps its observation', () => {
    const field = joinField(), context = fieldContext(field);
    const [player, rat] = spec({player: {hp: 60, maxHp: 60}, foe: {speed: 55, tags: ['beast'],
        profile: {...profile, attackPower: 1, stats: {...stats, crit_rate: 0}}, moves: ['jab', 'guard']}}).fighters;
    const pack = Array.from({length: 7}, (_, i) => ({...rat, id: `rat${i + 1}`, name: i === 1 ? 'Cave rat' : 'Wolf rat',
        hp: i === 6 ? 2 : 30, maxHp: 30}));
    const start = beginTempoFight(field.state, registry, context, {id: 'pack-layout', fighters: [player, ...pack],
        conditions: {place: 'Cave depths', light: 'dark', footing: 'firm'}, stakes: {preset: 'hunt', lethal: true}, terms: {beast: 'finish'}});
    const turn = commitTempoMove(start.state, registry, context, {moveId: 'jab', targetId: 'rat7'});
    const fight = turn.state.simulation.sessions.player.nativeBattle;
    assert.equal(fight.hits.filter(hit => hit.target === 'player' && hit.dmg > 0).length, 5);
    assert.equal(tempoView(fight).foes.filter(foe => Number.isFinite(foe.seenAtk)).length, 5);
    assert.deepEqual(fight.log.filter(line => line.startsWith('You know how hard')), [
        'You know how hard Wolf rat hits now: about 1.',
        'You know how hard Cave rat hits now: about 1.',
    ]);
    let state = reload(turn.state);
    for(let i = 0; i < 10 && !state.simulation.sessions.player.nativeBattle.fighters.rat3.seen; i++) {
        state = commitTempoMove(state, registry, context, {moveId: 'guard'}).state;
    }
    const resumed = state.simulation.sessions.player.nativeBattle;
    assert.ok(resumed.fighters.rat3.seen?.blows, 'another wolf rat landed its first hit after reload');
    assert.ok(!resumed.log.some(line => line.startsWith('You know how hard')), 'the discovery has rolled off the log and stays learned');
});

test('tempo observation slots use existing perception, and an empty reserve does not make Moonglow hungry', () => {
    const {p, context} = fresh(3);
    const blade = {label: 'Moonblade', text: 'A crescent of light.', cost: 5, power: 1, spends: {essence: 4}};
    const plan = beginTempoFight(p.state, registry, context, spec({
        player: {hp: 120, maxHp: 120, perception: 20, stealth: 20, kit: {moonblade: blade}, moves: ['jab', 'moonblade'], means: {essence: 0}},
        foe: {speed: 130, perception: 20, stealth: 20, moves: ['jab', 'guard'], profile: {...profile, attackPower: 16}},
    }));
    const battle = plan.state.simulation.sessions.player.nativeBattle;
    const first = tempoView(battle);
    assert.deepEqual(first.foes[0].observations, {attack: 'looks stronger than you', speed: 'faster than you'});
    assert.equal(first.you.moonglow, 'Fed');
    assert.match(first.moves.find(m => m.id === 'moonblade').why, /0 left/);
    battle.fighters.foe1.tags = ['uncanny'];
    battle.fighters.player.kit.moonblade.blocked = 'The Moonglow Gu is hungry and will not cut. Feed it first.';
    const second = tempoView(battle);
    assert.deepEqual(second.foes[0].observations, {});
    assert.equal(second.you.moonglow, 'Hungry');
});

test('a waiting fight saved mid-tempo resumes exactly after reload',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec({player:{hp:60,maxHp:60},foe:{hp:60,maxHp:60}}));
    assert.equal(tempoView(plan.state.simulation.sessions.player.nativeBattle).openedHere, true);
    for(let i=0;i<3&&plan.state.simulation.sessions.player;i++){
        const v=tempoView(plan.state.simulation.sessions.player.nativeBattle);
        assert.ok(v.yourTurn&&v.next.length&&v.moves.length);
        plan=commitTempoMove(plan.state,registry,context,{moveId:i===0?'jab':'guard'});
    }
    assert.ok(plan.state.simulation.sessions.player,'fight still open');
    const loaded=reload(plan.state);
    assert.deepEqual(loaded.simulation.sessions.player.nativeBattle,plan.state.simulation.sessions.player.nativeBattle);
    assert.equal(tempoView(loaded.simulation.sessions.player.nativeBattle).openedHere, false);
    validateNativeBattle(loaded.simulation.sessions.player.nativeBattle,loaded.simulation.sessions.player,loaded);
    const a=commitTempoMove(plan.state,registry,context,{moveId:'guard'}),b=commitTempoMove(loaded,registry,context,{moveId:'guard'});
    assert.deepEqual(a.state.simulation,b.state.simulation);
});
test('earliest-ready acts: a fast fighter acts more often than a slow one',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec({player:{speed:200,perception:20,stealth:20},foe:{speed:100,perception:20,stealth:20}}));
    assert.equal(plan.state.simulation.sessions.player.nativeBattle.surprised,null);
    for(let i=0;i<6&&plan.state.simulation.sessions.player;i++)plan=commitTempoMove(plan.state,registry,context,{moveId:'guard'});
    const b=plan.state.simulation.sessions.player.nativeBattle;
    assert.ok(b.fighters.player.ready<=b.fighters.foe1.ready+4);
});
test('the same seed gives the same fight; a headless driver names its policy',()=>{
    const run=()=>{const {p,context}=fresh(11);return driveTempoFight(beginTempoFight(p.state,registry,context,spec()).state,registry,context,'aggressive');};
    const a=run(),b=run();
    assert.deepEqual(a.state.simulation.log,b.state.simulation.log);
    assert.equal(a.state.simulation.sessions.player,undefined);
    assert.ok(['won','lost'].includes(a.state.actors.player.facts['tempo.lastResult']));
    const {p,context}=fresh();assert.throws(()=>driveTempoFight(p.state,registry,context,'whatever'),/policy/);
});
test('hand-over picks only safe moves and never attacks',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec());
    for(let i=0;i<20&&plan.state.simulation.sessions.player;i++)plan=handOverTempoFight(plan.state,registry,context);
    const open=plan.state.simulation.sessions.player?.nativeBattle;
    if(open)assert.ok(!open.log.some(l=>/^You (hit|miss|meet)/.test(l)),'no attack was made for the player');
    for(const id of ['jab','swing'])assert.equal(TEMPO_MOVES[id].safe,false);
});
test('surprise delays the unaware side and mishaps rise with conditions',()=>{
    const {p,context}=fresh();
    const plan=beginTempoFight(p.state,registry,context,spec({player:{perception:1,stealth:1},foe:{perception:30,stealth:30}}));
    const b=plan.state.simulation.sessions.player.nativeBattle;
    assert.equal(b.surprised,'a');assert.match(b.log[0],/caught off guard/);
    const f=b.fighters.player,calm=mishapChance(b,f);
    b.conditions={light:'dark',footing:'bad',weather:'rain'};
    assert.ok(mishapChance(b,f)>calm);assert.equal(calm,0);
});
test('away minutes are kept and handed to the world after the fight',()=>{
    const {p,context}=fresh(3);
    let plan=beginTempoFight(p.state,registry,context,spec());
    recordTempoHold(90);
    plan=commitTempoMove(plan.state,registry,context,{moveId:'jab'});
    assert.equal(plan.state.simulation.sessions.player.nativeBattle.held,90);
    plan=driveTempoFight(plan.state,registry,context,'aggressive');
    assert.equal(plan.state.actors.player.facts['tempo.held_minutes'],90);
});
test('stale and wrong-turn commands are rejected',()=>{
    const {p,context}=fresh();
    const plan=beginTempoFight(p.state,registry,context,spec());
    assert.throws(()=>commitTempoMove(plan.state,registry,context,{moveId:'jab'},plan.state.sequence-1),/stale/);
    assert.throws(()=>commitTempoMove(plan.state,registry,context,{moveId:'swing',actorId:'foe1'}),/turn|cannot/);
});

import {commitSimulationCommand} from '../src/simulation.js';
import {fieldCommand,fieldAdvance} from '../scripts/field_fixtures.mjs';
test('a tempo contest closes the road rivalry exactly as the native duel does',()=>{
    let p=joinField(createFieldFixture());p.state.simulation.seed=5;
    p=fieldAdvance(fieldCommand(p,'rival.begin'),3);
    const ctx=fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}});
    const requestId=p.state.simulation.pursuits['frontier.road_rival'].request.id;
    const adopt=commitSimulationCommand(p.state,registry,{id:'rival.confront',requestId},{...ctx,targetId:'roadRival'});
    const rival=adopt.state.simulation.people.roadRival;
    let plan=beginTempoFight(adopt.state,registry,ctx,{adopt,id:'rival',title:"Mara's road contest",floor:1,fighters:[
        {id:'player',name:'You',side:'a',hp:30,stamina:30,profile},
        {id:'roadRival',name:'Mara',side:'b',hp:rival.vitals.health,stamina:rival.vitals.stamina,profile}]});
    assert.equal(plan.state.simulation.sessions.player.definitionId,'rival.native_duel');
    plan=driveTempoFight(plan.state,registry,ctx,'aggressive');
    assert.equal(plan.state.simulation.sessions.player,undefined);
    const result=plan.state.actors.player.facts['rival.lastResult'];
    assert.ok(['won','lost','withdrawn'].includes(result));
    assert.notEqual(plan.state.simulation.pursuits['frontier.road_rival'].status,'encounter');
    assert.ok(plan.native);
});

test('a damaging public strike leaves a witnessed memory effect with a severity rung',()=>{
    const {p,context}=fresh(11);
    const plan=driveTempoFight(beginTempoFight(p.state,registry,context,spec()).state,registry,context,'aggressive');
    assert.ok(plan.memoryEffects?.length>0);
    const e=plan.memoryEffects[0];
    assert.ok(e.scene.severity>=1&&e.scene.severity<=4&&e.cause==='battle:fx1');
});

test('away minutes recorded against the open fight survive a reload',()=>{
    const {p,context}=fresh(3);
    const plan=beginTempoFight(p.state,registry,context,spec());
    recordTempoHold(45,plan.state.simulation.sessions.player.nativeBattle);
    const loaded=reload(JSON.parse(JSON.stringify(plan.state)));
    assert.equal(loaded.simulation.sessions.player.nativeBattle.held,45);
});

test('a fight leaves one witnessed memory per pair (worst moment), survives reload, and the per-strike dial is a documented option',()=>{
    const run=()=>{const {p,context}=fresh(11);return driveTempoFight(beginTempoFight(p.state,registry,context,spec()).state,registry,context,'aggressive');};
    const plan=run(),pairs=plan.memoryEffects.map(e=>`${e.holder}>${e.subject}`);
    assert.equal(new Set(pairs).size,pairs.length,'exactly one episode per holder and subject');
    assert.ok(pairs.length>=1&&pairs.length<=2);
    assert.ok(plan.memoryEffects.every(e=>e.scene.severity>=1&&e.amount<0));
    // mid-fight state round-trips with the worst-moment record
    const {p,context}=fresh(11);
    let mid=beginTempoFight(p.state,registry,context,spec());
    for(let i=0;i<3&&mid.state.simulation.sessions.player;i++)mid=commitTempoMove(mid.state,registry,context,{moveId:'jab'});
    const b=mid.state.simulation.sessions.player?.nativeBattle;
    if(b){assert.ok(!mid.memoryEffects?.length,'no per-strike memory while the fight is open');const loaded=reload(mid.state);assert.deepEqual(loaded.simulation.sessions.player.nativeBattle.worst,b.worst);}
    TEMPO_DIALS.witnessPerStrike.value=true;
    try{const many=run();assert.ok(many.memoryEffects.length>pairs.length);}finally{TEMPO_DIALS.witnessPerStrike.value=false;}
});
test('the player\'s contest vitals are readable from one place while the fight is open',()=>{
    const {p,context}=fresh(4);
    let plan=beginTempoFight(p.state,registry,context,spec());
    for(let i=0;i<4&&plan.state.simulation.sessions.player;i++){
        plan=commitTempoMove(plan.state,registry,{...context,vitals:plan.vitals},{moveId:'guard'});
        const b=plan.state.simulation.sessions.player?.nativeBattle;
        if(b)assert.equal(plan.vitals.player.health,Math.max(1,b.fighters.player.hp));
    }
});

test('a fight left by withdrawing still writes its one witnessed memory per pair',()=>{
    let found=null;
    for(let seed=1;seed<60&&!found;seed++){
        const {p,context}=fresh(seed);
        let plan=beginTempoFight(p.state,registry,context,spec({player:{hp:80,maxHp:80},foe:{hp:80,maxHp:80}}));
        for(let i=0;i<8&&plan.state.simulation.sessions.player&&!plan.state.simulation.sessions.player.nativeBattle.worst;i++)plan=commitTempoMove(plan.state,registry,context,{moveId:'jab'});
        if(!plan.state.simulation.sessions.player)continue;
        plan=commitTempoMove(plan.state,registry,context,{moveId:'withdraw'});
        if(!plan.state.simulation.sessions.player&&plan.memoryEffects?.length)found=plan;
    }
    assert.ok(found,'withdrawal ends the fight and carries the worst moments');
    const pairs=found.memoryEffects.map(e=>`${e.holder}>${e.subject}`);
    assert.equal(new Set(pairs).size,pairs.length);
});

test('an exact tie in ready time and speed is settled per fight, not by name (calibration finding)',()=>{
    let first={player:0,foe1:0};
    for(let seed=1;seed<=60;seed++){const {p,context}=fresh(seed);const plan=beginTempoFight(p.state,registry,context,spec({player:{perception:20,stealth:20},foe:{perception:20,stealth:20}}));
        const b=plan.state.simulation.sessions.player?.nativeBattle;if(b)first[b.actions===0?'player':'foe1']++;}
    assert.ok(first.player>10&&first.foe1>10,`both fighters get the first move sometimes (${JSON.stringify(first)})`);
});

test('Rat-step requires earned footwork, uses a live opening and saves its mastery recovery', () => {
    const {p,context} = fresh();
    const actor = p.state.actors.player;
    const technique = operation => applyTechniqueEffect(actor, {techniqueId: RAT_STEP, ...operation},
        {registry, clock: p.state.clock, worldId: actor.worldId, receiptId: `test:${operation.operation}`});
    technique({operation:'observe', enemyId:RAT_ENEMY, route:'field-observation'});
    technique({operation:'understand'});
    technique({operation:'practice', amount:6});
    technique({operation:'own'});
    const battle = result => result.state.simulation.sessions.player.nativeBattle;
    const move = b => tempoView(b).moves.find(m => m.id === 'rat_step');
    assert.equal(move(battle(beginTempoFight(p.state,registry,context,spec()))),undefined);
    context.facts.agility = 8;
    const apprentice = battle(beginTempoFight(p.state,registry,context,spec()));
    assert.equal(move(apprentice).cost,4);
    assert.equal(move(apprentice).usable,false);

    technique({operation:'practice', amount:6});
    let plan = beginTempoFight(p.state,registry,context,spec({foe:{moves:['jab'],profile:{...profile,attackPower:1,stats:{...stats,attack_points:1}}}}));
    assert.equal(move(battle(plan)).cost,3);
    assert.throws(() => commitTempoMove(plan.state,registry,context,{moveId:'rat_step'}),/blow to go wide/);
    for(let i=0; i<8 && !move(battle(plan)).usable; i++) plan = commitTempoMove(plan.state,registry,context,{moveId:'guard'});
    const saved = reload(plan.state), before = saved.simulation.sessions.player.nativeBattle;
    assert.equal(before.fighters.player.ratStep.opening,'foe1');
    assert.match(move(before).recovery,/1 beat less/);
    assert.equal(tempoView(before).moves.find(m => m.id === 'withdraw').cost,3);
    assert.equal(policyMove(before,'player','steady').moveId,'rat_step');
    assert.notEqual(policyMove(before,'player','safe').moveId,'rat_step');
    const after = commitTempoMove(saved,registry,context,{moveId:'rat_step'});
    assert.equal(battle(after).fighters.player.ready - before.fighters.player.ready,3);
    assert.equal(after.state.actors.player.techniques[RAT_STEP].executions,1);
    assert.match(battle(after).log.join(' '),/answer with Rat-step/);
});

test('a downed person can be bound through the existing capture means', () => {
    const {p, context} = fresh();
    const start = beginTempoFight(p.state, registry, context, spec({
        player: {means: {rope: 1}},
        foe: {tags: ['person'], hp: 4, maxHp: 30, moves: ['jab']},
        top: {stakes: {preset: 'mugging', lethal: true}, terms: {person: 'take_alive'}},
    }));
    let plan = start;
    for (let i = 0; i < 12 && !plan.state.simulation.sessions.player?.nativeBattle.fate?.foe1; i++) {
        plan = commitTempoMove(plan.state, registry, context, {moveId: 'jab'});
    }
    const loaded = reload(plan.state);
    const battle = loaded.simulation.sessions.player.nativeBattle;
    const view = tempoView(battle);
    assert.deepEqual(view.fateMoves.map(m => m.id), ['finish', 'spare', 'bind_fate']);
    assert.equal(view.roster.find(row => row.id === 'foe1').posture, 'Down');
    const withoutRope = structuredClone(loaded);
    withoutRope.simulation.sessions.player.nativeBattle.fighters.player.means.rope = 0;
    assert.ok(!tempoView(withoutRope.simulation.sessions.player.nativeBattle).fateMoves.some(m => m.id === 'bind_fate'));
    assert.throws(() => commitTempoMove(withoutRope, registry, context, {moveId: 'bind_fate', targetId: 'foe1'}), /cannot make that move/);
    const bound = commitTempoMove(loaded, registry, context, {moveId: 'bind_fate', targetId: 'foe1'});
    assert.equal(bound.fightEnd[0].end, 'bound');
    assert.equal(bound.state.actors.player.facts['tempo.lastResult'], 'won');
    assert.equal(settledTempoRoster(bound.state.actors.player.facts).find(row => row.id === 'foe1').posture, 'Bound');
});
