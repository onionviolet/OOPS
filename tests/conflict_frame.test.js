import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as road from '../src/native_battle.js';
import * as party from '../src/party_battle.js';
import * as sluice from '../src/feature_expansion_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {beginFeatureObjects} from '../src/feature_expansion_objects_host.js';
import {enrollReferenceGameplay} from '../src/reference_gameplay_state.js';
import {stageAuditRemainderEnrollment} from '../src/audit_remainder_state.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {createFieldFixture,joinField,fieldCommand,fieldAdvance,fieldContext} from '../scripts/field_fixtures.mjs';

// MD6: the old/new dial is confined to tests. Frozen pre-port bodies import the
// same current domain dependencies, isolating exactly the structural extraction.
// Even the road -> party delegation points at the frozen party implementation.
const legacyURLs=new Map();
async function legacyURL(name) {
    if(legacyURLs.has(name))return legacyURLs.get(name);
    let source=await readFile(new URL(`./fixtures/conflict_frame/${name}.txt`,import.meta.url),'utf8');
    if(name==='native_battle')source=source.replace('"./party_battle.js"',JSON.stringify(await legacyURL('party_battle')));
    source=source.replace(/(['"])\.\/(.*?)\1/g,(_,quote,path)=>quote+new URL(`../src/${path}`,import.meta.url).href+quote);
    const url='data:text/javascript;base64,'+Buffer.from(source+`\n//# sourceURL=f1-legacy-${name}.js`).toString('base64');
    legacyURLs.set(name,url);return url;
}
const oldParty=await import(await legacyURL('party_battle'));
const oldRoad=await import(await legacyURL('native_battle'));
const oldSluice=await import(await legacyURL('feature_expansion_battle'));
const paths={old:{road:oldRoad,party:oldParty,sluice:oldSluice},runner:{road,party,sluice}};
const seeds=[1,17,71,0x12345678,0xffffffff];
const context=p=>fieldContext(p,'Village',{vitals:p.vitals || {player:{health:30,max_health:30,stamina:30,max_stamina:30}}});
const fighter={attackPower:8,stats:{attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.3,crit_multiplier:1.5,stamina_efficiency:1},shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const fighters={player:fighter,roadRival:fighter,partyPartner:fighter};
function setup(kind,seed,api,schema=3) {
    let p=joinField(createFieldFixture());
    // DEV SEEDED replay: initial workshop route is shared; encounter RNG varies.
    p.state.simulation.seed=seed;
    p.gameplay.player.skills.Combat={enabled:true,xp:0};
    if(kind==='sluice') {
        if(schema>=4)p=enrollReferenceGameplay(p.state,context(p));
        if(schema===5){
            p=beginFeatureObjects(p.state,registry,context(p));
            p={...p,state:stageAuditRemainderEnrollment(p.state)};
            p=commitSimulationCommand(p.state,registry,{id:'audit_remainder.enroll'},{...context(p),facts:{...context(p).facts,'reference.workshop.supported':true,'reference.workshop.handsUsable':true}});
        }
        p=fieldAdvance(fieldCommand(p,'feature_battle.inspect'),2);
        return api.initializeFeatureBattle(p.state,registry,{id:'feature_battle.start'},context(p));
    }
    if(kind==='party')p=fieldCommand(p,'party.meet');
    p=fieldAdvance(fieldCommand(p,'rival.begin'),3);
    const requestId=p.state.simulation.pursuits['frontier.road_rival'].request.id;
    if(kind==='party')return api.initializePartyBattle(p.state,registry,{requestId},context(p));
    return api.initializeNativeBattle(commitSimulationCommand(p.state,registry,{id:'rival.confront',requestId},{...context(p),targetId:'roadRival'}));
}
function bindings(p,power=8) {
    const token=sluice.featureBattleToken(p.state);
    return Object.fromEntries(Object.keys(p.state.simulation.sessions.player.nativeBattle.fighters).map(id=>{
        const vitals=id==='player'?context(p).vitals.player:p.state.simulation.people[id].vitals;
        return [id,{...token,ownerId:id,ownership:sluice.featureFighterOwnership(p.state,id),snapshot:{...fighter,attackPower:power,stats:{...fighter.stats,...vitals,attack_speed:1}}}];
    }));
}
function act(p,kind,api,c,power=8) {
    const session=p.state.simulation.sessions.player,b=session.nativeBattle;
    if(kind==='road') {
        if(c.type==='withdraw')return api.withdrawNativeBattle(p.state,registry,context(p));
        return api.commitNativeBattleStrike(p.state,registry,{actorId:c.actorId,targetId:c.targetId,attacker:{...fighter,attackPower:power},target:fighter},context(p));
    }
    if(kind==='party') {
        if(c.type==='withdraw')return api.withdrawPartyBattle(p.state,registry,context(p));
        return api.commitPartyBattleAction(p.state,registry,{sessionId:session.id,sequence:p.state.sequence,action:b.actions,fighters:{...fighters,[c.actorId]:{...fighter,attackPower:power}},...c},context(p));
    }
    return api.commitFeatureBattleAction(p.state,registry,{...api.featureBattleToken(p.state),...c},context(p),bindings(p,power));
}
function saveBytes(p) {
    // Real transaction writer, controlled native envelope. This checks staged
    // bytes, NOT main.js create_save() or browser Export/Import (coordinator gate).
    const envelope={character:{money:100},levels:{person:{main_character:{},oldCraftsman:{}}},inventories:{person:{main_character:{},oldCraftsman:{}}},expansion:p.state};
    let stored;
    const bytes=persistExpansionPlan(p,{createSave:()=>JSON.stringify(envelope),key:'f1',storage:{setItem(key,value){stored=value;}},bindings:{player:{category:'person',id:'main_character'},oldCraftsman:{category:'person',id:'oldCraftsman'}}});
    assert.equal(bytes,stored);return bytes;
}
function same(a,b,label) {
    assert.deepEqual(b,a,label);
    assert.equal(JSON.stringify(b),JSON.stringify(a),label+' plan property/Reports order');
    assert.equal(saveBytes(b),saveBytes(a),label+' native transaction bytes');
}
function reload(p) {return {...JSON.parse(JSON.stringify(p)),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)};}
function replay(kind,seed,script,schema=3) {
    let a=setup(kind,seed,paths.old[kind],schema),b=setup(kind,seed,paths.runner[kind],schema);same(a,b,'admission');
    for(const [c,power=8] of script) {
        const before=JSON.stringify(b);
        const nextA=act(a,kind,paths.old[kind],c,power),nextB=act(b,kind,paths.runner[kind],c,power);
        assert.equal(JSON.stringify(b),before,'input remains untouched');same(nextA,nextB,c.type);
        a=reload(nextA);b=reload(nextB);same(a,b,'reload');
    }
    assert.equal(b.state.simulation.sessions.player,undefined,'script reaches a result');
}
for(const seed of seeds) {
    for(const result of ['won','lost','withdrawn']) {
        test(`road old/runner seed ${seed}: ${result}, empty stamina and saved continuation`,()=>{
            const end=result==='withdrawn'?[{type:'withdraw'}]:[{type:'strike',actorId:result==='won'?'player':'roadRival',targetId:result==='won'?'roadRival':'player'},10000];
            replay('road',seed,[[{type:'strike',actorId:'player',targetId:'roadRival'},0],[{type:'strike',actorId:'roadRival',targetId:'player'},0],end]);
        });
        test(`party old/runner seed ${seed}: guard/redirection/release then ${result}`,()=>{
            const end=result==='withdrawn'?[{type:'withdraw'}]:[{type:'strike',actorId:result==='won'?'player':'roadRival',targetId:result==='won'?'roadRival':'player'},10000];
            replay('party',seed,[[{type:'guard',actorId:'partyPartner',targetId:'player'}],[{type:'strike',actorId:'roadRival',targetId:'player'},0],[{type:'release',actorId:'partyPartner'}],end]);
        });
    }
    for(const schema of [3,4,5])for(const result of ['objective','escaped','won','lost','withdrawn']) {
        test(`sluice schema ${schema} old/runner seed ${seed}: ${result}`,()=>{
            const script=[[{type:'guard',actorId:'player',targetId:'player'}],[{type:'strike',actorId:sluice.FEATURE_HOOK,targetId:'player',...(schema>=4?{technique:'jab'}:{})},0]];
            if(result==='objective')script.push([{type:'strike',actorId:'player',targetId:sluice.FEATURE_SHIELD},10000]);
            if(result==='objective'||result==='escaped')for(let i=0;i<3;i++)script.push([{type:result==='objective'?'objective':'escape',actorId:'player'}]);
            if(result==='withdrawn')script.push([{type:'withdraw',actorId:'player'}]);
            if(result==='lost')script.push([{type:'strike',actorId:sluice.FEATURE_HOOK,targetId:'player',...(schema>=4?{technique:'jab'}:{})},10000]);
            if(result==='won')for(const targetId of [sluice.FEATURE_SHIELD,sluice.FEATURE_HOOK])script.push([{type:'strike',actorId:'player',targetId},10000]);
            replay('sluice',seed,script,schema);
        });
    }
}

test('old/runner stale and invalid moves reject without partial writes',()=>{
    for(const kind of ['road','party','sluice'])for(const dial of ['old','runner']) {
        const api=paths[dial][kind],p=setup(kind,17,api),before=JSON.stringify(p);
        assert.throws(()=>act(p,kind,api,{type:'strike',actorId:'player',targetId:'player'}));
        assert.equal(JSON.stringify(p),before);
        if(kind==='road')assert.throws(()=>api.commitNativeBattleStrike(p.state,registry,{actorId:'player',targetId:'roadRival',attacker:fighter,target:fighter},context(p),p.state.sequence-1),/stale/);
        else if(kind==='party')assert.throws(()=>api.commitPartyBattleAction(p.state,registry,{type:'guard',actorId:'partyPartner',targetId:'player',sequence:p.state.sequence-1},context(p)),/stale/);
        else assert.throws(()=>api.commitFeatureBattleAction(p.state,registry,{...api.featureBattleToken(p.state),sequence:p.state.sequence-1,type:'withdraw',actorId:'player'},context(p)),/earlier session/);
        assert.equal(JSON.stringify(p),before);
    }
});

for(const seed of seeds)for(const kind of ['road','party'])for(const stamina of [0,1]) {
    test(`${kind} old/runner seed ${seed}: starts at ${stamina} stamina`,()=>{
        const a=setup(kind,seed,paths.old[kind]),b=setup(kind,seed,paths.runner[kind]);
        for(const p of [a,b])p.vitals={player:{health:30,max_health:30,stamina,max_stamina:30}};
        const c={type:'strike',actorId:'player',targetId:'roadRival'};
        same(act(a,kind,paths.old[kind],c),act(b,kind,paths.runner[kind],c),'empty/last stamina strike');
    });
}
