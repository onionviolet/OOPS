import test from 'node:test';
import assert from 'node:assert/strict';
import {stageFortunes,fortunesState,validateFortunes,migrateFortunes,projectFortunes,FORTUNE_STAFF,collectFortuneObligations} from '../src/household_fortunes_domain.js';
import '../src/home_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
import {STEWARD,COOK,KEEPER} from '../src/home_work_content.js';
const manor=(o={})=>({id:'manor',access:true,condition:{integrity:100,wetness:0,rainMinutes:0},...o});
const ctx=(o={})=>({people:Object.fromEntries(FORTUNE_STAFF.map(s=>[s.id,{life:'alive',location:'x'}])),jobs:[],staffStock:{},staffFacts:{},
    staffResources:{[STEWARD]:{'home.estateFunds':o.funds??30}},...o.extra});
const mkPlan=clock=>({state:{clock,sequence:1,simulation:{},actors:{}},nativePatch:{}});
const hooks=()=>{const calls={effects:[],jobs:[],logs:[]};return {calls,applyEffects:r=>calls.effects.push(...r),stageJob:j=>calls.jobs.push(j),log:t=>calls.logs.push(t)};};
const run=(clock,c,m=manor(),h=hooks())=>{const plan=mkPlan(clock);stageFortunes(plan,c,{properties:{manor:m}},h);plan.absorbPublish?.();return {plan,...h};};
const load=slice=>domainRegistry.list().find(d=>d.id==='household_fortunes').load(slice);
test('IM9 wired: staged days roll awakenings for staff and publish only through the root plan',()=>{
    load(null);run(0,ctx());
    const r=run(400*1440,ctx());
    assert.equal(r.plan.nativePatch.household_fortunes.lastDay,60);
    assert.ok(fortunesState().lastDay>0&&Object.keys(fortunesState().members).length===4);
    assert.doesNotMatch(JSON.stringify(fortunesState()),/talent/);
});
test('IM10 wired: neglect kills through a life effect and charges the record; old age does not',()=>{
    load(null);run(0,ctx());
    for(let d=60;d<=600;d+=60)run(d*1440,ctx({funds:0,extra:{staffStock:{}}}),manor({condition:{integrity:10,wetness:900,rainMinutes:0}}));
    const m=fortunesState();
    assert.ok(Object.values(m.members).every(x=>x.lack>=40));
    const r=run(660*1440,ctx({funds:0}),manor({condition:{integrity:10,wetness:900,rainMinutes:0}}));
    assert.equal(r.calls.effects.filter(e=>e.type==='life'&&e.lethal).length,4);
    const dead=ctx({funds:0});for(const id of [STEWARD])dead.people[id].life='dead';
    run(670*1440,dead);
    assert.equal(fortunesState().household.ledger.at(-1).cause,'neglect');
    assert.ok(fortunesState().household.standing<0&&fortunesState().household.resentment>0);
    load(null);run(0,ctx());
    const old=ctx();old.people[STEWARD].life='dead';
    run(3500*1440,old);const e=fortunesState().household;
    assert.equal(e.ledger.at(-1).cause,'old_age');assert.equal(e.resentment,0);
});
test('OG16 wired: a routine unlocks from actual completions, holds at a choice, a thin purse and a stop',()=>{
    load(null);
    const go=(c,done=5)=>{const p=mkPlan(1440);p.state.actors={[COOK]:{completed:{'home.staff.cook':done}},[KEEPER]:{completed:{}}};const h=hooks();
        stageFortunes(p,c,{properties:{manor:manor()}},{...h,planStaff:s=>({id:'home.staff.'+s,actor:COOK})});p.absorbPublish?.();return h.calls.jobs;};
    assert.equal(go(ctx(),4).length,0);
    assert.equal(go(ctx()).length,1);
    assert.equal(go(ctx({extra:{jobs:[{actorId:'player',commandId:'x'}]}})).length,0);
    assert.equal(go(ctx({funds:5})).length,0);
    domainRegistry.command('household_fortunes','setRoutinePaused')('daily_meals',true);
    assert.equal(go(ctx()).length,0);
});
test('save slice validates and migrates; absent slice is null, ledger is derived not stored',()=>{
    assert.equal(migrateFortunes(undefined),null);
    const s=migrateFortunes({lastDay:3});validateFortunes(s,10*1440);
    assert.throws(()=>validateFortunes({...s,lastDay:99},10*1440),/ahead/);
    assert.throws(()=>validateFortunes({...s,members:{ghost:{}}},10*1440),/unknown/);
    load(s);assert.equal(JSON.stringify(domainRegistry.save({}).household_fortunes).includes('obligations'),false);
    const l=collectFortuneObligations({career:{debt:5}});assert.deepEqual(l.rows.map(r=>r.id),['career:kitDebt']);
});
