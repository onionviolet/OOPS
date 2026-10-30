import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,tempoView} from '../src/tempo_fight.js';
import {leaveChance,yieldChance,EXIT_DIALS} from '../src/tempo_exit.js';
import {validateNativeBattle,PARTY_HELPER} from '../src/native_battle_contracts.js';
import {fieldCommand} from '../scripts/field_fixtures.mjs';

const stats={attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:0,crit_multiplier:1.5,stamina_efficiency:1};
const profile={stats,attackPower:3,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const ally={goals:{survive:.5,protect:.6,aim:.3,pay:.2},bond:.7,discipline:.5,protectId:'player',order:null};
const spec=(over={})=>({id:'ex',title:'Alley scuffle',conditions:{},fighters:[
    {id:'player',name:'You',side:'a',speed:100,hp:200,maxHp:200,stamina:30,profile,perception:20,stealth:20,...over.player},
    ...(over.withAlly?[{id:PARTY_HELPER,name:'Neil',side:'a',speed:100,hp:200,maxHp:200,stamina:30,profile,perception:20,stealth:20,moves:['jab','guard','withdraw'],ally}]:[]),
    {id:'foe1',name:'Thug',side:'b',speed:100,hp:200,maxHp:200,stamina:30,profile,perception:20,stealth:20,...over.foe}]});
const fresh=seed=>{const p=fieldCommand(joinField(createFieldFixture()),'party.meet');p.state.simulation.seed=seed;
    return {p,context:fieldContext(p,'Village',{vitals:{player:{health:200,max_health:200,stamina:30,max_stamina:30}}})};};
const open=plan=>plan.state.simulation.sessions.player?.nativeBattle;
const one=speed=>1;

test('leaving works better when quicker, worse when tired, hunted by revenge, or in bad footing; a surrender follows the foe\'s goals',()=>{
    const b={conditions:{},fighters:{me:{side:'a',speed:100,stamina:30,maxStamina:30,status:'active'},foe:{side:'b',speed:100,status:'active'}}};
    const base=leaveChance(b,b.fighters.me,one);
    assert.ok(Math.abs(base-EXIT_DIALS.leaveBase.value+EXIT_DIALS.leaveResolve.value*EXIT_DIALS.defaultGoals.value.revenge)<1e-9);
    assert.ok(leaveChance({...b,fighters:{...b.fighters,me:{...b.fighters.me,speed:150}}},{...b.fighters.me,speed:150},one)>base);
    assert.ok(leaveChance(b,{...b.fighters.me,stamina:2},one)<base);
    assert.ok(leaveChance({...b,conditions:{footing:'bad'}},b.fighters.me,one)<base);
    assert.ok(leaveChance({...b,fighters:{...b.fighters,foe:{...b.fighters.foe,goals:{revenge:.9}}}},b.fighters.me,one)<base);
    const forgiving=yieldChance({fighters:{me:b.fighters.me,foe:{...b.fighters.foe,goals:{mercy:.9,revenge:0}}}},b.fighters.me);
    const grim=yieldChance({fighters:{me:b.fighters.me,foe:{...b.fighters.foe,goals:{mercy:0,revenge:.9}}}},b.fighters.me);
    assert.ok(forgiving>.7&&grim<.1);
});
test('a failed try to back away costs a free blow and keeps the fight; a clean exit may leave a friend behind and a follower',()=>{
    let failed=null,clean=null;
    for(let seed=1;seed<80&&!(failed&&clean);seed++){
        const {p,context}=fresh(seed),plan0=beginTempoFight(p.state,registry,context,spec({withAlly:true,foe:{goals:{revenge:.9,mercy:0}}}));
        if(!open(plan0))continue;
        const ready=open(plan0).fighters.player.ready,plan=commitTempoMove(plan0.state,registry,context,{moveId:'withdraw'});
        if(open(plan)&&open(plan).fighters.player.status==='active'&&!failed&&/cut off/.test(open(plan).log.join(' ')))failed={plan,ready};
        if(!open(plan)&&plan.state.actors.player.facts['tempo.lastResult']==='withdrawn'&&!clean&&plan.state.actors.player.facts['tempo.followed_by'])clean=plan;
    }
    assert.ok(failed,'some situations fail the try');
    assert.ok(open(failed.plan).fighters.player.ready-failed.ready>=EXIT_DIALS.turnPenalty.value&&open(failed.plan).fighters.player.tries===1);
    assert.ok(clean,'some succeed');
    assert.equal(clean.state.actors.player.facts['tempo.followed_by'],'foe1','a foe set on revenge follows');
    assert.ok(clean.state.simulation.relationships.player[PARTY_HELPER].memories.some(m=>/You left Neil in the contest/.test(m.text)),'the ally left behind is remembered');
});
test('a surrender is refused by a foe set on revenge and accepted by a merciful one; the fight stays open when refused',()=>{
    let refused=0,accepted=0;
    for(let seed=1;seed<40;seed++){
        const {p,context}=fresh(seed);
        const grim=beginTempoFight(p.state,registry,context,spec({foe:{goals:{revenge:.95,mercy:0}}}));
        if(open(grim)){const r=commitTempoMove(grim.state,registry,context,{moveId:'yield'});if(open(r)&&/refused/.test(open(r).log.join(' ')))refused++;}
        const kind=beginTempoFight(fresh(seed).p.state,registry,context,spec({foe:{goals:{revenge:0,mercy:1}}}));
        if(open(kind)){const r=commitTempoMove(kind.state,registry,context,{moveId:'yield'});if(!open(r)&&r.state.actors.player.facts['tempo.lastResult']==='yielded')accepted++;}
    }
    assert.ok(refused>30&&accepted>25,`refused ${refused}, accepted ${accepted}`);
});
test('keyed: the same moment gives the same answer; an attempt count and goals survive reload; the view shows odds in words',()=>{
    const {p,context}=fresh(4);
    const plan=beginTempoFight(p.state,registry,context,spec({foe:{goals:{revenge:.9,mercy:0}}}));
    const a=commitTempoMove(plan.state,registry,context,{moveId:'yield'}),b=commitTempoMove(plan.state,registry,context,{moveId:'yield'});
    assert.deepEqual(a.state.simulation,b.state.simulation);
    if(open(a)){const loaded=loadExpansionState(JSON.parse(JSON.stringify(a.state)),registry);validateNativeBattle(open({state:loaded}),loaded.simulation.sessions.player,loaded);assert.equal(open({state:loaded}).fighters.foe1.goals.revenge,.9);}
    const v=tempoView(open(plan));
    assert.ok(v.moves.find(m=>m.id==='withdraw').odds&&v.moves.find(m=>m.id==='yield').odds);
});
