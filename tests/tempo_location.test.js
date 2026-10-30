import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,driveTempoFight,tempoView,policyMove} from '../src/tempo_fight.js';
import {validateNativeBattle} from '../src/native_battle_contracts.js';
import {weights,pickSlot,defenceAt,oddsOf,injuryFor,SLOT_IDS,LOCATION_DIALS} from '../src/tempo_location.js';

const stats={attack_points:45,agility:5,intuition:5,defense:2,attack_count:1,crit_rate:0,crit_multiplier:1.5,stamina_efficiency:1};
const bare={stats,attackPower:9,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const armoured={...bare,armorBySlot:{head:5,torso:5,arms:0,legs:0}};
const spec=(foeProfile,over={})=>({id:'loc',title:'Alley scuffle',conditions:{},fighters:[
    {id:'player',name:'You',side:'a',speed:100,hp:200,maxHp:200,stamina:30,profile:bare,perception:20,stealth:20,...over.player},
    {id:'foe1',name:'Thug',side:'b',speed:100,hp:200,maxHp:200,stamina:30,profile:foeProfile,perception:20,stealth:20,...over.foe}]});
const fresh=seed=>{const p=joinField(createFieldFixture());p.state.simulation.seed=seed;
    return {p,context:fieldContext(p,'Village',{vitals:{player:{health:200,max_health:200,stamina:30,max_stamina:30}}})};};
const open=plan=>plan.state.simulation.sessions.player?.nativeBattle;

test('weights follow stance, move, reach and aim; a pick is one keyed draw over them',()=>{
    const f={profile:bare},t={profile:bare,guard:false},base=weights(f,t,{id:'jab'},null);
    assert.ok(Math.abs(SLOT_IDS.reduce((a,id)=>a+base[id],0)-1)<1e-9);
    assert.ok(weights(f,{...t,guard:true},{id:'jab'},null).head<base.head);
    assert.ok(weights(f,t,{id:'swing'},null).arms>weights(f,t,{id:'jab'},null).arms);
    assert.ok(weights({profile:{...bare,reach:2}},t,{id:'jab'},null).head>base.head);
    const aimed=weights(f,t,{id:'jab'},'legs');assert.ok(aimed.legs>base.legs&&aimed.legs<1);
    assert.equal(pickSlot({head:.1,torso:.5,arms:.2,legs:.2},.05),'head');
    assert.equal(pickSlot({head:.1,torso:.5,arms:.2,legs:.2},.99),'legs');
});
test('armour on the slot a blow lands on stops damage, and a piercing point finds the gap',()=>{
    assert.equal(defenceAt(bare,'head').worn,0);
    const d=defenceAt(armoured,'head');assert.equal(d.worn,5);assert.equal(d.base,Math.max(0,2-10));
    assert.ok(defenceAt(armoured,'head',{split:{piercing:1}}).total<d.total);
    let seen=null;
    for(let seed=1;seed<60&&!seen;seed++){
        const {p,context}=fresh(seed);let plan=beginTempoFight(p.state,registry,context,spec(armoured));
        for(let i=0;i<10&&open(plan)&&!seen;i++){plan=commitTempoMove(plan.state,registry,context,{moveId:'jab'});
            seen=(open(plan)?.hits||[]).find(h=>h.actor==='player'&&h.stopped>0)||null;}
    }
    assert.ok(seen,'a located hit reduced by worn armour');
    assert.ok(SLOT_IDS.includes(seen.slot)&&seen.dmg>=0);
});
test('injuries deepen a part one rung at a time and shift later odds by degree; only the extreme rung blocks',()=>{
    assert.equal(injuryFor(null,1,100,false),null);
    assert.equal(injuryFor(null,10,100,false),'shaken');
    assert.equal(injuryFor('shaken',10,100,false),'bruised');
    assert.equal(injuryFor('wounded',10,100,false),null,'a light blow does not deepen a worse injury');
    assert.equal(injuryFor('wounded',30,100,false),'maimed');
    assert.equal(injuryFor('maimed',40,100,true),null);
    const healthy=oddsOf({parts:{}}),bruised=oddsOf({parts:{hands:'bruised'}}),wounded=oddsOf({parts:{hands:'wounded'}}),maimed=oddsOf({parts:{hands:'maimed'}});
    assert.equal(healthy.accuracy,1);
    assert.ok(bruised.accuracy<1&&wounded.accuracy<bruised.accuracy);
    assert.equal(wounded.allowed,true,'middle path: a wounded part still acts');
    assert.equal(maimed.allowed,false);
    assert.ok(oddsOf({parts:{legs:'wounded'}}).evasion<1&&oddsOf({parts:{legs:'wounded'}}).speed<1);
});
test('a maimed striker cannot strike; policies fall back to safe moves; the view says why',()=>{
    const {p,context}=fresh(3);
    let plan=beginTempoFight(p.state,registry,context,spec(bare,{player:{parts:{hands:'maimed'}}}));
    const v=tempoView(open(plan));
    assert.ok(v.moves.filter(m=>m.id==='jab'||m.id==='swing').every(m=>!m.usable&&/stops you striking/.test(m.why)));
    assert.throws(()=>commitTempoMove(plan.state,registry,context,{moveId:'jab'}),/stops you striking/);
    assert.equal(policyMove(open(plan),'player','aggressive').moveId,'guard');
    assert.ok(v.hurt.some(h=>h.rung==='maimed'));
});
test('located state saves, reloads and replays; the player\'s injuries go out for the harm ladder at the end',()=>{
    const {p,context}=fresh(5);
    let plan=beginTempoFight(p.state,registry,context,spec(bare,{player:{hp:30,maxHp:30}}));
    for(let i=0;i<2&&open(plan);i++)plan=commitTempoMove(plan.state,registry,context,{moveId:'guard'});
    if(open(plan)){
        const loaded=loadExpansionState(JSON.parse(JSON.stringify(plan.state)),registry);
        validateNativeBattle(open({state:loaded}),loaded.simulation.sessions.player,loaded);
        const a=commitTempoMove(plan.state,registry,context,{moveId:'jab',aim:'legs'}),b=commitTempoMove(loaded,registry,context,{moveId:'jab',aim:'legs'});
        assert.deepEqual(a.state.simulation,b.state.simulation);
    }
    let hurt=null;
    for(let seed=1;seed<80&&!hurt;seed++){const f=fresh(seed);
        const end=driveTempoFight(beginTempoFight(f.p.state,registry,f.context,spec(bare,{player:{hp:60,maxHp:60},foe:{hp:60,maxHp:60}})).state,registry,f.context,'aggressive');
        if(end.harmEffects?.length)hurt=end;}
    assert.ok(hurt&&hurt.harmEffects.every(e=>['eyes','hands','legs'].includes(e.partId)&&e.cause.startsWith('fight:')));
});
test('aiming costs time and improves the odds of the chosen spot without making it certain',()=>{
    const {p,context}=fresh(2);
    const plan=beginTempoFight(p.state,registry,context,spec(bare));
    const ready=open(plan).fighters.player.ready,a=commitTempoMove(plan.state,registry,context,{moveId:'jab',aim:'head'}),n=commitTempoMove(plan.state,registry,context,{moveId:'jab'});
    assert.ok(open(a).fighters.player.ready-ready>open(n).fighters.player.ready-ready||!open(a)||!open(n));
    assert.ok(LOCATION_DIALS.aimShare.value<1);
});

test('damage types: a typed profile resists or exposes by kind, the player side learns it, untyped fights keep x1',()=>{
    const typedFoe={...bare,types:{attack:{slashing:1},defense:{bludgeoning:.5,slashing:1}}},tough={...bare,types:{attack:{bludgeoning:1},defense:{bludgeoning:.25}}};
    const run=(me,foe,seed)=>{const {p,context}=fresh(seed);let plan=beginTempoFight(p.state,registry,context,spec(foe,{player:{profile:me}}));
        for(let i=0;i<4&&open(plan);i++)plan=commitTempoMove(plan.state,registry,context,{moveId:'jab'});return plan;};
    let learned=null,noted=false;
    for(let seed=1;seed<40&&!learned;seed++){
        const plan=run({...bare,types:{attack:{bludgeoning:1},defense:{}}},tough,seed),b=open(plan);
        if(b&&Object.keys(b.fighters.foe1.learned||{}).length){learned=b.fighters.foe1.learned;noted=b.log.some(l=>/bludgeoning, resisted/.test(l))&&b.hits.some(h=>h.actor==='player'&&h.multiplier<1&&h.split.bludgeoning>0);}
    }
    assert.ok(learned&&learned.bludgeoning==='resisted'&&noted);
    const plain=run(bare,bare,3),b=open(plain);
    assert.ok(!b||b.hits.every(h=>h.multiplier===1&&h.split.physical===1));
    assert.ok(!b||!/slashing|bludgeoning/.test(b.log.join(' ')),'untyped log text unchanged');
});
